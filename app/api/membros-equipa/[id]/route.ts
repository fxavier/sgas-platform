import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';

// GET a single membro equipa by ID
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

    const membroEquipa = await contextualPrisma.membrosEquipa.findUnique({
      where: { id },
      include: {
        objetivosMetasAmbientaisSociais: {
          include: {
            objetivoMetaAmbiental: true,
          },
        },
      },
    });

    if (!membroEquipa) {
      return NextResponse.json(
        { error: 'Membro da equipa não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(membroEquipa);
  } catch (error) {
    console.error('Error fetching membro equipa:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar membro da equipa' },
      { status: 500 }
    );
  }
}
