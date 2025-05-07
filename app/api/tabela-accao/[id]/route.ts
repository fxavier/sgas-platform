import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';

// GET a single tabela accao by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const id = params.id;

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    // Create contextual prisma client
    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId,
    });

    const tabelaAccao = await contextualPrisma.tabelaAccoes.findUnique({
      where: { id },
      include: {
        objetivosMetasAmbientaisSociais: {
          include: {
            objetivoMetaAmbiental: true,
          },
        },
      },
    });

    if (!tabelaAccao) {
      return NextResponse.json(
        { error: 'Ação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(tabelaAccao);
  } catch (error) {
    console.error('Error fetching tabela accao:', error);
    return NextResponse.json({ error: 'Erro ao buscar ação' }, { status: 500 });
  }
}
