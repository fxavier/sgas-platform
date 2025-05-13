import { PrismaClient } from '@prisma/client';
import prisma from './db';

// Interface for context options
export interface DbContextOptions {
  tenantId?: string;
  projectId?: string;
}

/**
 * Creates a contextual Prisma client that applies tenant and project filtering
 * This is useful in server actions or API routes where we want to override the
 * context provided by middleware
 */
export function createContextualPrismaClient(options: DbContextOptions) {
  const { tenantId, projectId } = options;

  // If no tenant is provided, return the normal client
  if (!tenantId) {
    return prisma;
  }

  // Create a proxy to intercept calls to the Prisma client
  const contextualPrisma = new Proxy(prisma, {
    get(target, prop) {
      // If the property isn't a model, just return it
      if (
        typeof prop !== 'string' ||
        ![
          'relatorioIncidente',
          'relatorioInicialIncidente',
          'registoObjectivosMetasAmbientaisSociais',
          'transaction',
          'user',
          'project',
          'tenant',
          'incidente',
          'pessoasEnvolvidasNaInvestigacao',
          'accoesCorrectivasPermanentesTomar',
          'fotografiasIncidente',
          'membrosEquipa',
          'tabelaAccoes',
          'matrizTreinamento',
          'areaTreinamento',
          'funcao',
          'caixaFerramentas',
        ].includes(prop)
      ) {
        return (target as any)[prop];
      }

      // Get the original model
      const model = (target as any)[prop];

      // Create a proxy for the model
      return new Proxy(model, {
        get(modelTarget, modelProp) {
          const originalMethod =
            modelTarget[modelProp as keyof typeof modelTarget];

          // If not a query method, return the original
          if (
            typeof modelProp !== 'string' ||
            ![
              'findMany',
              'findFirst',
              'findUnique',
              'count',
              'aggregate',
              'create',
              'update',
              'delete',
            ].includes(modelProp)
          ) {
            return originalMethod;
          }

          // Return a function that wraps the original method
          return function (this: any, args: any) {
            // Don't filter tenant model by tenant
            if (prop === 'tenant') {
              return originalMethod.apply(this, arguments);
            }

            // Clone the arguments
            const newArgs = { ...args };

            // Add tenantId filter for all models except tenant
            if (prop !== 'tenant') {
              if (['create', 'update'].includes(modelProp as string)) {
                // For create/update operations, add to data
                newArgs.data = {
                  ...newArgs.data,
                  tenantId,
                };
              } else {
                // For query operations, add to where
                newArgs.where = {
                  ...newArgs.where,
                  tenantId,
                };
              }
            }

            // Add projectId filter for models that support it
            if (
              projectId &&
              prop !== 'tenant' &&
              prop !== 'project' &&
              prop !== 'user' &&
              prop !== 'transaction' &&
              prop !== 'areaTreinamento' &&
              prop !== 'funcao' &&
              prop !== 'caixaFerramentas'
            ) {
              if (['create', 'update'].includes(modelProp as string)) {
                // For create/update operations, add to data
                newArgs.data = {
                  ...newArgs.data,
                  projectId,
                };
              } else {
                // For query operations, add to where
                newArgs.where = {
                  ...newArgs.where,
                  projectId,
                };
              }
            }

            // Call the original method with the modified arguments
            return originalMethod.call(this, newArgs);
          };
        },
      });
    },
  });

  return contextualPrisma;
}

/**
 * Helper to create a context-aware Prisma client from request parameters
 */
export function getContextFromRequest(req: Request): DbContextOptions {
  const url = new URL(req.url);
  return {
    tenantId: url.searchParams.get('tenantId') || undefined,
    projectId: url.searchParams.get('projectId') || undefined,
  };
}

// Export the default client as well
export default prisma;
