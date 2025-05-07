import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  createContextualPrismaClient,
  getContextFromRequest,
} from '@/lib/db-context';
import {
  registoObjetivosSchema,
  registoObjetivosUpdateSchema,
} from '@/lib/validations';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    // Create contextual prisma client
    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
      projectId: projectId || undefined,
    });

    // We don't need to add tenant/project filters as they're handled by the contextual client
    const registos =
      await contextualPrisma.registoObjectivosMetasAmbientaisSociais.findMany({
        include: {
          membrosDaEquipa: {
            include: {
              membroEquipa: true,
            },
          },
          tabelasAccoes: {
            include: {
              tabelaAccao: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

    return NextResponse.json(registos);
  } catch (error) {
    console.error('Error fetching registos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar registos de objetivos' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const validationResult = registoObjetivosSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    const { tenantId, projectId, membrosDaEquipa, tabelasAccoes } =
      validatedData;

    // Create the registro without relationships first
    const newRegisto =
      await prisma.registoObjectivosMetasAmbientaisSociais.create({
        data: {
          numeroRefOAndM: validatedData.numeroRefOAndM,
          aspetoRefNumero: validatedData.aspetoRefNumero,
          centroCustos: validatedData.centroCustos,
          objectivo: validatedData.objectivo,
          publicoAlvo: validatedData.publicoAlvo,
          orcamentoRecursos: validatedData.orcamentoRecursos,
          refDocumentoComprovativo: validatedData.refDocumentoComprovativo,
          dataInicio: validatedData.dataInicio,
          dataConclusaoPrevista: validatedData.dataConclusaoPrevista,
          dataConclusaoReal: validatedData.dataConclusaoReal,
          pgasAprovadoPor: validatedData.pgasAprovadoPor,
          dataAprovacao: validatedData.dataAprovacao,
          observacoes: validatedData.observacoes,
          oAndMAlcancadoFechado: validatedData.oAndMAlcancadoFechado,
          assinaturaDirectorGeral: validatedData.assinaturaDirectorGeral,
          data: validatedData.data,
          tenant: {
            connect: {
              id: tenantId,
            },
          },
          project: {
            connect: {
              id: projectId,
            },
          },
        },
      });

    // If membros da equipa were provided, create the relationships
    if (membrosDaEquipa && membrosDaEquipa.length > 0) {
      await Promise.all(
        membrosDaEquipa.map(async (membro) => {
          return prisma.objectivosMetasOnMembrosEquipa.create({
            data: {
              objetivoMetaId: newRegisto.id,
              membroEquipaId: membro.membroEquipaId,
              assignedAt: membro.assignedAt || new Date(),
            },
          });
        })
      );
    }

    // If tabelas accoes were provided, create the relationships
    if (tabelasAccoes && tabelasAccoes.length > 0) {
      await Promise.all(
        tabelasAccoes.map(async (tabelaAccao) => {
          return prisma.objectivosMetasOnTabelaAccoes.create({
            data: {
              objetivoMetaId: newRegisto.id,
              tabelaAccaoId: tabelaAccao.tabelaAccaoId,
              assignedAt: tabelaAccao.assignedAt || new Date(),
            },
          });
        })
      );
    }

    // Fetch the complete registro with relationships
    const registoWithRelationships =
      await prisma.registoObjectivosMetasAmbientaisSociais.findUnique({
        where: { id: newRegisto.id },
        include: {
          membrosDaEquipa: {
            include: {
              membroEquipa: true,
            },
          },
          tabelasAccoes: {
            include: {
              tabelaAccao: true,
            },
          },
        },
      });

    return NextResponse.json(registoWithRelationships, { status: 201 });
  } catch (error) {
    console.error('Error creating registro:', error);
    return NextResponse.json(
      { error: 'Erro ao criar registro de objetivos' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do registro é obrigatório' },
        { status: 400 }
      );
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const data = await req.json();

    const validationResult = registoObjetivosUpdateSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    const { membrosDaEquipa, tabelasAccoes } = validatedData;

    // Verify access to the record
    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    const existingRegisto =
      await contextualPrisma.registoObjectivosMetasAmbientaisSociais.findUnique(
        {
          where: { id },
        }
      );

    if (!existingRegisto) {
      return NextResponse.json(
        {
          error:
            'Registro não encontrado ou você não tem permissão para acessá-lo',
        },
        { status: 404 }
      );
    }

    // Prepare update data (exclude relationship fields)
    const updateData: any = { ...validatedData };
    delete updateData.tenantId;
    delete updateData.projectId;
    delete updateData.membrosDaEquipa;
    delete updateData.tabelasAccoes;

    // Connect tenant and project if provided
    if (validatedData.tenantId) {
      updateData.tenant = {
        connect: { id: validatedData.tenantId },
      };
    }

    if (validatedData.projectId) {
      updateData.project = {
        connect: { id: validatedData.projectId },
      };
    }

    // Update the registro
    const updatedRegisto =
      await prisma.registoObjectivosMetasAmbientaisSociais.update({
        where: { id },
        data: updateData,
      });

    // Update membros da equipa relationships if provided
    if (membrosDaEquipa) {
      // First delete existing relationships
      await prisma.objectivosMetasOnMembrosEquipa.deleteMany({
        where: { objetivoMetaId: id },
      });

      // Then create new relationships
      if (membrosDaEquipa.length > 0) {
        await Promise.all(
          membrosDaEquipa.map(async (membro) => {
            return prisma.objectivosMetasOnMembrosEquipa.create({
              data: {
                objetivoMetaId: id,
                membroEquipaId: membro.membroEquipaId,
                assignedAt: membro.assignedAt || new Date(),
              },
            });
          })
        );
      }
    }

    // Update tabelas accoes relationships if provided
    if (tabelasAccoes) {
      // First delete existing relationships
      await prisma.objectivosMetasOnTabelaAccoes.deleteMany({
        where: { objetivoMetaId: id },
      });

      // Then create new relationships
      if (tabelasAccoes.length > 0) {
        await Promise.all(
          tabelasAccoes.map(async (tabelaAccao) => {
            return prisma.objectivosMetasOnTabelaAccoes.create({
              data: {
                objetivoMetaId: id,
                tabelaAccaoId: tabelaAccao.tabelaAccaoId,
                assignedAt: tabelaAccao.assignedAt || new Date(),
              },
            });
          })
        );
      }
    }

    // Fetch the complete registro with relationships
    const registoWithRelationships =
      await prisma.registoObjectivosMetasAmbientaisSociais.findUnique({
        where: { id },
        include: {
          membrosDaEquipa: {
            include: {
              membroEquipa: true,
            },
          },
          tabelasAccoes: {
            include: {
              tabelaAccao: true,
            },
          },
        },
      });

    return NextResponse.json(registoWithRelationships);
  } catch (error) {
    console.error('Error updating registro:', error);

    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Registro não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar registro de objetivos' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do registro é obrigatório' },
        { status: 400 }
      );
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    // Verify access to the record
    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    const existingRegisto =
      await contextualPrisma.registoObjectivosMetasAmbientaisSociais.findUnique(
        {
          where: { id },
        }
      );

    if (!existingRegisto) {
      return NextResponse.json(
        {
          error:
            'Registro não encontrado ou você não tem permissão para acessá-lo',
        },
        { status: 404 }
      );
    }

    // Delete the registro (cascade will handle relationships)
    await prisma.registoObjectivosMetasAmbientaisSociais.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting registro:', error);

    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Registro não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao excluir registro de objetivos' },
      { status: 500 }
    );
  }
}
