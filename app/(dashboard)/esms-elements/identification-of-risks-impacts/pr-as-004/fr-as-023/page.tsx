'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { TriagemAmbientalForm } from '@/components/forms/triagem-ambiental/form';
import {
  createColumns,
  type TriagemAmbiental,
} from '@/components/forms/triagem-ambiental/columns';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { type TriagemAmbientalFormData } from '@/lib/validations/triagem-ambiental';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function TriagemAmbientalPage() {
  const router = useRouter();
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<TriagemAmbiental[]>([]);
  const [selectedItem, setSelectedItem] = useState<TriagemAmbiental | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentTenantId && currentProjectId) {
      fetchData();
    }
  }, [currentTenantId, currentProjectId]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/api/forms/triagem-ambiental?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: TriagemAmbientalFormData) => {
    try {
      setIsSubmitting(true);
      const url = selectedItem
        ? `/api/forms/triagem-ambiental?id=${selectedItem.id}`
        : '/api/forms/triagem-ambiental';
      const method = selectedItem ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tenantId: currentTenantId,
          projectId: currentProjectId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar formulário');
      }

      await fetchData();
      setShowForm(false);
      setSelectedItem(null);
      toast.success('Formulário salvo com sucesso');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao salvar formulário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (id: string) => {
    const item = data.find((item) => item.id === id);
    if (item) {
      setSelectedItem(item);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) {
      return;
    }

    try {
      const response = await fetch(`/api/forms/triagem-ambiental?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir registro');
      }

      await fetchData();
      toast.success('Registro excluído com sucesso');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Erro ao excluir registro');
    }
  };

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Triagem Ambiental</CardTitle>
              <CardDescription>
                Formulário para triagem ambiental e social
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setSelectedItem(null);
                setShowForm(!showForm);
              }}
              disabled={isSubmitting}
            >
              <Plus className='h-4 w-4 mr-2' />
              {showForm ? 'Cancelar' : 'Novo Registro'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!currentTenantId && (
            <Alert className='mb-4'>
              <Info className='h-4 w-4' />
              <AlertTitle>Aviso</AlertTitle>
              <AlertDescription>
                Selecione um tenant e projeto para continuar.
              </AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className='text-center p-4'>
              <p>Carregando dados...</p>
            </div>
          )}

          {showForm ? (
            <TriagemAmbientalForm
              initialData={
                selectedItem
                  ? {
                      ...selectedItem,
                      consultaEngajamento:
                        selectedItem.consultaEngajamento || undefined,
                      accoesRecomendadas:
                        selectedItem.accoesRecomendadas || undefined,
                    }
                  : undefined
              }
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          ) : (
            !isLoading && (
              <DataTable
                columns={createColumns({
                  onEdit: handleEdit,
                  onDelete: handleDelete,
                })}
                data={data}
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
