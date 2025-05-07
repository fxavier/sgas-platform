import { z } from 'zod';

// Schema for MembrosEquipa relationship
const membroEquipaSchema = z.object({
  membroEquipaId: z.string().uuid(),
  assignedAt: z.date().optional(),
});

// Schema for TabelaAccoes relationship
const tabelaAccaoSchema = z.object({
  tabelaAccaoId: z.string().uuid(),
  assignedAt: z.date().optional(),
});

// Schema for validation of RegistoObjectivosMetasAmbientaisSociais
export const registoObjetivosSchema = z.object({
  numeroRefOAndM: z.string().min(1, 'Número de referência O&M é obrigatório'),
  aspetoRefNumero: z.string().min(1, 'Aspeto Ref. Número é obrigatório'),
  centroCustos: z.string().min(1, 'Centro de Custos é obrigatório'),
  objectivo: z.string().min(1, 'Objetivo é obrigatório'),
  publicoAlvo: z.string().min(1, 'Público Alvo é obrigatório'),
  orcamentoRecursos: z.string().min(1, 'Orçamento e Recursos é obrigatório'),
  refDocumentoComprovativo: z
    .string()
    .min(1, 'Ref. Documento Comprovativo é obrigatório'),
  dataInicio: z.coerce.date(),
  dataConclusaoPrevista: z.coerce.date(),
  dataConclusaoReal: z.coerce.date(),
  pgasAprovadoPor: z.string().min(1, 'PGAS Aprovado Por é obrigatório'),
  dataAprovacao: z.coerce.date(),
  observacoes: z.string().default(''),
  oAndMAlcancadoFechado: z.enum(['SIM', 'NAO']),
  assinaturaDirectorGeral: z
    .string()
    .min(1, 'Assinatura do Director Geral é obrigatória'),
  data: z.coerce.date(),
  projectId: z
    .string()
    .uuid('ID do projeto inválido - deve ser um UUID válido'),
  tenantId: z
    .string()
    .uuid('ID do inquilino inválido - deve ser um UUID válido'),
  membrosDaEquipa: z.array(membroEquipaSchema).optional(),
  tabelasAccoes: z.array(tabelaAccaoSchema).optional(),
});

// Schema for partial updates
export const registoObjetivosUpdateSchema = registoObjetivosSchema.partial();
