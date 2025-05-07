import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    console.log('Tenant API: Received GET request');

    // Fetch all tenants from the database
    const tenants = await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log(`Tenant API: Found ${tenants.length} tenants`);

    return NextResponse.json(tenants);
  } catch (error) {
    console.error('Tenant API: Error fetching tenants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenants' },
      { status: 500 }
    );
  }
}
