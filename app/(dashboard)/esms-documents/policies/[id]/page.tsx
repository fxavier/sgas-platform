import { NextRequest, NextResponse } from 'next/server';
import {
  getContextFromRequest,
  createContextualPrismaClient,
} from '@/lib/db-context';
import { getKeyFromUrl, deleteFromS3 } from '@/lib/s3-service';
import prisma from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET single politica request for ID:', params.id);

    // Get politica by ID - we don't need tenant and project context here
    // since we're fetching a specific record by ID
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

    // For delete operations, we need the context since we need to pass
    // tenant and project IDs to the contextual Prisma client
    const context = getContextFromRequest(req);
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
  } catch (error) {
    console.error('Error deleting politica:', error);
    return NextResponse.json(
      { error: 'Failed to delete politica', details: String(error) },
      { status: 500 }
    );
  }
}
