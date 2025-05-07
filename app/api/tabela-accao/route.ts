import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  createContextualPrismaClient,
  getContextFromRequest,
} from '@/lib/db-context';
import { tabelaAccaoSchema, tabelaAccaoUpdateSchema } from '@/lib/validations';

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

    // We don't need to add tenant filters as they're handled by the contextual client
    const tabelaAccoes = await contextualPrisma.tabelaAccoes.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(tabelaAccoes);
  } catch (error) {
    console.error('Error fetching tabela accoes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar as ações' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const validationResult = tabelaAccaoSchema.safeParse(data);

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
    const { tenantId, projectId } = validatedData;

    // Create the tabela accao
    const newTabelaAccao = await prisma.tabelaAccoes.create({
      data: {
        accao: validatedData.accao,
        pessoaResponsavel: validatedData.pessoaResponsavel,
        prazo: validatedData.prazo,
        dataConclusao: validatedData.dataConclusao,
        tenant: {
          connect: {
            id: tenantId,
          },
        },
      },
    });

    return NextResponse.json(newTabelaAccao, { status: 201 });
  } catch (error) {
    console.error('Error creating tabela accao:', error);
    return NextResponse.json({ error: 'Erro ao criar ação' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');

    if (!id) {
      return NextResponse.json(
        { error: 'ID da ação é obrigatório' },
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

    const validationResult = tabelaAccaoUpdateSchema.safeParse(data);

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

    // Verify access to the record
    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    const existingTabelaAccao = await contextualPrisma.tabelaAccoes.findUnique({
      where: { id },
    });

    if (!existingTabelaAccao) {
      return NextResponse.json(
        {
          error: 'Ação não encontrada ou você não tem permissão para acessá-la',
        },
        { status: 404 }
      );
    }

    // Remove tenant connects if they exist in the data
    const updateData: any = { ...validatedData };
    delete updateData.tenantId;
    delete updateData.projectId;

    // Update the tabela accao
    const updatedTabelaAccao = await prisma.tabelaAccoes.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedTabelaAccao);
  } catch (error) {
    console.error('Error updating tabela accao:', error);

    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Ação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar ação' },
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
        { error: 'ID da ação é obrigatório' },
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

    const existingTabelaAccao = await contextualPrisma.tabelaAccoes.findUnique({
      where: { id },
    });

    if (!existingTabelaAccao) {
      return NextResponse.json(
        {
          error: 'Ação não encontrada ou você não tem permissão para acessá-la',
        },
        { status: 404 }
      );
    }

    // Delete the tabela accao
    await prisma.tabelaAccoes.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tabela accao:', error);

    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Ação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao excluir ação' },
      { status: 500 }
    );
  }
}
