import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { matrizTreinamentoSchema } from '@/lib/validations/matriz-treinamento';
import {
  createContextualPrismaClient,
  getContextFromRequest,
} from '@/lib/db-context';

export async function GET(request: NextRequest) {
  try {
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

    const matrizTreinamentos = await prisma.matrizTreinamento.findMany({
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
      orderBy: {
        data: 'desc',
      },
    });

    // Rename caixa_ferramentas to caixaFerramentas for frontend consistency
    const formattedData = matrizTreinamentos.map((item) => ({
      ...item,
      caixaFerramentas: item.caixa_ferramentas,
      caixa_ferramentas: undefined,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching matriz treinamento data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = matrizTreinamentoSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const {
      data,
      funcaoId,
      areaTreinamentoId,
      caixaFerramentasId,
      totais_palestras,
      total_horas,
      total_caixa_ferramentas,
      total_pessoas_informadas_caixa_ferramentas,
      eficacia,
      accoes_treinamento_nao_eficaz,
      aprovado_por,
      tenantId,
      projectId,
    } = validationResult.data;

    const prisma = createContextualPrismaClient({ tenantId, projectId });

    // Create the matriz treinamento record
    const matrizTreinamento = await prisma.matrizTreinamento.create({
      data: {
        data,
        funcaoId,
        areaTreinamentoId,
        caixaFerramentasId,
        totais_palestras,
        total_horas,
        total_caixa_ferramentas,
        total_pessoas_informadas_caixa_ferramentas,
        eficacia,
        accoes_treinamento_nao_eficaz,
        aprovado_por,
        tenantId,
        projectId,
      },
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
      ...matrizTreinamento,
      caixaFerramentas: matrizTreinamento.caixa_ferramentas,
      caixa_ferramentas: undefined,
    };

    return NextResponse.json(formattedData, { status: 201 });
  } catch (error) {
    console.error('Error creating matriz treinamento:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
