import { z } from 'zod';

// Schema for validation of RelatorioIncidente
export const relatorioIncidenteSchema = z.object({
  dataIncidente: z.coerce.date(),
  horaIncident: z.coerce.date(),
  descricaoDoIncidente: z
    .string()
    .min(1, 'Descrição do incidente é obrigatória'),
  detalhesLesao: z.string().min(1, 'Detalhes da lesão são obrigatórios'),
  accoesImediatasTomadas: z
    .string()
    .min(1, 'Ações imediatas tomadas são obrigatórias'),
  tipoFuncionario: z.enum(['CONTRATADO', 'INCIDENTE_DE_TERCEIROS']),
  categoriaPessoaEnvolvida: z
    .string()
    .min(1, 'Categoria da pessoa envolvida é obrigatória'),
  formaActividade: z.enum(['CONTROLADA', 'NAO_CONTROLADA', 'MONITORADA']),
  foiRealizadaAvaliacaoRisco: z.enum(['SIM', 'NAO']),
  existePadraoControleRisco: z.enum(['SIM', 'NAO']),
  tipoConsequenciaIncidenteReal: z.string().optional(),
  tipoConsequenciaIncidentePotencial: z.string().optional(),
  efeitosIncidenteReal: z.enum([
    'SAUDE',
    'SEGURANCA',
    'AMBIENTE',
    'COMUNIDADE',
  ]),
  classificacaoGravidadeIncidenteReal: z.string().optional(),
  efeitosIncidentePotencial: z
    .enum(['SAUDE', 'SEGURANCA', 'AMBIENTE', 'COMUNIDADE'])
    .optional(),
  classificacaoGravidadeIncidentePotencial: z.string().optional(),
  esteFoiIncidenteSemBarreira: z.enum(['SIM', 'NAO']),
  foiIncidenteRepetitivo: z.enum(['SIM', 'NAO']),
  foiIncidenteResultanteFalhaProcesso: z.enum(['SIM', 'NAO']),
  danosMateriais: z.enum(['SIM', 'NAO']),
  valorDanos: z.coerce.number().optional(),
  projectId: z
    .string()
    .uuid('ID do projeto inválido - deve ser um UUID válido'),
  tenantId: z
    .string()
    .uuid('ID do inquilino inválido - deve ser um UUID válido'),
  // Optional fields
  statusInvestigacao: z.string().optional(),
  dataInvestigacaoCompleta: z.coerce.date().optional(),
  ausenciaOuFalhaDefesas: z.enum(['SIM', 'NAO']).optional(),
  descricaoAusenciaOuFalhaDefesas: z.string().optional(),
  accoesIndividuaisOuEquipe: z.string().optional(),
  descricaoAccaoIndividualOuEquipe: z.string().optional(),
  tarefaOuCondicoesAmbientaisLocalTrabalho: z.string().optional(),
  descricaoTarefaOuCondicoesAmbientaisLocalTrabalho: z.string().optional(),
  tarefaOuCondicoesAmbientaisHumano: z.string().optional(),
  descricaoTarefaOuCondicoesAmbientaisHumano: z.string().optional(),
  factoresOrganizacionais: z.string().optional(),
  descricaoFactoresOrganizacionais: z.string().optional(),
  causasSubjacentesEPrincipaisFactoresContribuintes: z.string().optional(),
  descricaoIncidenteAposInvestigacao: z.string().optional(),
  principaisLicoes: z.string().optional(),
  resgistoRiscoActivosActualizadosAposInvestigacao: z
    .enum(['SIM', 'NAO'])
    .optional(),
  voceCompartilhouAprendizadoDesteEventoComRestanteOrganizacao: z
    .enum(['SIM', 'NAO'])
    .optional(),
  comoPartilhou: z.string().optional(),
  superiorHierarquicoResponsavel: z.string().optional(),
  telefoneSuperiorHierarquicoResponsavel: z.string().optional(),
  tituloSuperiorHierarquicoResponsavel: z.string().optional(),
  emailSuperiorHierarquicoResponsavel: z.string().optional(),
});

// Schema for partial updates
export const relatorioIncidenteUpdateSchema =
  relatorioIncidenteSchema.partial();
