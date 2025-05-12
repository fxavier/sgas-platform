import { z } from 'zod';

export const identificacaoRiscosSchema = z.object({
  numeroReferencia: z.string().optional(),
  processo: z.string().optional(),
  actiactividade: z.string().min(1, 'Atividade é obrigatória'),
  riscosImpactosId: z.string().uuid('ID de riscos e impactos inválido'),
  realOuPotencial: z.string().optional(),
  condicao: z.enum(['NORMAL', 'ANORMAL', 'EMERGENCIA']),
  factorAmbientalImpactadoId: z
    .string()
    .uuid('ID do fator ambiental impactado inválido'),
  faseProjecto: z.enum([
    'PRE_CONSTRUCAO',
    'CONSTRUCAO',
    'OPERACAO',
    'DESATIVACAO',
    'ENCERRAMENTO',
    'RESTAURACAO',
  ]),
  estatuto: z.enum(['POSITIVO', 'NEGATIVO']),
  extensao: z.enum(['LOCAL', 'REGIONAL', 'NACIONAL', 'GLOBAL']),
  duduacao: z.enum(['CURTO_PRAZO', 'MEDIO_PRAZO', 'LONGO_PRAZO']),
  intensidade: z.enum(['BAIXA', 'MEDIA', 'ALTA']),
  probabilidade: z.enum([
    'IMPROVAVEL',
    'PROVAVEL',
    'ALTAMENTE_PROVAVEL',
    'DEFINITIVA',
  ]),
  significancia: z.string().optional(),
  duracaoRisco: z.string().optional(),
  descricaoMedidas: z.string().min(1, 'Descrição das medidas é obrigatória'),
  respresponsavelonsible: z.string().optional(),
  prazo: z.coerce.date(),
  referenciaDocumentoControl: z.string().optional(),
  legislacaoMocambicanaAplicavel: z.string().optional(),
  observacoes: z.string().min(1, 'Observações são obrigatórias'),
  tenantId: z.string().uuid('ID do tenant inválido'),
  projectId: z.string().uuid('ID do projeto inválido'),
});

export const identificacaoRiscosUpdateSchema =
  identificacaoRiscosSchema.partial();
