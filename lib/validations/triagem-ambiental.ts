import { z } from 'zod';

export const triagemAmbientalSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, 'Tenant é obrigatório'),
  projectId: z.string().min(1, 'Projeto é obrigatório'),
  responsavelPeloPreenchimentoId: z
    .string()
    .min(1, 'Responsável pelo preenchimento é obrigatório'),
  responsavelPelaVerificacaoId: z
    .string()
    .min(1, 'Responsável pela verificação é obrigatório'),
  subprojectoId: z.string().min(1, 'Subprojeto é obrigatório'),
  consultaEngajamento: z.string().optional(),
  accoesRecomendadas: z.string().optional(),
  resultadoTriagemId: z.string().min(1, 'Resultado da triagem é obrigatório'),
  identificacaoRiscos: z
    .array(
      z.object({
        biodiversidadeRecursosNaturaisId: z.string(),
        resposta: z.enum(['SIM', 'NAO']),
        comentario: z.string().optional(),
        normaAmbientalSocial: z.string().optional(),
      })
    )
    .optional(),
});

export type TriagemAmbientalFormData = z.infer<typeof triagemAmbientalSchema>;

export const triagemAmbientalUpdateSchema = triagemAmbientalSchema.partial();
