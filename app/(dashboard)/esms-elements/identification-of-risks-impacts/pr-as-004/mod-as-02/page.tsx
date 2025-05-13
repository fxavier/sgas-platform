'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { DataTable } from '@/components/ui/data-table';
import { FichaInformacaoAmbientalForm } from '@/components/forms/ficha-informacao-ambiental/form';
import { createColumns } from '@/components/forms/ficha-informacao-ambiental/columns';
import { FichaInformacaoAmbientalPreliminar } from '@/lib/types/forms';

export default function FichaInformacaoAmbientalPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<FichaInformacaoAmbientalPreliminar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    FichaInformacaoAmbientalPreliminar | undefined
  >(undefined);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Fetch data on component mount and when tenant/project changes
  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (!currentTenantId) return;

      const queryParams = new URLSearchParams();
      queryParams.append('tenantId', currentTenantId);
      if (currentProjectId) queryParams.append('projectId', currentProjectId);

      const response = await fetch(
        `/api/forms/ficha-informacao-ambiental?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error('Error fetching ficha informacao ambiental:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when tenant or project changes
  useEffect(() => {
    fetchData();
  }, [currentTenantId, currentProjectId]);

  // Handle successful form submission
  const handleSuccess = async () => {
    try {
      setIsSubmitting(true);
      await fetchData();
      toast.success('Registro salvo com sucesso!');
      setShowForm(false);
      setSelectedItem(undefined);
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Ocorreu um erro ao salvar o registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (item: FichaInformacaoAmbientalPreliminar) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        setIsSubmitting(true);
        const response = await fetch(
          `/api/forms/ficha-informacao-ambiental?id=${id}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete record');
        }

        setData((prev) => prev.filter((item) => item.id !== id));
        toast.success('Registro excluído com sucesso!');
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Ocorreu um erro ao excluir o registro.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Create columns with actions
  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Ficha de Informação Ambiental Preliminar</CardTitle>
              <CardDescription>
                Formulário para registro de informações ambientais preliminares
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setSelectedItem(undefined);
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
            <FichaInformacaoAmbientalForm
              initialData={selectedItem}
              onSubmit={handleSuccess}
              onCancel={() => {
                setShowForm(false);
                setSelectedItem(undefined);
              }}
              isLoading={isSubmitting}
            />
          ) : (
            !isLoading && (
              <DataTable
                columns={columns}
                data={data}
                searchKey='nomeActividade'
                filename='ficha-informacao-ambiental'
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
