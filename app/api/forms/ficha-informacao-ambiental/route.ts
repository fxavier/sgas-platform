import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fichaInformacaoSchema } from '@/lib/validations/ficha-informacao';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = fichaInformacaoSchema.parse(body);

    const fichaInformacao =
      await prisma.fichaInformacaoAmbientalPreliminar.create({
        data: {
          ...validatedData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

    return NextResponse.json(fichaInformacao);
  } catch (error) {
    console.error('Error creating ficha informacao ambiental:', error);
    return NextResponse.json(
      { error: 'Erro ao criar ficha de informação ambiental' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const fichas = await prisma.fichaInformacaoAmbientalPreliminar.findMany({
      where: {
        tenantId,
        ...(projectId && { projectId }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(fichas);
  } catch (error) {
    console.error('Error fetching fichas:', error);
    return NextResponse.json(
      { error: 'Error fetching fichas' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const validatedData = fichaInformacaoSchema.parse(data);

    const fichaInformacao =
      await prisma.fichaInformacaoAmbientalPreliminar.update({
        where: { id },
        data: {
          ...validatedData,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json(fichaInformacao);
  } catch (error) {
    console.error('Error updating ficha informacao ambiental:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar ficha de informação ambiental' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    await prisma.fichaInformacaoAmbientalPreliminar.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ficha informacao ambiental:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir ficha de informação ambiental' },
      { status: 500 }
    );
  }
}
