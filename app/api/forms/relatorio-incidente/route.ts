import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  createContextualPrismaClient,
  getContextFromRequest,
} from '@/lib/db-context';
import {
  relatorioIncidenteSchema,
  relatorioIncidenteUpdateSchema,
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
    const relatorios = await contextualPrisma.relatorioIncidente.findMany({
      include: {
        equipaInvestigacaoIncidente: {
          include: {
            pessoaEnvolvida: true,
          },
        },
        accoesCorrectivasPermanentesTomar: {
          include: {
            accaoCorrectiva: true,
          },
        },
        fotografias: {
          include: {
            fotografia: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(relatorios);
  } catch (error) {
    console.error('Error fetching relatorios:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar relatórios de incidente' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const validationResult = relatorioIncidenteSchema.safeParse(data);

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
    const { tenantId, projectId } = validatedData;

    // Add special handling for the horaIncident field which is a Time type in the database
    if (validatedData.horaIncident) {
      // Create a Date object and extract only the time portion
      const timeDate = new Date(validatedData.horaIncident);
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
      validatedData.horaIncident = timeDate;
    }

    // Use standard prisma for writes - we provide tenant and project connections explicitly
    const newRelatorio = await prisma.relatorioIncidente.create({
      data: {
        dataIncidente: validatedData.dataIncidente,
        horaIncident: validatedData.horaIncident,
        descricaoDoIncidente: validatedData.descricaoDoIncidente,
        detalhesLesao: validatedData.detalhesLesao,
        accoesImediatasTomadas: validatedData.accoesImediatasTomadas,
        tipoFuncionario: validatedData.tipoFuncionario,
        categoriaPessoaEnvolvida: validatedData.categoriaPessoaEnvolvida,
        formaActividade: validatedData.formaActividade,
        foiRealizadaAvaliacaoRisco: validatedData.foiRealizadaAvaliacaoRisco,
        existePadraoControleRisco: validatedData.existePadraoControleRisco,
        tipoConsequenciaIncidenteReal:
          validatedData.tipoConsequenciaIncidenteReal,
        tipoConsequenciaIncidentePotencial:
          validatedData.tipoConsequenciaIncidentePotencial,
        efeitosIncidenteReal: validatedData.efeitosIncidenteReal,
        classificacaoGravidadeIncidenteReal:
          validatedData.classificacaoGravidadeIncidenteReal,
        efeitosIncidentePotencial: validatedData.efeitosIncidentePotencial,
        classificacaoGravidadeIncidentePotencial:
          validatedData.classificacaoGravidadeIncidentePotencial,
        esteFoiIncidenteSemBarreira: validatedData.esteFoiIncidenteSemBarreira,
        foiIncidenteRepetitivo: validatedData.foiIncidenteRepetitivo,
        foiIncidenteResultanteFalhaProcesso:
          validatedData.foiIncidenteResultanteFalhaProcesso,
        danosMateriais: validatedData.danosMateriais,
        valorDanos: validatedData.valorDanos,
        statusInvestigacao: validatedData.statusInvestigacao,
        dataInvestigacaoCompleta: validatedData.dataInvestigacaoCompleta,
        ausenciaOuFalhaDefesas: validatedData.ausenciaOuFalhaDefesas,
        descricaoAusenciaOuFalhaDefesas:
          validatedData.descricaoAusenciaOuFalhaDefesas,
        accoesIndividuaisOuEquipe: validatedData.accoesIndividuaisOuEquipe,
        descricaoAccaoIndividualOuEquipe:
          validatedData.descricaoAccaoIndividualOuEquipe,
        tarefaOuCondicoesAmbientaisLocalTrabalho:
          validatedData.tarefaOuCondicoesAmbientaisLocalTrabalho,
        descricaoTarefaOuCondicoesAmbientaisLocalTrabalho:
          validatedData.descricaoTarefaOuCondicoesAmbientaisLocalTrabalho,
        tarefaOuCondicoesAmbientaisHumano:
          validatedData.tarefaOuCondicoesAmbientaisHumano,
        descricaoTarefaOuCondicoesAmbientaisHumano:
          validatedData.descricaoTarefaOuCondicoesAmbientaisHumano,
        factoresOrganizacionais: validatedData.factoresOrganizacionais,
        descricaoFactoresOrganizacionais:
          validatedData.descricaoFactoresOrganizacionais,
        causasSubjacentesEPrincipaisFactoresContribuintes:
          validatedData.causasSubjacentesEPrincipaisFactoresContribuintes,
        descricaoIncidenteAposInvestigacao:
          validatedData.descricaoIncidenteAposInvestigacao,
        principaisLicoes: validatedData.principaisLicoes,
        resgistoRiscoActivosActualizadosAposInvestigacao:
          validatedData.resgistoRiscoActivosActualizadosAposInvestigacao,
        voceCompartilhouAprendizadoDesteEventoComRestanteOrganizacao:
          validatedData.voceCompartilhouAprendizadoDesteEventoComRestanteOrganizacao,
        comoPartilhou: validatedData.comoPartilhou,
        superiorHierarquicoResponsavel:
          validatedData.superiorHierarquicoResponsavel,
        telefoneSuperiorHierarquicoResponsavel:
          validatedData.telefoneSuperiorHierarquicoResponsavel,
        tituloSuperiorHierarquicoResponsavel:
          validatedData.tituloSuperiorHierarquicoResponsavel,
        emailSuperiorHierarquicoResponsavel:
          validatedData.emailSuperiorHierarquicoResponsavel,
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

    return NextResponse.json(newRelatorio, { status: 201 });
  } catch (error) {
    console.error('Error creating relatorio:', error);
    return NextResponse.json(
      { error: 'Erro ao criar relatório de incidente' },
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

    const validationResult = relatorioIncidenteUpdateSchema.safeParse(data);

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
    const existingReport = await contextualPrisma.relatorioIncidente.findUnique(
      {
        where: { id },
      }
    );

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
    const updatedRelatorio = await prisma.relatorioIncidente.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedRelatorio);
  } catch (error) {
    console.error('Error updating relatorio:', error);

    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Relatório não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar relatório de incidente' },
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
    const existingReport = await contextualPrisma.relatorioIncidente.findUnique(
      {
        where: { id },
      }
    );

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
    await prisma.relatorioIncidente.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting relatorio:', error);

    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Relatório não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao excluir relatório de incidente' },
      { status: 500 }
    );
  }
}
