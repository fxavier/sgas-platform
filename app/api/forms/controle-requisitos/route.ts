import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import {
  controleRequisitosSchema,
  controleRequisitosUpdateSchema,
} from '@/lib/validations/controle-requisitos';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId || !projectId) {
      return NextResponse.json(
        { error: 'Tenant ID and Project ID are required' },
        { status: 400 }
      );
    }

    const forms = await prisma.controleRequisitosLegais.findMany({
      where: {
        tenantId,
        projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { error: 'Error fetching forms' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = controleRequisitosSchema.parse(body);

    const form = await prisma.controleRequisitosLegais.create({
      data: {
        tenantId: validatedData.tenantId,
        projectId: validatedData.projectId,
        numnumero: validatedData.numnumero,
        tituloDocumento: validatedData.tituloDocumento,
        descricao: validatedData.descricao,
        revocacoesAlteracoes: validatedData.revocacoesAlteracoes,
        requisitoConformidade: validatedData.requisitoConformidade,
        dataControle: validatedData.dataControle,
        observation: validatedData.observation,
        ficheiroDaLei: validatedData.ficheiroDaLei,
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Error creating form' }, { status: 400 });
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
    const validationResult = controleRequisitosUpdateSchema.safeParse(data);

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
      await contextualPrisma.controleRequisitosLegais.findUnique({
        where: { id },
      });

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    const {
      tenantId: newTenantId,
      projectId: newProjectId,
      ...updateData
    } = validatedData;

    const finalUpdateData: any = { ...updateData };

    if (newTenantId) {
      finalUpdateData.tenant = { connect: { id: newTenantId } };
    }

    if (newProjectId) {
      finalUpdateData.project = { connect: { id: newProjectId } };
    }

    const updatedRegistro = await prisma.controleRequisitosLegais.update({
      where: { id },
      data: finalUpdateData,
    });

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
      await contextualPrisma.controleRequisitosLegais.findUnique({
        where: { id },
      });

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    await prisma.controleRequisitosLegais.delete({
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
