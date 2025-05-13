import { z } from 'zod';

export const controleRequisitosSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, 'Tenant é obrigatório'),
  projectId: z.string().min(1, 'Projeto é obrigatório'),
  numnumero: z.string().min(1, 'Número é obrigatório'),
  tituloDocumento: z.string().min(1, 'Título do documento é obrigatório'),
  descricao: z.coerce.date(),
  revocacoesAlteracoes: z.string().optional(),
  requisitoConformidade: z.string().optional(),
  dataControle: z.coerce.date(),
  observation: z.string().optional(),
  ficheiroDaLei: z.string().optional(),
});

export type ControleRequisitosFormData = z.infer<
  typeof controleRequisitosSchema
>;

export const controleRequisitosUpdateSchema =
  controleRequisitosSchema.partial();
