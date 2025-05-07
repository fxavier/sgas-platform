import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  createContextualPrismaClient,
  getContextFromRequest,
} from '@/lib/db-context';
import {
  relatorioInicialIncidenteSchema,
  relatorioInicialIncidenteUpdateSchema,
} from '@/lib/validations';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    // Create contextual prisma client
    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
      projectId: projectId || undefined,
    });

    // We don't need to add tenant/project filters as they're handled by the contextual client
    const relatorios =
      await contextualPrisma.relatorioInicialIncidente.findMany({
        include: {
          incidentes: {
            include: {
              incidente: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

    return NextResponse.json(relatorios);
  } catch (error) {
    console.error('Error fetching relatorios iniciais:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar relatórios iniciais de incidente' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Request data received:', data);

    const validationResult = relatorioInicialIncidenteSchema.safeParse(data);

    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.format());
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    console.log('Validated data:', validatedData);
    const { tenantId, projectId } = validatedData;

    // Add special handling for the horaIncidente field which is a Time type in the database
    if (validatedData.horaIncidente) {
      // Create a Date object and extract only the time portion
      const timeDate = new Date(validatedData.horaIncidente);
      // Convert to a time-only string in PostgreSQL format that can be stored in a TIME field
      const timeOnly = `${timeDate
        .getHours()
        .toString()
        .padStart(2, '0')}:${timeDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${timeDate
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;
      console.log('Processing time field:', timeOnly);

      // Keep the same Date object but ensure we only use the time portion for the database
      validatedData.horaIncidente = timeDate;
    }

    console.log('Checking for nomeFuncionario when empregado is SIM');
    if (validatedData.empregado === 'SIM' && !validatedData.nomeFuncionario) {
      console.warn('Empregado is SIM but nomeFuncionario is missing');
    }

    console.log('Checking for nomeSubcontratado when subcontratante is SIM');
    if (
      validatedData.subcontratante === 'SIM' &&
      !validatedData.nomeSubcontratado
    ) {
      console.warn('Subcontratante is SIM but nomeSubcontratado is missing');
    }

    console.log('Checking field lengths for VarChar(100) fields');
    const varcharFields = [
      { name: 'seccao', value: validatedData.seccao },
      { name: 'supervisor', value: validatedData.supervisor },
      { name: 'nomeFuncionario', value: validatedData.nomeFuncionario },
      { name: 'nomeSubcontratado', value: validatedData.nomeSubcontratado },
      {
        name: 'inclusaoEmMateriaSeguranca',
        value: validatedData.inclusaoEmMateriaSeguranca,
      },
      { name: 'nomeProvedor', value: validatedData.nomeProvedor },
    ];

    for (const field of varcharFields) {
      if (field.value && field.value.length > 100) {
        console.warn(
          `Field ${field.name} exceeds 100 characters: ${field.value.length}`
        );
      }
    }

    // Use try/catch specifically for the database operation
    try {
      console.log('Attempting to create relatorioInicialIncidente record');
      // Use standard prisma for writes - we provide tenant and project connections explicitly
      const newRelatorio = await prisma.relatorioInicialIncidente.create({
        data: {
          tipoIncidente: validatedData.tipoIncidente,
          dataIncidente: validatedData.dataIncidente,
          horaIncidente: validatedData.horaIncidente,
          seccao: validatedData.seccao,
          localIncidente: validatedData.localIncidente,
          dataComunicacao: validatedData.dataComunicacao,
          supervisor: validatedData.supervisor,
          empregado: validatedData.empregado,
          nomeFuncionario: validatedData.nomeFuncionario,
          subcontratante: validatedData.subcontratante,
          nomeSubcontratado: validatedData.nomeSubcontratado,
          descricaoCircunstanciaIncidente:
            validatedData.descricaoCircunstanciaIncidente,
          infoSobreFeriodosETratamentoFeito:
            validatedData.infoSobreFeriodosETratamentoFeito,
          declaracaoDeTestemunhas: validatedData.declaracaoDeTestemunhas,
          conclusaoPreliminar: validatedData.conclusaoPreliminar,
          recomendacoes: validatedData.recomendacoes,
          inclusaoEmMateriaSeguranca: validatedData.inclusaoEmMateriaSeguranca,
          prazo: validatedData.prazo,
          necessitaDeInvestigacaoAprofundada:
            validatedData.necessitaDeInvestigacaoAprofundada,
          incidenteReportavel: validatedData.incidenteReportavel,
          credoresObrigadosASeremNotificados:
            validatedData.credoresObrigadosASeremNotificados,
          autorDoRelatorio: validatedData.autorDoRelatorio,
          dataCriacao: validatedData.dataCriacao,
          nomeProvedor: validatedData.nomeProvedor,
          data: validatedData.data,
          tenant: {
            connect: {
              id: tenantId,
            },
          },
          project: {
            connect: {
              id: projectId,
            },
          },
        },
      });

      console.log('Successfully created record:', newRelatorio.id);
      return NextResponse.json(newRelatorio, { status: 201 });
    } catch (dbError) {
      console.error('Database error during creation:', dbError);
      // Safely log error details with type checking
      const err = dbError as any;
      console.error('Database error details:', {
        name: err?.name,
        message: err?.message,
        code: err?.code,
        meta: err?.meta,
        stack: err?.stack,
      });

      // Check for specific error types
      if (err?.code === 'P2002') {
        return NextResponse.json(
          { error: 'Registo já existe na base de dados', details: err?.meta },
          { status: 409 }
        );
      } else if (err?.code === 'P2003') {
        return NextResponse.json(
          { error: 'Referência inválida', details: err?.meta },
          { status: 400 }
        );
      }

      throw dbError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('Error creating relatorio inicial:', error);
    // Safely log error details with type checking
    const err = error as any;
    console.error('Error details:', {
      name: err?.name,
      message: err?.message,
      code: err?.code,
      meta: err?.meta,
      stack: err?.stack,
    });

    return NextResponse.json(
      { error: 'Erro ao criar relatório inicial de incidente' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do relatório é obrigatório' },
        { status: 400 }
      );
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const data = await req.json();

    const validationResult =
      relatorioInicialIncidenteUpdateSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Remove tenant and project connects if they don't exist in the data
    const updateData: any = { ...validatedData };
    delete updateData.tenantId;
    delete updateData.projectId;

    if (validatedData.tenantId) {
      updateData.tenant = {
        connect: { id: validatedData.tenantId },
      };
    }

    if (validatedData.projectId) {
      updateData.project = {
        connect: { id: validatedData.projectId },
      };
    }

    // Create contextual prisma client to verify tenant access
    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    // First verify that this record belongs to the correct tenant
    const existingReport =
      await contextualPrisma.relatorioInicialIncidente.findUnique({
        where: { id },
      });

    if (!existingReport) {
      return NextResponse.json(
        {
          error:
            'Relatório não encontrado ou você não tem permissão para acessá-lo',
        },
        { status: 404 }
      );
    }

    // Use standard prisma for updates, as we've verified access
    const updatedRelatorio = await prisma.relatorioInicialIncidente.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedRelatorio);
  } catch (error) {
    console.error('Error updating relatorio inicial:', error);

    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Relatório não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar relatório inicial de incidente' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do relatório é obrigatório' },
        { status: 400 }
      );
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    // Create contextual prisma client to verify tenant access
    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    // First verify that this record belongs to the correct tenant
    const existingReport =
      await contextualPrisma.relatorioInicialIncidente.findUnique({
        where: { id },
      });

    if (!existingReport) {
      return NextResponse.json(
        {
          error:
            'Relatório não encontrado ou você não tem permissão para acessá-lo',
        },
        { status: 404 }
      );
    }

    // Use standard prisma for deletes, as we've verified access
    await prisma.relatorioInicialIncidente.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting relatorio inicial:', error);

    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Relatório não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao excluir relatório inicial de incidente' },
      { status: 500 }
    );
  }
}
