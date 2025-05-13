import { useState, useEffect } from 'react';
import { MatrizTreinamento } from '@/lib/types/forms';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { useToast } from '@/hooks/use-toast';

export function useMatrizTreinamento() {
  const [data, setData] = useState<MatrizTreinamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const { toast } = useToast();

  const fetchData = async () => {
    if (!currentTenantId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();

      // Always include tenant ID in requests
      queryParams.append('tenantId', currentTenantId);
      if (currentProjectId) {
        queryParams.append('projectId', currentProjectId);
      }

      const response = await fetch(
        `/api/forms/matriz-treinamento?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      setError(null);
    } catch (err) {
      console.error('Error fetching matriz treinamento data:', err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentTenantId, currentProjectId]);

  const create = async (
    formData: Omit<MatrizTreinamento, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      // Make sure tenant and project IDs are in formData
      if (!formData.tenantId || !formData.projectId) {
        throw new Error('Tenant ID and Project ID are required');
      }

      const response = await fetch('/api/forms/matriz-treinamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create: ${response.status}`);
      }

      const newData = await response.json();
      setData((prev) => [newData, ...prev]);

      toast({
        title: 'Sucesso',
        description: 'Matriz de treinamento criada com sucesso',
      });

      return newData;
    } catch (err) {
      console.error('Error creating matriz treinamento:', err);
      toast({
        title: 'Erro',
        description:
          err instanceof Error
            ? err.message
            : 'Erro ao criar matriz de treinamento',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const update = async (id: string, formData: Partial<MatrizTreinamento>) => {
    try {
      // Add query parameters for tenant and project
      const queryParams = new URLSearchParams();
      if (formData.tenantId) {
        queryParams.append('tenantId', formData.tenantId);
      } else if (currentTenantId) {
        queryParams.append('tenantId', currentTenantId);
      }

      if (formData.projectId) {
        queryParams.append('projectId', formData.projectId);
      } else if (currentProjectId) {
        queryParams.append('projectId', currentProjectId);
      }

      const response = await fetch(
        `/api/forms/matriz-treinamento/${id}?${queryParams.toString()}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update: ${response.status}`);
      }

      const updatedData = await response.json();
      setData((prev) =>
        prev.map((item) => (item.id === id ? updatedData : item))
      );

      toast({
        title: 'Sucesso',
        description: 'Matriz de treinamento atualizada com sucesso',
      });

      return updatedData;
    } catch (err) {
      console.error('Error updating matriz treinamento:', err);
      toast({
        title: 'Erro',
        description:
          err instanceof Error
            ? err.message
            : 'Erro ao atualizar matriz de treinamento',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      // Add query parameters for tenant and project
      const queryParams = new URLSearchParams();
      if (currentTenantId) {
        queryParams.append('tenantId', currentTenantId);
      }
      if (currentProjectId) {
        queryParams.append('projectId', currentProjectId);
      }

      const response = await fetch(
        `/api/forms/matriz-treinamento/${id}?${queryParams.toString()}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }

      setData((prev) => prev.filter((item) => item.id !== id));

      toast({
        title: 'Sucesso',
        description: 'Matriz de treinamento excluída com sucesso',
      });

      return true;
    } catch (err) {
      console.error('Error deleting matriz treinamento:', err);
      toast({
        title: 'Erro',
        description:
          err instanceof Error
            ? err.message
            : 'Erro ao excluir matriz de treinamento',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    data,
    isLoading,
    error,
    create,
    update,
    remove,
    refresh: fetchData,
  };
}
