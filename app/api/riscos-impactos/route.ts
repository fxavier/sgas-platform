import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';

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

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    const riscosImpactos = await contextualPrisma.riscosImpactos.findMany({
      orderBy: {
        descricao: 'asc',
      },
    });

    return NextResponse.json(riscosImpactos);
  } catch (error) {
    console.error('Error fetching riscos impactos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar riscos e impactos' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    if (!data.descricao) {
      return NextResponse.json(
        { error: 'Descrição é obrigatória' },
        { status: 400 }
      );
    }

    const newRiscoImpacto = await prisma.riscosImpactos.create({
      data: {
        descricao: data.descricao,
        tenantId,
      },
      include: {
        tenant: true,
      },
    });

    return NextResponse.json(newRiscoImpacto, { status: 201 });
  } catch (error) {
    console.error('Error creating risco impacto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar risco/impacto' },
      { status: 500 }
    );
  }
}
