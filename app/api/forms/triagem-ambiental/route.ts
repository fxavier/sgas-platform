import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import {
  triagemAmbientalSchema,
  triagemAmbientalUpdateSchema,
} from '@/lib/validations/triagem-ambiental';

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

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
      projectId: projectId || undefined,
    });

    const registros = await contextualPrisma.triagemAmbientalSocial.findMany({
      include: {
        responsavelPeloPreenchimento: true,
        responsavelPelaVerificacao: true,
        subprojecto: true,
        resultadoTriagem: true,
        identificacaoRiscos: {
          include: {
            identificacaoRiscos: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(registros);
  } catch (error) {
    console.error('Error fetching registros:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar registros' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validationResult = triagemAmbientalSchema.safeParse(data);

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
    const { tenantId, projectId, identificacaoRiscos } = validatedData;

    const newRegistro = await prisma.triagemAmbientalSocial.create({
      data: {
        responsavelPeloPreenchimento: {
          connect: { id: validatedData.responsavelPeloPreenchimentoId },
        },
        responsavelPelaVerificacao: {
          connect: { id: validatedData.responsavelPelaVerificacaoId },
        },
        subprojecto: {
          connect: { id: validatedData.subprojectoId },
        },
        resultadoTriagem: {
          connect: { id: validatedData.resultadoTriagemId },
        },
        consultaEngajamento: validatedData.consultaEngajamento,
        accoesRecomendadas: validatedData.accoesRecomendadas,
        tenant: { connect: { id: tenantId } },
        project: { connect: { id: projectId } },
        identificacaoRiscos: {
          create: identificacaoRiscos?.map((risco) => ({
            identificacaoRiscos: {
              connect: { id: risco.identificacaoRiscosId },
            },
          })),
        },
      },
      include: {
        responsavelPeloPreenchimento: true,
        responsavelPelaVerificacao: true,
        subprojecto: true,
        resultadoTriagem: true,
        identificacaoRiscos: {
          include: {
            identificacaoRiscos: true,
          },
        },
      },
    });

    return NextResponse.json(newRegistro, { status: 201 });
  } catch (error) {
    console.error('Error creating registro:', error);
    return NextResponse.json(
      { error: 'Erro ao criar registro' },
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
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const data = await req.json();
    const validationResult = triagemAmbientalUpdateSchema.safeParse(data);

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
    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    const existingRegistro =
      await contextualPrisma.triagemAmbientalSocial.findUnique({
        where: { id },
      });

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    const updateData: any = { ...validatedData };
    delete updateData.tenantId;
    delete updateData.projectId;
    delete updateData.identificacaoRiscos;

    if (validatedData.tenantId) {
      updateData.tenant = { connect: { id: validatedData.tenantId } };
    }

    if (validatedData.projectId) {
      updateData.project = { connect: { id: validatedData.projectId } };
    }

    if (validatedData.responsavelPeloPreenchimentoId) {
      updateData.responsavelPeloPreenchimento = {
        connect: { id: validatedData.responsavelPeloPreenchimentoId },
      };
    }

    if (validatedData.responsavelPelaVerificacaoId) {
      updateData.responsavelPelaVerificacao = {
        connect: { id: validatedData.responsavelPelaVerificacaoId },
      };
    }

    if (validatedData.subprojectoId) {
      updateData.subprojecto = {
        connect: { id: validatedData.subprojectoId },
      };
    }

    if (validatedData.resultadoTriagemId) {
      updateData.resultadoTriagem = {
        connect: { id: validatedData.resultadoTriagemId },
      };
    }

    const updatedRegistro = await prisma.triagemAmbientalSocial.update({
      where: { id },
      data: updateData,
      include: {
        responsavelPeloPreenchimento: true,
        responsavelPelaVerificacao: true,
        subprojecto: true,
        resultadoTriagem: true,
        identificacaoRiscos: {
          include: {
            identificacaoRiscos: true,
          },
        },
      },
    });

    // Update identificacaoRiscos if provided
    if (validatedData.identificacaoRiscos) {
      // First, delete all existing connections
      await prisma.triagemAmbientalSocialOnIdentificacaoRiscos.deleteMany({
        where: { triagemAmbientalSocialId: id },
      });

      // Then create new connections
      await prisma.triagemAmbientalSocialOnIdentificacaoRiscos.createMany({
        data: validatedData.identificacaoRiscos.map((risco) => ({
          triagemAmbientalSocialId: id,
          identificacaoRiscosId: risco.identificacaoRiscosId,
        })),
      });

      // Fetch the updated record with the new connections
      const finalRegistro = await prisma.triagemAmbientalSocial.findUnique({
        where: { id },
        include: {
          responsavelPeloPreenchimento: true,
          responsavelPelaVerificacao: true,
          subprojecto: true,
          resultadoTriagem: true,
          identificacaoRiscos: {
            include: {
              identificacaoRiscos: true,
            },
          },
        },
      });

      return NextResponse.json(finalRegistro);
    }

    return NextResponse.json(updatedRegistro);
  } catch (error) {
    console.error('Error updating registro:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar registro' },
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
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    const existingRegistro =
      await contextualPrisma.triagemAmbientalSocial.findUnique({
        where: { id },
      });

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    await prisma.triagemAmbientalSocial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting registro:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir registro' },
      { status: 500 }
    );
  }
}
