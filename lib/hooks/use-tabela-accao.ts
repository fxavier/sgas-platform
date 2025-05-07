import { useState, useEffect } from 'react';
import { TabelaAccao } from '@/lib/types/forms';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { useToast } from '@/hooks/use-toast';

export function useTabelaAccao() {
  const [data, setData] = useState<TabelaAccao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const fetchData = async () => {
    if (!currentTenantId) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL('/api/tabela-accao', window.location.origin);
      url.searchParams.append('tenantId', currentTenantId);
      if (currentProjectId) {
        url.searchParams.append('projectId', currentProjectId);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Falha ao carregar as ações');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error('Error fetching tabela accao:', err);
      setError(err.message || 'Erro ao carregar dados');
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as ações',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const create = async (newData: Omit<TabelaAccao, 'id'>) => {
    if (!currentTenantId) {
      toast({
        title: 'Erro',
        description: 'Não foi possível identificar o tenant',
        variant: 'destructive',
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...newData,
        tenantId: currentTenantId,
        projectId: currentProjectId,
      };

      const response = await fetch('/api/tabela-accao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar ação');
      }

      const result = await response.json();
      setData((prev) => [...prev, result]);
      toast({
        title: 'Sucesso',
        description: 'Ação criada com sucesso',
      });
      return result;
    } catch (err: any) {
      console.error('Error creating tabela accao:', err);
      setError(err.message || 'Erro ao criar ação');
      toast({
        title: 'Erro',
        description: err.message || 'Falha ao criar ação',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: string, updateData: Partial<TabelaAccao>) => {
    if (!currentTenantId) {
      toast({
        title: 'Erro',
        description: 'Não foi possível identificar o tenant',
        variant: 'destructive',
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL(`/api/tabela-accao/${id}`, window.location.origin);
      url.searchParams.append('tenantId', currentTenantId);

      const dataToSend = {
        ...updateData,
        tenantId: currentTenantId,
        projectId: currentProjectId,
      };

      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar ação');
      }

      const result = await response.json();
      setData((prev) => prev.map((item) => (item.id === id ? result : item)));
      toast({
        title: 'Sucesso',
        description: 'Ação atualizada com sucesso',
      });
      return result;
    } catch (err: any) {
      console.error('Error updating tabela accao:', err);
      setError(err.message || 'Erro ao atualizar ação');
      toast({
        title: 'Erro',
        description: err.message || 'Falha ao atualizar ação',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!currentTenantId) {
      toast({
        title: 'Erro',
        description: 'Não foi possível identificar o tenant',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL(`/api/tabela-accao/${id}`, window.location.origin);
      url.searchParams.append('tenantId', currentTenantId);

      const response = await fetch(url.toString(), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao remover ação');
      }

      setData((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Ação removida com sucesso',
      });
      return true;
    } catch (err: any) {
      console.error('Error removing tabela accao:', err);
      setError(err.message || 'Erro ao remover ação');
      toast({
        title: 'Erro',
        description: err.message || 'Falha ao remover ação',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentTenantId) {
      fetchData();
    }
  }, [currentTenantId, currentProjectId]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    create,
    update,
    remove,
  };
}
