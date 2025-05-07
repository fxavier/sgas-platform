import { z } from 'zod';

// Schema for validation of MembrosEquipa
export const membroEquipaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cargo: z.string().min(1, 'Cargo é obrigatório'),
  departamento: z.string().min(1, 'Departamento é obrigatório'),
  tenantId: z.string().uuid('ID do tenant inválido - deve ser um UUID válido'),
});

// Schema for partial updates
export const membroEquipaUpdateSchema = membroEquipaSchema.partial();
