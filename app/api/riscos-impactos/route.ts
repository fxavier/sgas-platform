import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { descricao, tenantId } = body;

    if (!descricao || !tenantId) {
      return NextResponse.json(
        { error: 'Descrição e tenantId são obrigatórios' },
        { status: 400 }
      );
    }

    const newRiscoImpacto = await prisma.riscosImpactos.create({
      data: {
        descricao,
        tenant: {
          connect: { id: tenantId },
        },
      },
    });

    return NextResponse.json(newRiscoImpacto);
  } catch (error) {
    console.error('Error creating risco/impacto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar risco/impacto' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const riscosImpactos = await prisma.riscosImpactos.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        descricao: 'asc',
      },
    });

    return NextResponse.json(riscosImpactos);
  } catch (error) {
    console.error('Error fetching riscos/impactos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar riscos/impactos' },
      { status: 500 }
    );
  }
}
