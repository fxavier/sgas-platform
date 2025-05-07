import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    console.log('Projects API: Received GET request');

    // Get tenantId from query parameters
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    console.log(`Projects API: Fetching projects for tenant ${tenantId}`);

    // Fetch projects for the specified tenant
    const projects = await prisma.project.findMany({
      where: {
        tenantId,
      },
      select: {
        id: true,
        name: true,
        tenantId: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log(`Projects API: Found ${projects.length} projects`);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Projects API: Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
