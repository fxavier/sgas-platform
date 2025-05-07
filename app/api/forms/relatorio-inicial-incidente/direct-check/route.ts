import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Test 1: Can we connect to the database at all?
    console.log('Testing database connection...');
    const userCount = await prisma.$queryRaw`SELECT COUNT(*) FROM tenants`;
    console.log('Database connection successful, tenant count:', userCount);

    // Test 2: Can we query the relatorios_iniciais_incidente table?
    console.log('Testing relatorios_iniciais_incidente table query...');
    try {
      const count =
        await prisma.$queryRaw`SELECT COUNT(*) FROM relatorios_iniciais_incidente`;
      console.log(
        'relatorios_iniciais_incidente table query successful:',
        count
      );
    } catch (tableError) {
      console.error(
        'Error querying relatorios_iniciais_incidente table:',
        tableError
      );
      return NextResponse.json(
        {
          error: 'Failed to query relatorios_iniciais_incidente table',
          details: (tableError as any)?.message,
        },
        { status: 500 }
      );
    }

    // Test 3: Can we get the schema of the relatorios_iniciais_incidente table?
    console.log('Testing table schema...');
    try {
      const schema = await prisma.$queryRaw`
        SELECT column_name, data_type, character_maximum_length, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'relatorios_iniciais_incidente'
        ORDER BY ordinal_position
      `;
      console.log('Table schema:', schema);

      // Test 4: Check if the prisma client can fetch from the table
      console.log('Testing Prisma client findMany...');
      const relatorios = await prisma.relatorioInicialIncidente.findMany({
        take: 1,
      });
      console.log(
        'Prisma findMany successful, found',
        relatorios.length,
        'items'
      );

      return NextResponse.json({
        success: true,
        message: 'All database tests passed',
        schema,
        relatorios,
      });
    } catch (schemaError) {
      console.error('Error getting table schema:', schemaError);
      return NextResponse.json(
        {
          error: 'Failed to get table schema',
          details: (schemaError as any)?.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Database diagnostic error:', error);
    const err = error as any;
    return NextResponse.json(
      {
        error: 'Database diagnostic failed',
        details: {
          message: err?.message,
          code: err?.code,
          meta: err?.meta,
        },
      },
      { status: 500 }
    );
  }
}
