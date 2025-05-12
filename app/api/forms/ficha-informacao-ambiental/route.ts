import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import {
  fichaInformacaoSchema,
  fichaInformacaoUpdateSchema,
} from '@/lib/validations/ficha-informacao';

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

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
      projectId: projectId || undefined,
    });

    const registros =
      await contextualPrisma.fichaInformacaoAmbientalPreliminar.findMany({
        orderBy: {
          updatedAt: 'desc',
        },
      });

    return NextResponse.json(registros);
  } catch (error) {
    console.error('Error fetching registros:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar registros' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validationResult = fichaInformacaoSchema.safeParse(data);

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

    const newRegistro = await prisma.fichaInformacaoAmbientalPreliminar.create({
      data: {
        nomeActividade: validatedData.nomeActividade,
        tipoActividade: validatedData.tipoActividade,
        proponentes: validatedData.proponentes,
        endereco: validatedData.endereco,
        telefone: validatedData.telefone,
        fax: validatedData.fax,
        telemovel: validatedData.telemovel,
        email: validatedData.email,
        bairroActividade: validatedData.bairroActividade,
        vilaActividade: validatedData.vilaActividade,
        cidadeActividade: validatedData.cidadeActividade,
        localidadeActividade: validatedData.localidadeActividade,
        distritoActividade: validatedData.distritoActividade,
        provinciaActividade: validatedData.provinciaActividade,
        coordenadasGeograficas: validatedData.coordenadasGeograficas,
        meioInsercao: validatedData.meioInsercao,
        enquadramentoOrcamentoTerritorial:
          validatedData.enquadramentoOrcamentoTerritorial,
        descricaoActividade: validatedData.descricaoActividade,
        actividadesAssociadas: validatedData.actividadesAssociadas,
        descricaoTecnologiaConstrucaoOperacao:
          validatedData.descricaoTecnologiaConstrucaoOperacao,
        actividadesComplementaresPrincipais:
          validatedData.actividadesComplementaresPrincipais,
        tipoQuantidadeOrigemMaoDeObra:
          validatedData.tipoQuantidadeOrigemMaoDeObra,
        tipoQuantidadeOrigemProvenienciaMateriasPrimas:
          validatedData.tipoQuantidadeOrigemProvenienciaMateriasPrimas,
        quimicosUtilizados: validatedData.quimicosUtilizados,
        tipoOrigemConsumoAguaEnergia:
          validatedData.tipoOrigemConsumoAguaEnergia,
        origemCombustiveisLubrificantes:
          validatedData.origemCombustiveisLubrificantes,
        outrosRecursosNecessarios: validatedData.outrosRecursosNecessarios,
        posseDeTerra: validatedData.posseDeTerra,
        alternativasLocalizacaoActividade:
          validatedData.alternativasLocalizacaoActividade,
        descricaoBreveSituacaoAmbientalReferenciaLocalRegional:
          validatedData.descricaoBreveSituacaoAmbientalReferenciaLocalRegional,
        caracteristicasFisicasLocalActividade:
          validatedData.caracteristicasFisicasLocalActividade,
        ecosistemasPredominantes: validatedData.ecosistemasPredominantes,
        zonaLocalizacao: validatedData.zonaLocalizacao,
        tipoVegetacaoPredominante: validatedData.tipoVegetacaoPredominante,
        usoSolo: validatedData.usoSolo,
        infraestruturaExistenteAreaActividade:
          validatedData.infraestruturaExistenteAreaActividade,
        informacaoComplementarAtravesMaps:
          validatedData.informacaoComplementarAtravesMaps,
        valorTotalInvestimento: validatedData.valorTotalInvestimento,
        tenant: { connect: { id: tenantId } },
        project: { connect: { id: projectId } },
      },
    });

    return NextResponse.json(newRegistro, { status: 201 });
  } catch (error) {
    console.error('Error creating registro:', error);
    return NextResponse.json(
      { error: 'Erro ao criar registro' },
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
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const data = await req.json();
    const validationResult = fichaInformacaoUpdateSchema.safeParse(data);

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
    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    const existingRegistro =
      await contextualPrisma.fichaInformacaoAmbientalPreliminar.findUnique({
        where: { id },
      });

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    const updateData: any = { ...validatedData };
    delete updateData.tenantId;
    delete updateData.projectId;

    if (validatedData.tenantId) {
      updateData.tenant = { connect: { id: validatedData.tenantId } };
    }

    if (validatedData.projectId) {
      updateData.project = { connect: { id: validatedData.projectId } };
    }

    const updatedRegistro =
      await prisma.fichaInformacaoAmbientalPreliminar.update({
        where: { id },
        data: updateData,
      });

    return NextResponse.json(updatedRegistro);
  } catch (error) {
    console.error('Error updating registro:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar registro' },
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
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    const existingRegistro =
      await contextualPrisma.fichaInformacaoAmbientalPreliminar.findUnique({
        where: { id },
      });

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    await prisma.fichaInformacaoAmbientalPreliminar.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting registro:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir registro' },
      { status: 500 }
    );
  }
}
