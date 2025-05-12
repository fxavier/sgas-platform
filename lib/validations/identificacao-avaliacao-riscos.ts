import { z } from 'zod';

export const identificacaoAvaliacaoRiscosSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, 'Tenant é obrigatório'),
  projectId: z.string().min(1, 'Projeto é obrigatório'),
  numeroReferencia: z.string().optional(),
  processo: z.string().optional(),
  actiactividade: z.string().min(1, 'Atividade é obrigatória'),
  riscosImpactosId: z.string().min(1, 'Risco/Impacto é obrigatório'),
  realOuPotencial: z.string().optional(),
  condicao: z.enum(['NORMAL', 'ANORMAL', 'EMERGENCIA'], {
    required_error: 'Condição é obrigatória',
  }),
  factorAmbientalImpactadoId: z
    .string()
    .min(1, 'Fator Ambiental Impactado é obrigatório'),
  faseProjecto: z.enum(
    [
      'PRE_CONSTRUCAO',
      'CONSTRUCAO',
      'OPERACAO',
      'DESATIVACAO',
      'ENCERRAMENTO',
      'RESTAURACAO',
    ],
    {
      required_error: 'Fase do Projeto é obrigatória',
    }
  ),
  estatuto: z.enum(['POSITIVO', 'NEGATIVO'], {
    required_error: 'Estatuto é obrigatório',
  }),
  extensao: z.enum(['LOCAL', 'REGIONAL', 'NACIONAL', 'GLOBAL'], {
    required_error: 'Extensão é obrigatória',
  }),
  duduacao: z.enum(['CURTO_PRAZO', 'MEDIO_PRAZO', 'LONGO_PRAZO'], {
    required_error: 'Duração é obrigatória',
  }),
  intensidade: z.enum(['BAIXA', 'MEDIA', 'ALTA'], {
    required_error: 'Intensidade é obrigatória',
  }),
  probabilidade: z.enum(
    ['IMPROVAVEL', 'PROVAVEL', 'ALTAMENTE_PROVAVEL', 'DEFINITIVA'],
    {
      required_error: 'Probabilidade é obrigatória',
    }
  ),
  significancia: z.string().optional(),
  duracaoRisco: z.string().optional(),
  descricaoMedidas: z.string().min(1, 'Descrição das Medidas é obrigatória'),
  respresponsavelonsible: z.string().optional(),
  prazo: z.date(),
  referenciaDocumentoControl: z.string().optional(),
  legislacaoMocambicanaAplicavel: z.string().optional(),
  observacoes: z.string().min(1, 'Observações são obrigatórias'),
});

export type IdentificacaoAvaliacaoRiscosFormData = z.infer<
  typeof identificacaoAvaliacaoRiscosSchema
>;
