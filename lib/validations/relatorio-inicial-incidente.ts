import { z } from 'zod';

// Base schema without refinements
const relatorioInicialIncidenteBaseSchema = z.object({
  tipoIncidente: z.enum(
    [
      'FATALIDADE',
      'OCORRENCIA_PERIGOSA',
      'INCIDENTE_QUASE_ACIDENTE',
      'TEMPO_PERDIDO',
      'INCIDENTE_AMBIENTAL',
      'SEGURANCA',
      'RECLAMACAO_EXTERNA',
      'NOTIFICACAO_DO_REGULADOR_VIOLACAO',
      'DERAMAMENTO_LBERACAO_DESCONTROLADA',
      'DANOS_PERDAS',
      'FLORA_FAUNA',
      'AUDITORIA_NAO_CONFORMIDADE',
    ],
    {
      required_error: 'Tipo de incidente é obrigatório',
    }
  ),
  dataIncidente: z.coerce.date(),
  horaIncidente: z.coerce.date(),
  seccao: z
    .string()
    .max(100, 'Seção não pode ter mais de 100 caracteres')
    .optional(),
  localIncidente: z.string().min(1, 'Local do incidente é obrigatório'),
  dataComunicacao: z.coerce.date(),
  supervisor: z
    .string()
    .min(1, 'Supervisor é obrigatório')
    .max(100, 'Supervisor não pode ter mais de 100 caracteres'),
  empregado: z.enum(['SIM', 'NAO']).optional(),
  nomeFuncionario: z
    .string()
    .max(100, 'Nome do funcionário não pode ter mais de 100 caracteres')
    .optional(),
  subcontratante: z.enum(['SIM', 'NAO']).optional(),
  nomeSubcontratado: z
    .string()
    .max(100, 'Nome do subcontratado não pode ter mais de 100 caracteres')
    .optional(),
  descricaoCircunstanciaIncidente: z
    .string()
    .min(1, 'Descrição da circunstância do incidente é obrigatória'),
  infoSobreFeriodosETratamentoFeito: z
    .string()
    .min(1, 'Informação sobre feridos e tratamento é obrigatória'),
  declaracaoDeTestemunhas: z.string().optional(),
  conclusaoPreliminar: z.string().optional(),
  recomendacoes: z.string().min(1, 'Recomendações são obrigatórias'),
  inclusaoEmMateriaSeguranca: z
    .string()
    .max(
      100,
      'Inclusão em matéria de segurança não pode ter mais de 100 caracteres'
    )
    .optional(),
  prazo: z.coerce.date().optional(),
  necessitaDeInvestigacaoAprofundada: z.enum(['SIM', 'NAO']),
  incidenteReportavel: z.enum(['SIM', 'NAO']),
  credoresObrigadosASeremNotificados: z.enum(['SIM', 'NAO']),
  autorDoRelatorio: z.string().optional(),
  dataCriacao: z.coerce.date(),
  nomeProvedor: z
    .string()
    .min(1, 'Nome do provedor é obrigatório')
    .max(100, 'Nome do provedor não pode ter mais de 100 caracteres'),
  data: z.coerce.date(),
  projectId: z
    .string()
    .uuid('ID do projeto inválido - deve ser um UUID válido'),
  tenantId: z
    .string()
    .uuid('ID do inquilino inválido - deve ser um UUID válido'),
});

// Add refinements for the full schema
export const relatorioInicialIncidenteSchema =
  relatorioInicialIncidenteBaseSchema
    .refine(
      (data) => {
        // If empregado is SIM, nomeFuncionario is required
        if (data.empregado === 'SIM' && !data.nomeFuncionario) {
          return false;
        }
        return true;
      },
      {
        message: 'Nome do funcionário é obrigatório quando Empregado é SIM',
        path: ['nomeFuncionario'],
      }
    )
    .refine(
      (data) => {
        // If subcontratante is SIM, nomeSubcontratado is required
        if (data.subcontratante === 'SIM' && !data.nomeSubcontratado) {
          return false;
        }
        return true;
      },
      {
        message:
          'Nome do subcontratado é obrigatório quando Subcontratante é SIM',
        path: ['nomeSubcontratado'],
      }
    );

// Base schema for updates (partial fields)
const updateBaseSchema = relatorioInicialIncidenteBaseSchema.partial();

// Add refinements for the update schema
export const relatorioInicialIncidenteUpdateSchema = updateBaseSchema
  .refine(
    (data) => {
      // If empregado is SIM, nomeFuncionario is required
      if (data.empregado === 'SIM' && data.nomeFuncionario === undefined) {
        return false;
      }
      return true;
    },
    {
      message: 'Nome do funcionário é obrigatório quando Empregado é SIM',
      path: ['nomeFuncionario'],
    }
  )
  .refine(
    (data) => {
      // If subcontratante is SIM, nomeSubcontratado is required
      if (
        data.subcontratante === 'SIM' &&
        data.nomeSubcontratado === undefined
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        'Nome do subcontratado é obrigatório quando Subcontratante é SIM',
      path: ['nomeSubcontratado'],
    }
  );
