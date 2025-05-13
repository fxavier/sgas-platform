import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { triagemAmbientalSchema } from '@/lib/validations/triagem-ambiental';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId || !projectId) {
      return new NextResponse('Tenant ID and Project ID are required', {
        status: 400,
      });
    }

    const forms = await prisma.triagemAmbientalSocial.findMany({
      where: {
        tenantId,
        projectId,
      },
      include: {
        responsavelPeloPreenchimento: true,
        responsavelPelaVerificacao: true,
        subprojecto: true,
        resultadoTriagem: true,
        identificacaoRiscos: {
          include: {
            identificacaoRiscos: {
              include: {
                biodiversidadeRecursosNaturais: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error('[TRIAGEM_AMBIENTAL_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = triagemAmbientalSchema.parse(body);

    const form = await prisma.triagemAmbientalSocial.create({
      data: {
        tenantId: validatedData.tenantId,
        projectId: validatedData.projectId,
        responsavelPeloPreenchimentoId:
          validatedData.responsavelPeloPreenchimentoId,
        responsavelPelaVerificacaoId:
          validatedData.responsavelPelaVerificacaoId,
        subprojectoId: validatedData.subprojectoId,
        consultaEngajamento: validatedData.consultaEngajamento,
        accoesRecomendadas: validatedData.accoesRecomendadas,
        resultadoTriagemId: validatedData.resultadoTriagemId,
        identificacaoRiscos: validatedData.identificacaoRiscos
          ? {
              create: validatedData.identificacaoRiscos.map((risco) => ({
                identificacaoRiscos: {
                  create: {
                    biodiversidadeRecursosNaturaisId:
                      risco.biodiversidadeRecursosNaturaisId,
                    resposta: risco.resposta,
                    comentario: risco.comentario,
                    normaAmbientalSocial: risco.normaAmbientalSocial,
                    tenantId: validatedData.tenantId,
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        responsavelPeloPreenchimento: true,
        responsavelPelaVerificacao: true,
        subprojecto: true,
        resultadoTriagem: true,
        identificacaoRiscos: {
          include: {
            identificacaoRiscos: {
              include: {
                biodiversidadeRecursosNaturais: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error('[TRIAGEM_AMBIENTAL_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const validatedData = triagemAmbientalSchema.parse(data);

    const form = await prisma.triagemAmbientalSocial.update({
      where: { id },
      data: {
        tenantId: validatedData.tenantId,
        projectId: validatedData.projectId,
        responsavelPeloPreenchimentoId:
          validatedData.responsavelPeloPreenchimentoId,
        responsavelPelaVerificacaoId:
          validatedData.responsavelPelaVerificacaoId,
        subprojectoId: validatedData.subprojectoId,
        consultaEngajamento: validatedData.consultaEngajamento,
        accoesRecomendadas: validatedData.accoesRecomendadas,
        resultadoTriagemId: validatedData.resultadoTriagemId,
        identificacaoRiscos: validatedData.identificacaoRiscos
          ? {
              deleteMany: {},
              create: validatedData.identificacaoRiscos.map((risco) => ({
                identificacaoRiscos: {
                  create: {
                    biodiversidadeRecursosNaturaisId:
                      risco.biodiversidadeRecursosNaturaisId,
                    resposta: risco.resposta,
                    comentario: risco.comentario,
                    normaAmbientalSocial: risco.normaAmbientalSocial,
                    tenantId: validatedData.tenantId,
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        responsavelPeloPreenchimento: true,
        responsavelPelaVerificacao: true,
        subprojecto: true,
        resultadoTriagem: true,
        identificacaoRiscos: {
          include: {
            identificacaoRiscos: {
              include: {
                biodiversidadeRecursosNaturais: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error('[TRIAGEM_AMBIENTAL_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('ID is required', { status: 400 });
    }

    await prisma.triagemAmbientalSocial.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[TRIAGEM_AMBIENTAL_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
