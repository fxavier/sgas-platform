import { z } from 'zod';

export const matrizTreinamentoSchema = z.object({
  id: z.string().optional(),
  data: z.coerce.date(),
  funcaoId: z.string().min(1, 'Função é obrigatória'),
  areaTreinamentoId: z.string().min(1, 'Área de Treinamento é obrigatória'),
  caixaFerramentasId: z.string().min(1, 'Caixa de Ferramentas é obrigatória'),
  totais_palestras: z.coerce
    .number()
    .min(0, 'Total de palestras deve ser um número positivo'),
  total_horas: z.coerce
    .number()
    .min(0, 'Total de horas deve ser um número positivo'),
  total_caixa_ferramentas: z.coerce
    .number()
    .min(0, 'Total de caixa de ferramentas deve ser um número positivo'),
  total_pessoas_informadas_caixa_ferramentas: z.coerce
    .number()
    .min(0, 'Total de pessoas informadas deve ser um número positivo'),
  eficacia: z.enum(['Eficaz', 'Nao_Eficaz'], {
    required_error: 'Eficácia é obrigatória',
  }),
  accoes_treinamento_nao_eficaz: z.string().optional(),
  aprovado_por: z.string().min(1, 'Nome do aprovador é obrigatório'),
  tenantId: z.string().min(1, 'Tenant é obrigatório'),
  projectId: z.string().min(1, 'Projeto é obrigatório'),
});

export type MatrizTreinamentoFormData = z.infer<typeof matrizTreinamentoSchema>;
