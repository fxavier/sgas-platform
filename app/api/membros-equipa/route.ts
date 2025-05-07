import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  createContextualPrismaClient,
  getContextFromRequest,
} from '@/lib/db-context';
import {
  membroEquipaSchema,
  membroEquipaUpdateSchema,
} from '@/lib/validations';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    // Create contextual prisma client
    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    // We don't need to add tenant filters as they're handled by the contextual client
    const membrosEquipa = await contextualPrisma.membrosEquipa.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(membrosEquipa);
  } catch (error) {
    console.error('Error fetching membros equipa:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar membros da equipa' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const validationResult = membroEquipaSchema.safeParse(data);

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
    const { tenantId } = validatedData;

    // Create the membro equipa
    const newMembroEquipa = await prisma.membrosEquipa.create({
      data: {
        nome: validatedData.nome,
        cargo: validatedData.cargo,
        departamento: validatedData.departamento,
        tenant: {
          connect: {
            id: tenantId,
          },
        },
      },
    });

    return NextResponse.json(newMembroEquipa, { status: 201 });
  } catch (error) {
    console.error('Error creating membro equipa:', error);
    return NextResponse.json(
      { error: 'Erro ao criar membro da equipa' },
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
        { error: 'ID do membro é obrigatório' },
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

    const validationResult = membroEquipaUpdateSchema.safeParse(data);

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

    const existingMembro = await contextualPrisma.membrosEquipa.findUnique({
      where: { id },
    });

    if (!existingMembro) {
      return NextResponse.json(
        {
          error:
            'Membro não encontrado ou você não tem permissão para acessá-lo',
        },
        { status: 404 }
      );
    }

    // Remove tenant connects if they exist in the data
    const updateData: any = { ...validatedData };
    delete updateData.tenantId;

    // Update the membro
    const updatedMembro = await prisma.membrosEquipa.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedMembro);
  } catch (error) {
    console.error('Error updating membro equipa:', error);

    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Membro não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar membro da equipa' },
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
        { error: 'ID do membro é obrigatório' },
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

    const existingMembro = await contextualPrisma.membrosEquipa.findUnique({
      where: { id },
    });

    if (!existingMembro) {
      return NextResponse.json(
        {
          error:
            'Membro não encontrado ou você não tem permissão para acessá-lo',
        },
        { status: 404 }
      );
    }

    // Check if there are related records before deleting
    const relatedRecords = await prisma.objectivosMetasOnMembrosEquipa.findMany(
      {
        where: { membroEquipaId: id },
      }
    );

    if (relatedRecords.length > 0) {
      // Delete the related records first
      await prisma.objectivosMetasOnMembrosEquipa.deleteMany({
        where: { membroEquipaId: id },
      });
    }

    // Delete the membro
    await prisma.membrosEquipa.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting membro equipa:', error);

    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Membro não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao excluir membro da equipa' },
      { status: 500 }
    );
  }
}
