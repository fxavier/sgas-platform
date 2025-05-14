import { z } from 'zod';

export const politicasSchema = z.object({
  codigo: z.string().min(1, { message: 'Código é obrigatório' }),
  nomeDocumento: z
    .string()
    .min(1, { message: 'Nome do documento é obrigatório' }),
  ficheiro: z.string().min(1, { message: 'Ficheiro é obrigatório' }),
  estadoDocumento: z.enum(['REVISAO', 'EM_USO', 'ABSOLETO']),
  // Accept both Date objects and ISO strings, transforming strings to Date objects
  periodoRetencao: z
    .union([z.date(), z.string().transform((str) => new Date(str))])
    .nullable(),
  tenantId: z.string().min(1, { message: 'Entidade é obrigatória' }),
  projectId: z.string().min(1, { message: 'Projeto é obrigatório' }),
});

export type PoliticasFormValues = z.infer<typeof politicasSchema>;
