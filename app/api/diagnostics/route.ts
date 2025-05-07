import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a new instance of the Prisma client instead of using the imported one
const diagnosticPrisma = new PrismaClient();

export async function GET() {
  try {
    // Test the connection
    console.log('Testing database connection with fresh client...');

    // Get the list of available models from the Prisma client
    const availableModels = Object.keys(diagnosticPrisma).filter(
      (key) =>
        !key.startsWith('_') &&
        typeof (diagnosticPrisma as unknown as Record<string, unknown>)[key] ===
          'object' &&
        (diagnosticPrisma as unknown as Record<string, unknown>)[key] !== null
    );

    console.log('Available models in the Prisma client:', availableModels);

    // Test if RelatorioInicialIncidente exists
    const hasRelatorioModel = availableModels.includes(
      'relatorioInicialIncidente'
    );
    console.log('Has RelatorioInicialIncidente model:', hasRelatorioModel);

    // Check the fields of the RelatorioInicialIncidente model if it exists
    let modelFields: string[] = [];
    if (hasRelatorioModel) {
      try {
        // Try to query a single record to get field names
        const testRecord =
          await diagnosticPrisma.relatorioInicialIncidente.findFirst();
        if (testRecord) {
          modelFields = Object.keys(testRecord);
          console.log('Fields in the model:', modelFields);
        } else {
          console.log('No records found to determine fields');
        }
      } catch (fieldError) {
        console.error('Error checking fields:', fieldError);
      }
    }

    // Attempt a minimal create operation with only essential fields
    try {
      console.log('Testing minimal creation with new client...');
      const minimal = {
        dataIncidente: new Date(),
        horaIncidente: new Date(),
        localIncidente: 'Test Only',
        dataComunicacao: new Date(),
        supervisor: 'Test',
        descricaoCircunstanciaIncidente: 'Test',
        infoSobreFeriodosETratamentoFeito: 'Test',
        recomendacoes: 'Test',
        necessitaDeInvestigacaoAprofundada: 'SIM',
        incidenteReportavel: 'SIM',
        credoresObrigadosASeremNotificados: 'SIM',
        dataCriacao: new Date(),
        nomeProvedor: 'Test',
        data: new Date(),
        tipo_incidente: 'OCORRENCIA_PERIGOSA', // Try with underscored version
        tenant: {
          connect: { id: '6a7252df-8330-4db2-8500-7be693ac39ab' },
        },
        project: {
          connect: { id: '2a3bff0a-f73b-4e3f-b92f-999303e2f0be' },
        },
      };

      // Try to create using the actual fields expected by Prisma
      const result = await diagnosticPrisma.$executeRaw`
        INSERT INTO relatorios_iniciais_incidente 
        (
          "dataIncidente", 
          "horaIncidente", 
          "localIncidente", 
          "dataComunicacao", 
          supervisor, 
          "descricaoCircunstanciaIncidente", 
          "infoSobreFeriodosETratamentoFeito", 
          recomendacoes, 
          "necessitaDeInvestigacaoAprofundada", 
          "incidenteReportavel", 
          "credoresObrigadosASeremNotificados", 
          "dataCriacao", 
          "nomeProvedor", 
          "data", 
          "tipoIncidente",
          "tenantId", 
          "projectId"
        ) 
        VALUES 
        (
          NOW(), 
          NOW(), 
          'Test Location', 
          NOW(), 
          'Test Supervisor', 
          'Test Description', 
          'Test Info', 
          'Test Recommendations', 
          'SIM'::text::\"RespostaSimNao\", 
          'SIM'::text::\"RespostaSimNao\", 
          'SIM'::text::\"RespostaSimNao\", 
          NOW(), 
          'Test Provider', 
          NOW(), 
          'OCORRENCIA_PERIGOSA'::text::\"TipoIncidente\", 
          '6a7252df-8330-4db2-8500-7be693ac39ab', 
          '2a3bff0a-f73b-4e3f-b92f-999303e2f0be'
        )
      `;

      console.log('Raw SQL insert result:', result);
    } catch (createError) {
      console.error('Error in diagnostic create operation:', createError);
    }

    // Close the client connection
    await diagnosticPrisma.$disconnect();

    return NextResponse.json({
      success: true,
      availableModels,
      hasRelatorioModel,
      modelFields,
      message: 'Diagnostics completed, check server logs',
    });
  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json(
      {
        error: 'Diagnostic failed',
        details: (error as any)?.message,
      },
      { status: 500 }
    );
  }
}
