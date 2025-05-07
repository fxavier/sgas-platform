import { NextResponse } from 'next/server';
import { relatorioInicialIncidenteSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Test endpoint - Request data received:', data);

    const validationResult = relatorioInicialIncidenteSchema.safeParse(data);

    if (!validationResult.success) {
      console.error(
        'Test endpoint - Validation error:',
        validationResult.error.format()
      );
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    console.log('Test endpoint - Validated data:', validatedData);

    // Instead of saving to the database, just return success with the validated data
    return NextResponse.json(
      {
        success: true,
        message:
          'Dados validados com sucesso, nenhuma operação de banco de dados foi realizada',
        data: validatedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Test endpoint - Error:', error);
    // Safely log error details with type checking
    const err = error as any;
    console.error('Test endpoint - Error details:', {
      name: err?.name,
      message: err?.message,
      code: err?.code,
      meta: err?.meta,
      stack: err?.stack,
    });

    return NextResponse.json(
      { error: 'Erro no endpoint de teste' },
      { status: 500 }
    );
  }
}
