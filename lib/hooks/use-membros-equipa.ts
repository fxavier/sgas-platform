import { useState, useEffect } from 'react';
import { MembroEquipa } from '@/lib/types/forms';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { useToast } from '@/hooks/use-toast';

export function useMembrosEquipa() {
  const [data, setData] = useState<MembroEquipa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const fetchData = async () => {
    if (!currentTenantId) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL('/api/membros-equipa', window.location.origin);
      url.searchParams.append('tenantId', currentTenantId);
      if (currentProjectId) {
        url.searchParams.append('projectId', currentProjectId);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Falha ao carregar os membros da equipa');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error('Error fetching membros equipa:', err);
      setError(err.message || 'Erro ao carregar dados');
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os membros da equipa',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const create = async (newData: Omit<MembroEquipa, 'id'>) => {
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

      const response = await fetch('/api/membros-equipa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar membro da equipa');
      }

      const result = await response.json();
      setData((prev) => [...prev, result]);
      toast({
        title: 'Sucesso',
        description: 'Membro da equipa criado com sucesso',
      });
      return result;
    } catch (err: any) {
      console.error('Error creating membro:', err);
      setError(err.message || 'Erro ao criar membro da equipa');
      toast({
        title: 'Erro',
        description: err.message || 'Falha ao criar membro da equipa',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: string, updateData: Partial<MembroEquipa>) => {
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
      const url = new URL(`/api/membros-equipa/${id}`, window.location.origin);
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
        throw new Error(
          errorData.error || 'Falha ao atualizar membro da equipa'
        );
      }

      const result = await response.json();
      setData((prev) => prev.map((item) => (item.id === id ? result : item)));
      toast({
        title: 'Sucesso',
        description: 'Membro da equipa atualizado com sucesso',
      });
      return result;
    } catch (err: any) {
      console.error('Error updating membro:', err);
      setError(err.message || 'Erro ao atualizar membro da equipa');
      toast({
        title: 'Erro',
        description: err.message || 'Falha ao atualizar membro da equipa',
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
      const url = new URL(`/api/membros-equipa/${id}`, window.location.origin);
      url.searchParams.append('tenantId', currentTenantId);

      const response = await fetch(url.toString(), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao remover membro da equipa');
      }

      setData((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Membro da equipa removido com sucesso',
      });
      return true;
    } catch (err: any) {
      console.error('Error removing membro:', err);
      setError(err.message || 'Erro ao remover membro da equipa');
      toast({
        title: 'Erro',
        description: err.message || 'Falha ao remover membro da equipa',
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
