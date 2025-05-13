import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { matrizTreinamentoSchema } from '@/lib/validations/matriz-treinamento';
import { createContextualPrismaClient } from '@/lib/db-context';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const prisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
      projectId: projectId || undefined,
    });

    const matrizTreinamento = await prisma.matrizTreinamento.findUnique({
      where: { id },
      include: {
        funcao: true,
        areaTreinamento: true,
        caixa_ferramentas: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!matrizTreinamento) {
      return NextResponse.json(
        { error: 'Matriz de Treinamento not found' },
        { status: 404 }
      );
    }

    // Rename caixa_ferramentas to caixaFerramentas for frontend consistency
    const formattedData = {
      ...matrizTreinamento,
      caixaFerramentas: matrizTreinamento.caixa_ferramentas,
      caixa_ferramentas: undefined,
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching matriz treinamento:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || body.tenantId;
    const projectId = searchParams.get('projectId') || body.projectId;

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    // Validate request body (partial validation)
    const validationResult = matrizTreinamentoSchema.partial().safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const prisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
      projectId: projectId || undefined,
    });

    // Check if record exists
    const existingRecord = await prisma.matrizTreinamento.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Matriz de Treinamento not found' },
        { status: 404 }
      );
    }

    // Update the record
    const updatedMatrizTreinamento = await prisma.matrizTreinamento.update({
      where: { id },
      data: validationResult.data,
      include: {
        funcao: true,
        areaTreinamento: true,
        caixa_ferramentas: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Rename caixa_ferramentas to caixaFerramentas for frontend consistency
    const formattedData = {
      ...updatedMatrizTreinamento,
      caixaFerramentas: updatedMatrizTreinamento.caixa_ferramentas,
      caixa_ferramentas: undefined,
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error updating matriz treinamento:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const prisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
      projectId: projectId || undefined,
    });

    // Check if record exists
    const existingRecord = await prisma.matrizTreinamento.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Matriz de Treinamento not found' },
        { status: 404 }
      );
    }

    // Delete the record
    await prisma.matrizTreinamento.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting matriz treinamento:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
