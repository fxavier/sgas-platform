import { NextRequest, NextResponse } from 'next/server';
import { politicasSchema } from '@/lib/validations/politicas';
import {
  getContextFromRequest,
  createContextualPrismaClient,
} from '@/lib/db-context';
import { v4 as uuidv4 } from 'uuid';

// Mock data for politicas - used when DB connection fails or for development
const mockPoliticas = [
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

export async function GET(req: NextRequest) {
  try {
    console.log('GET request for politicas list');

    // Get context from request
    const context = getContextFromRequest(req);
    console.log('Request context:', context);

    try {
      // Try to use Prisma first
      const prisma = createContextualPrismaClient(context);

      // Get politicas list
      const politicas = await prisma.politicas.findMany({
        orderBy: {
          nomeDocumento: 'asc',
        },
      });

      return NextResponse.json(politicas);
    } catch (dbError) {
      // If DB connection fails, use mock data as fallback
      console.warn('Database error, using mock data instead:', dbError);

      // Filter mock data based on tenantId and projectId if provided
      let filteredPoliticas = [...mockPoliticas];

      if (context.tenantId) {
        filteredPoliticas = filteredPoliticas.filter(
          (p) => p.tenantId === context.tenantId
        );
      }

      if (context.projectId) {
        filteredPoliticas = filteredPoliticas.filter(
          (p) => p.projectId === context.projectId
        );
      }

      return NextResponse.json(filteredPoliticas);
    }
  } catch (error) {
    console.error('Error getting politicas:', error);
    return NextResponse.json(
      { error: 'Failed to get politicas', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get context from request
    const context = getContextFromRequest(req);
    console.log('POST request context:', context);

    // Check if tenantId and projectId are present in context
    if (!context.tenantId || !context.projectId) {
      console.error('Missing tenant or project ID in context:', context);
      return NextResponse.json(
        { error: 'Missing tenant or project ID' },
        { status: 400 }
      );
    }

    const prisma = createContextualPrismaClient(context);

    // Parse request body
    const body = await req.json();
    console.log('POST request body:', body);

    // Handle temporary file marker
    if (body.ficheiro === 'temp-file-selected' || body.ficheiro === 'Present') {
      return NextResponse.json(
        { error: 'Invalid file reference' },
        { status: 400 }
      );
    }

    // Transform periodoRetencao from string to Date if needed
    if (body.periodoRetencao && typeof body.periodoRetencao === 'string') {
      body.periodoRetencao = new Date(body.periodoRetencao);
    }

    // Validate form data
    try {
      const validatedData = politicasSchema.parse(body);

      // Set dataCriacao to current date if not provided
      const dataCriacao = body.dataCriacao || new Date();
      const dataRevisao = body.dataRevisao || new Date();

      try {
        // Try to use Prisma first
        // Create payload for database
        const createData = {
          codigo: validatedData.codigo,
          nomeDocumento: validatedData.nomeDocumento,
          ficheiro: validatedData.ficheiro,
          estadoDocumento: validatedData.estadoDocumento,
          periodoRetencao: validatedData.periodoRetencao,
          dataCriacao,
          dataRevisao,
          tenantId: context.tenantId,
          projectId: context.projectId,
        };

        console.log('Creating politica with data:', createData);

        // Create new record
        const politica = await prisma.politicas.create({
          data: createData,
        });

        return NextResponse.json(politica, { status: 201 });
      } catch (dbError) {
        // If DB connection fails, use mock data
        console.warn('Database error, using mock data instead:', dbError);

        // Create a new mock politica
        const newPolitica = {
          id: uuidv4(),
          codigo: validatedData.codigo,
          nomeDocumento: validatedData.nomeDocumento,
          ficheiro: validatedData.ficheiro,
          estadoDocumento: validatedData.estadoDocumento,
          periodoRetencao: validatedData.periodoRetencao,
          dataCriacao,
          dataRevisao,
          tenantId: context.tenantId,
          projectId: context.projectId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Add to mock data
        mockPoliticas.push({
          ...newPolitica,
          periodoRetencao:
            newPolitica.periodoRetencao || new Date('2030-01-01'), // Provide default date
        });

        return NextResponse.json(newPolitica, { status: 201 });
      }
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { error: 'Validation failed', details: validationError },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating politica:', error);
    return NextResponse.json(
      { error: 'Failed to create politica', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Get context from request
    const context = getContextFromRequest(req);
    console.log('PUT request context:', context);

    const prisma = createContextualPrismaClient(context);

    // Parse request body
    const body = await req.json();
    console.log('PUT request body:', body);

    // Check if ID is provided
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID is required for update' },
        { status: 400 }
      );
    }

    // Handle temporary file marker
    if (body.ficheiro === 'temp-file-selected' || body.ficheiro === 'Present') {
      return NextResponse.json(
        { error: 'Invalid file reference' },
        { status: 400 }
      );
    }

    // Transform periodoRetencao from string to Date if needed
    if (body.periodoRetencao && typeof body.periodoRetencao === 'string') {
      body.periodoRetencao = new Date(body.periodoRetencao);
    }

    // Validate form data
    try {
      const validatedData = politicasSchema.parse(body);

      try {
        // Try to use Prisma first
        // Update existing record
        const updateData = {
          codigo: validatedData.codigo,
          nomeDocumento: validatedData.nomeDocumento,
          ficheiro: validatedData.ficheiro,
          estadoDocumento: validatedData.estadoDocumento,
          periodoRetencao: validatedData.periodoRetencao,
          dataRevisao: new Date(),
        };

        console.log('Updating politica with data:', updateData);

        // Check if record exists before update
        const existingRecord = await prisma.politicas.findUnique({
          where: { id: body.id },
        });

        if (!existingRecord) {
          return NextResponse.json(
            { error: 'Política não encontrada' },
            { status: 404 }
          );
        }

        // Update the record
        const politica = await prisma.politicas.update({
          where: {
            id: body.id,
          },
          data: updateData,
        });

        return NextResponse.json(politica);
      } catch (dbError) {
        // If DB connection fails, use mock data
        console.warn('Database error, using mock data instead:', dbError);

        // Find the politica to update
        const politicaIndex = mockPoliticas.findIndex((p) => p.id === body.id);

        if (politicaIndex === -1) {
          return NextResponse.json(
            { error: 'Política não encontrada' },
            { status: 404 }
          );
        }

        // Update the mock politica
        const updatedPolitica = {
          ...mockPoliticas[politicaIndex],
          codigo: validatedData.codigo,
          nomeDocumento: validatedData.nomeDocumento,
          ficheiro: validatedData.ficheiro,
          estadoDocumento: validatedData.estadoDocumento,
          periodoRetencao: validatedData.periodoRetencao,
          dataRevisao: new Date(),
          updatedAt: new Date(),
        };

        // Replace in mock data
        mockPoliticas[politicaIndex] = {
          ...updatedPolitica,
          periodoRetencao:
            updatedPolitica.periodoRetencao || new Date('2030-01-01'), // Provide default date
        };

        return NextResponse.json(updatedPolitica);
      }
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { error: 'Validation failed', details: validationError },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating politica:', error);
    return NextResponse.json(
      { error: 'Failed to update politica', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get ID from query parameters
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required for deletion' },
        { status: 400 }
      );
    }

    // Get context from request
    const context = getContextFromRequest(req);
    console.log('DELETE request context:', context);

    try {
      // Try to use Prisma first
      const prisma = createContextualPrismaClient(context);

      // Find the politica to delete
      const politica = await prisma.politicas.findUnique({
        where: { id },
      });

      if (!politica) {
        return NextResponse.json(
          { error: 'Política não encontrada' },
          { status: 404 }
        );
      }

      // Delete politica from database
      await prisma.politicas.delete({
        where: { id },
      });

      return NextResponse.json({ success: true });
    } catch (dbError) {
      // If DB connection fails, use mock data
      console.warn('Database error, using mock data instead:', dbError);

      // Find the politica in mock data
      const politicaIndex = mockPoliticas.findIndex((p) => p.id === id);

      if (politicaIndex === -1) {
        return NextResponse.json(
          { error: 'Política não encontrada' },
          { status: 404 }
        );
      }

      // Remove from mock data
      mockPoliticas.splice(politicaIndex, 1);

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
