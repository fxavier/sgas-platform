import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing minimal RelatorioInicialIncidente creation...');

    // Create a test record with minimal required fields
    const result = await prisma.relatorioInicialIncidente.create({
      data: {
        tipoIncidente: 'OCORRENCIA_PERIGOSA',
        dataIncidente: new Date(),
        horaIncidente: new Date(),
        localIncidente: 'Test Location',
        dataComunicacao: new Date(),
        supervisor: 'Test Supervisor',
        descricaoCircunstanciaIncidente: 'Test Description',
        infoSobreFeriodosETratamentoFeito: 'Test Info',
        recomendacoes: 'Test Recommendations',
        necessitaDeInvestigacaoAprofundada: 'SIM',
        incidenteReportavel: 'SIM',
        credoresObrigadosASeremNotificados: 'SIM',
        dataCriacao: new Date(),
        nomeProvedor: 'Test Provider',
        data: new Date(),
        tenant: {
          connect: {
            id: '6a7252df-8330-4db2-8500-7be693ac39ab',
          },
        },
        project: {
          connect: {
            id: '2a3bff0a-f73b-4e3f-b92f-999303e2f0be',
          },
        },
      },
    });

    console.log('Minimal test creation successful:', result);

    // Clean up the test record
    await prisma.relatorioInicialIncidente.delete({
      where: {
        id: result.id,
      },
    });

    console.log('Test record cleaned up successfully');

    return NextResponse.json({
      success: true,
      message: 'Minimal test record created and deleted successfully',
    });
  } catch (error) {
    console.error('Error in minimal test:', error);
    const err = error as any;
    return NextResponse.json(
      {
        error: 'Failed to create minimal test record',
        details: {
          name: err?.name,
          message: err?.message,
          code: err?.code,
          meta: err?.meta,
        },
      },
      { status: 500 }
    );
  }
}
