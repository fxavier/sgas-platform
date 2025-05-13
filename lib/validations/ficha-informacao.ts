import { z } from 'zod';

export const fichaInformacaoSchema = z.object({
  tenantId: z.string().min(1, 'Tenant é obrigatório'),
  projectId: z.string().min(1, 'Projeto é obrigatório'),
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
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  bairroActividade: z.string().min(1, 'Bairro é obrigatório'),
  vilaActividade: z.string().min(1, 'Vila é obrigatória'),
  cidadeActividade: z.string().min(1, 'Cidade é obrigatória'),
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
  descricaoActividade: z
    .string()
    .min(1, 'Descrição da atividade é obrigatória'),
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
  caracteristicasFisicasLocalActividade: z.enum([
    'PLANICIE',
    'PLANALTO',
    'VALE',
    'MONTANHA',
  ]),
  ecosistemasPredominantes: z.enum([
    'FLUVIAL',
    'LACUSTRE',
    'MARINHO',
    'TERRESTRE',
  ]),
  zonaLocalizacao: z.enum(['COSTEIRA', 'INTERIOR', 'ILHA']),
  tipoVegetacaoPredominante: z.enum(['FLORESTA', 'SAVANA', 'OUTRO']),
  usoSolo: z.enum([
    'AGROPECUARIO',
    'HABITACIONAL',
    'INDUSTRIAL',
    'PROTECCAO',
    'OUTRO',
  ]),
  infraestruturaExistenteAreaActividade: z.string().optional(),
  informacaoComplementarAtravesMaps: z.string().optional(),
  valorTotalInvestimento: z
    .number()
    .min(0, 'Valor deve ser maior ou igual a 0'),
});

export type FichaInformacaoFormData = z.infer<typeof fichaInformacaoSchema>;

export const fichaInformacaoUpdateSchema = fichaInformacaoSchema.partial();
