import { z } from 'zod';

export const triagemAmbientalSchema = z.object({
  responsavelPeloPreenchimentoId: z
    .string()
    .uuid('ID do responsável pelo preenchimento inválido'),
  responsavelPelaVerificacaoId: z
    .string()
    .uuid('ID do responsável pela verificação inválido'),
  subprojectoId: z.string().uuid('ID do subprojeto inválido'),
  consultaEngajamento: z.string().optional(),
  accoesRecomendadas: z.string().optional(),
  resultadoTriagemId: z.string().uuid('ID do resultado da triagem inválido'),
  tenantId: z.string().uuid('ID do tenant inválido'),
  projectId: z.string().uuid('ID do projeto inválido'),
  identificacaoRiscos: z
    .array(
      z.object({
        identificacaoRiscosId: z
          .string()
          .uuid('ID da identificação de riscos inválido'),
      })
    )
    .optional(),
});

export const triagemAmbientalUpdateSchema = triagemAmbientalSchema.partial();
