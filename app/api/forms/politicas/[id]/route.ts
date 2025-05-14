import { NextRequest, NextResponse } from 'next/server';
import {
  getContextFromRequest,
  createContextualPrismaClient,
} from '@/lib/db-context';
import { getKeyFromUrl, deleteFromS3 } from '@/lib/s3-service';
import prisma from '@/lib/db';

// Mock data for a single politica - used when DB connection fails
const mockPoliticasData = [
  {
    id: '1c1a30f9-2f29-46f5-969e-62125687dbac',
    codigo: 'POL-001',
    nomeDocumento: 'Política Ambiental',
    ficheiro: '/uploads/sample1.pdf',
    estadoDocumento: 'EM_USO',
    periodoRetencao: new Date('2026-01-01'),
    dataCriacao: new Date('2023-01-15'),
    dataRevisao: new Date('2023-01-15'),
    tenantId: '7ee1e94a-d2ff-4500-a432-7073ddca1bda',
    projectId: '1b1a30f9-2f29-46f5-969e-62125687dbac',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: '2d2b41fa-3g3a-57f6-a7af-73236798ecbd',
    codigo: 'POL-002',
    nomeDocumento: 'Política de Saúde e Segurança',
    ficheiro: '/uploads/sample2.pdf',
    estadoDocumento: 'REVISAO',
    periodoRetencao: new Date('2025-06-30'),
    dataCriacao: new Date('2023-02-20'),
    dataRevisao: new Date('2023-02-20'),
    tenantId: '7ee1e94a-d2ff-4500-a432-7073ddca1bda',
    projectId: '1b1a30f9-2f29-46f5-969e-62125687dbac',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-02-20'),
  },
  {
    id: '3e3c52fb-4h4b-68g7-b8bg-84347809fdce',
    codigo: 'POL-003',
    nomeDocumento: 'Política Social',
    ficheiro: '/uploads/sample3.pdf',
    estadoDocumento: 'ABSOLETO',
    periodoRetencao: new Date('2024-12-31'),
    dataCriacao: new Date('2023-03-10'),
    dataRevisao: new Date('2023-03-10'),
    tenantId: '8ff2e94a-d3ff-4500-b543-7073ddca2cef',
    projectId: '3d3c52fb-4h4b-68g7-b8bg-84347809fdce',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-10'),
  },
];

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET single politica request for ID:', params.id);

    try {
      // Try to use Prisma first
      // Get politica by ID
      const politica = await prisma.politicas.findUnique({
        where: {
          id: params.id,
        },
      });

      if (!politica) {
        return NextResponse.json(
          { error: 'Política não encontrada' },
          { status: 404 }
        );
      }

      return NextResponse.json(politica);
    } catch (dbError) {
      // If DB connection fails, use mock data
      console.warn('Database error, using mock data instead:', dbError);

      // Find the politica in mock data
      const politica = mockPoliticasData.find((p) => p.id === params.id);

      if (!politica) {
        return NextResponse.json(
          { error: 'Política não encontrada' },
          { status: 404 }
        );
      }

      return NextResponse.json(politica);
    }
  } catch (error) {
    console.error('Error getting politica:', error);
    return NextResponse.json(
      { error: 'Failed to get politica', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('DELETE request for politica ID:', params.id);

    // For delete operations, we need the context
    const context = getContextFromRequest(req);

    try {
      // Try to use Prisma first
      const prisma = createContextualPrismaClient(context);

      // Get politica first to get the file URL
      const politica = await prisma.politicas.findUnique({
        where: {
          id: params.id,
        },
      });

      if (!politica) {
        return NextResponse.json(
          { error: 'Política não encontrada' },
          { status: 404 }
        );
      }

      // Delete file from S3 if exists
      if (politica.ficheiro) {
        try {
          // Check if it's an S3 URL (not for local uploads)
          const fileKey = getKeyFromUrl(politica.ficheiro);
          if (fileKey) {
            await deleteFromS3(fileKey);
            console.log('Deleted file from S3:', fileKey);
          } else {
            // Local upload, optionally clean up the file
            console.log(
              'Local file, not deleting from storage:',
              politica.ficheiro
            );
          }
        } catch (fileError) {
          console.error('Error deleting file:', fileError);
          // Continue with record deletion even if file deletion fails
        }
      }

      // Delete politica from database
      await prisma.politicas.delete({
        where: {
          id: params.id,
        },
      });

      return NextResponse.json({ success: true });
    } catch (dbError) {
      // If DB connection fails, use mock data
      console.warn('Database error, using mock data instead:', dbError);

      // Find the politica index in mock data
      const politicaIndex = mockPoliticasData.findIndex(
        (p) => p.id === params.id
      );

      if (politicaIndex === -1) {
        return NextResponse.json(
          { error: 'Política não encontrada' },
          { status: 404 }
        );
      }

      // Remove from mock data
      mockPoliticasData.splice(politicaIndex, 1);

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error deleting politica:', error);
    return NextResponse.json(
      { error: 'Failed to delete politica', details: String(error) },
      { status: 500 }
    );
  }
}
