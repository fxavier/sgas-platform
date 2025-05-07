import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';
import { TENANT_ID_HEADER, PROJECT_ID_HEADER } from '@/middleware';

// Define the extended client with tenant and project context
declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize client
const prismaClientSingleton = () => {
  const client = new PrismaClient();

  // Add middleware for tenant and project filtering
  client.$use(async (params, next) => {
    const multiTenantModels = [
      'relatorioIncidente',
      'relatorioInicialIncidente',
      'registoObjectivosMetasAmbientaisSociais',
      'transaction',
      'user',
      'project',
    ];

    // Check if we're doing a find operation on a multi-tenant model
    if (
      params.action === 'findUnique' ||
      params.action === 'findFirst' ||
      params.action === 'findMany'
    ) {
      // Only apply tenant filtering if the model supports it
      if (params.model && multiTenantModels.includes(params.model as string)) {
        // Get the tenant ID from the params or from request context
        const tenantId = getTenantIdFromContext();

        if (tenantId) {
          // Add tenantId to where clause if it exists
          if (params.args.where) {
            if (
              (params.model as string) !== 'project' &&
              (params.model as string) !== 'user'
            ) {
              // For models that have both tenant and project
              params.args.where.tenantId = tenantId;

              // Add projectId if it exists and model supports it
              const projectId = getProjectIdFromContext();
              if (
                projectId &&
                (params.model as string) !== 'user' &&
                (params.model as string) !== 'transaction'
              ) {
                params.args.where.projectId = projectId;
              }
            } else {
              // For tenant-only models like Project
              params.args.where.tenantId = tenantId;
            }
          } else {
            // If no where clause, create one
            if (
              (params.model as string) !== 'project' &&
              (params.model as string) !== 'user'
            ) {
              params.args.where = { tenantId };

              // Add projectId if it exists and model supports it
              const projectId = getProjectIdFromContext();
              if (
                projectId &&
                (params.model as string) !== 'user' &&
                (params.model as string) !== 'transaction'
              ) {
                params.args.where.projectId = projectId;
              }
            } else {
              params.args.where = { tenantId };
            }
          }
        }
      }
    }

    return next(params);
  });

  return client;
};

// Helper function to get tenant ID from request context
function getTenantIdFromContext(): string | null {
  try {
    // In server components, we can access headers directly
    const headersList = headers();
    const tenantId = headersList.get(TENANT_ID_HEADER);

    if (tenantId) {
      return tenantId;
    }

    // For non-server environments (e.g. direct DB calls outside of API routes)
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currentTenantId');
    }

    return null;
  } catch (error) {
    // Headers might not be available in some contexts
    // This is fine - just return null
    return null;
  }
}

// Helper function to get project ID from request context
function getProjectIdFromContext(): string | null {
  try {
    // In server components, we can access headers directly
    const headersList = headers();
    const projectId = headersList.get(PROJECT_ID_HEADER);

    if (projectId) {
      return projectId;
    }

    // For non-server environments
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currentProjectId');
    }

    return null;
  } catch (error) {
    // Headers might not be available in some contexts
    return null;
  }
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Use existing instance or create a new one
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

// Add prisma to global object in development to prevent too many instances in hot reloading
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
