import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { descricao, tenantId } = data;

    if (!descricao || !tenantId) {
      return NextResponse.json(
        { error: 'Descrição e tenantId são obrigatórios' },
        { status: 400 }
      );
    }

    const fatorAmbiental = await prisma.factorAmbientalImpactado.create({
      data: {
        descricao,
        tenant: {
          connect: {
            id: tenantId,
          },
        },
      },
    });

    return NextResponse.json(fatorAmbiental, { status: 201 });
  } catch (error) {
    console.error('Error creating fator ambiental:', error);
    return NextResponse.json(
      { error: 'Erro ao criar fator ambiental' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const fatoresAmbientais = await prisma.factorAmbientalImpactado.findMany({
      orderBy: {
        descricao: 'asc',
      },
    });

    return NextResponse.json(fatoresAmbientais);
  } catch (error) {
    console.error('Error fetching fatores ambientais:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar fatores ambientais' },
      { status: 500 }
    );
  }
}
