import { z } from 'zod';

export const fichaInformacaoSchema = z.object({
  nomeActividade: z.string().min(1, 'Nome da atividade é obrigatório'),
  tipoActividade: z.enum([
    'TURISTICA',
    'INDUSTRIAL',
    'AGRO_PECUARIA',
    'ENERGETICA',
    'SERVICOS',
    'OUTRA',
  ]),
  proponentes: z.string().optional(),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  telefone: z.string().optional(),
  fax: z.string().optional(),
  telemovel: z.string().optional(),
  email: z.string().email('Email inválido'),
  bairroActividade: z.string().min(1, 'Bairro da atividade é obrigatório'),
  vilaActividade: z.string().min(1, 'Vila da atividade é obrigatória'),
  cidadeActividade: z.string().min(1, 'Cidade da atividade é obrigatória'),
  localidadeActividade: z.string().optional(),
  distritoActividade: z.string().optional(),
  provinciaActividade: z.enum([
    'MAPUTO',
    'MAPUTO_CIDADE',
    'GAZA',
    'INHAMBANE',
    'SOFALA',
    'MANICA',
    'TETE',
    'ZAMBEZIA',
    'NAMPULA',
    'CABO_DELGADO',
    'NIASSA',
  ]),
  coordenadasGeograficas: z.string().optional(),
  meioInsercao: z.enum(['RURAL', 'URBANO', 'PERIURBANO']),
  enquadramentoOrcamentoTerritorial: z.enum([
    'ESPACO_HABITACIONAL',
    'INDUSTRIAL',
    'SERVICOS',
    'OUTRO',
  ]),
  descricaoActividade: z.string().optional(),
  actividadesAssociadas: z.string().optional(),
  descricaoTecnologiaConstrucaoOperacao: z.string().optional(),
  actividadesComplementaresPrincipais: z.string().optional(),
  tipoQuantidadeOrigemMaoDeObra: z.string().optional(),
  tipoQuantidadeOrigemProvenienciaMateriasPrimas: z.string().optional(),
  quimicosUtilizados: z.string().optional(),
  tipoOrigemConsumoAguaEnergia: z.string().optional(),
  origemCombustiveisLubrificantes: z.string().optional(),
  outrosRecursosNecessarios: z.string().optional(),
  posseDeTerra: z.string().optional(),
  alternativasLocalizacaoActividade: z.string().optional(),
  descricaoBreveSituacaoAmbientalReferenciaLocalRegional: z.string().optional(),
  caracteristicasFisicasLocalActividade: z
    .enum(['PLANICIE', 'PLANALTO', 'VALE', 'MONTANHA'])
    .optional(),
  ecosistemasPredominantes: z
    .enum(['FLUVIAL', 'LACUSTRE', 'MARINHO', 'TERRESTRE'])
    .optional(),
  zonaLocalizacao: z.enum(['COSTEIRA', 'INTERIOR', 'ILHA']).optional(),
  tipoVegetacaoPredominante: z.enum(['FLORESTA', 'SAVANA', 'OUTRO']).optional(),
  usoSolo: z
    .enum(['AGROPECUARIO', 'HABITACIONAL', 'INDUSTRIAL', 'PROTECCAO', 'OUTRO'])
    .optional(),
  infraestruturaExistenteAreaActividade: z.string().optional(),
  informacaoComplementarAtravesMaps: z.string().optional(),
  valorTotalInvestimento: z.number().optional(),
  tenantId: z.string().uuid('ID do tenant inválido'),
  projectId: z.string().uuid('ID do projeto inválido'),
});

export const fichaInformacaoUpdateSchema = fichaInformacaoSchema.partial();
