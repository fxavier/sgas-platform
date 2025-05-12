import { z } from 'zod';

export const controleRequisitosSchema = z.object({
  numnumero: z.string().min(1, 'Número é obrigatório'),
  tituloDocumento: z.string().min(1, 'Título do documento é obrigatório'),
  descricao: z.coerce.date(),
  revocacoesAlteracoes: z.string().optional(),
  requisitoConformidade: z.string().optional(),
  dataControle: z.coerce.date(),
  observation: z.string().optional(),
  ficheiroDaLei: z.string().optional(),
  tenantId: z.string().uuid('ID do tenant inválido'),
  projectId: z.string().uuid('ID do projeto inválido'),
});

export const controleRequisitosUpdateSchema =
  controleRequisitosSchema.partial();
