'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ControleRequisitosForm } from '@/components/forms/controle-requisitos/form';
import type { ControleRequisitosFormData } from '@/lib/validations/controle-requisitos';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  createColumns,
  type ControleRequisitos,
} from '@/components/forms/controle-requisitos/columns';

export default function ControleRequisitosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<ControleRequisitos[]>([]);
  const [selectedItem, setSelectedItem] = useState<
    ControleRequisitos | undefined
  >();
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (!currentTenantId || !currentProjectId) return;

      const queryParams = new URLSearchParams();
      queryParams.append('tenantId', currentTenantId);
      queryParams.append('projectId', currentProjectId);

      const response = await fetch(
        `/api/forms/controle-requisitos?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentTenantId, currentProjectId]);

  const handleSubmit = async (formData: ControleRequisitosFormData) => {
    if (!currentTenantId || !currentProjectId) {
      toast({
        title: 'Erro',
        description: 'Selecione um tenant e projeto para continuar.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/forms/controle-requisitos', {
        method: 'POST',
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
        throw new Error('Failed to submit form');
      }

      toast({
        title: 'Sucesso',
        description: 'Formulário enviado com sucesso',
      });

      setShowForm(false);
      setSelectedItem(undefined);
      fetchData();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar formulário',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: ControleRequisitos) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/forms/controle-requisitos?id=${id}&tenantId=${currentTenantId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      toast({
        title: 'Sucesso',
        description: 'Registro excluído com sucesso',
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir registro',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className='container mx-auto py-10'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Controle de Requisitos Legais</CardTitle>
              <CardDescription>
                Formulário para controle de requisitos legais
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
            <ControleRequisitosForm
              initialData={selectedItem}
              onSubmit={handleSubmit}
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
                searchKey='tituloDocumento'
                filename='controle-requisitos'
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
