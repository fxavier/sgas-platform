import { z } from 'zod';

export const tabelaAccaoSchema = z.object({
  accao: z.string().min(1, { message: 'Ação é obrigatória' }),
  pessoaResponsavel: z
    .string()
    .min(1, { message: 'Pessoa responsável é obrigatória' }),
  prazo: z.coerce.date(),
  dataConclusao: z.coerce.date(),
  tenantId: z.string().uuid({ message: 'Tenant ID inválido' }),
  projectId: z.string().uuid({ message: 'Project ID inválido' }).optional(),
});

export const tabelaAccaoUpdateSchema = tabelaAccaoSchema.partial();

export type TabelaAccaoFormValues = z.infer<typeof tabelaAccaoSchema>;
