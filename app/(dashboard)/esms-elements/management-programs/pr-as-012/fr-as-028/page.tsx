'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RelatorioInicialIncidenteForm } from '@/components/forms/relatorio-inicial-incidente/form';
import { DataTable } from '@/components/ui/data-table';
import { createColumns } from '@/components/forms/relatorio-inicial-incidente/columns';
import { useRouter } from 'next/navigation';
import { RelatorioInicialIncidente } from '@/lib/types/forms';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { useFormApi } from '@/lib/hooks/use-form-api';
import { useToast } from '@/hooks/use-toast';

export default function RelatorioInicialIncidentePage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<RelatorioInicialIncidente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    RelatorioInicialIncidente | undefined
  >(undefined);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const { toast } = useToast();
  const { remove } = useFormApi<RelatorioInicialIncidente>({
    endpoint: 'relatorio-inicial-incidente',
  });

  // Fetch data on component mount and when tenant/project changes
  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (!currentTenantId) return;

      const queryParams = new URLSearchParams();
      queryParams.append('tenantId', currentTenantId);
      if (currentProjectId) queryParams.append('projectId', currentProjectId);

      const response = await fetch(
        `/api/forms/relatorio-inicial-incidente?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error('Error fetching relatorios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when tenant or project changes
  useEffect(() => {
    fetchData();
  }, [currentTenantId, currentProjectId]);

  // Handle successful form submission
  const handleSuccess = (newData: RelatorioInicialIncidente) => {
    setData((prev) => [newData, ...prev]);
    setShowForm(false);
    setSelectedItem(undefined);
    // Refresh data to ensure we have the latest records
    fetchData();
  };

  // Handle edit
  const handleEdit = (item: RelatorioInicialIncidente) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        setIsSubmitting(true);
        await remove(id);
        setData((prev) => prev.filter((item) => item.id !== id));
        toast({
          title: 'Sucesso',
          description: 'Registro excluído com sucesso!',
          variant: 'default',
        });
      } catch (error) {
        console.error('Error deleting item:', error);
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao excluir o registro.',
          variant: 'destructive',
        });
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
              <CardTitle>FR.AS.028 - Relatório Inicial de Incidente</CardTitle>
              <CardDescription>
                Formulário para registro inicial de incidentes
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
            <RelatorioInicialIncidenteForm
              tenantId={currentTenantId || undefined}
              projectId={currentProjectId || undefined}
              onSuccess={handleSuccess}
              onCancel={() => {
                setShowForm(false);
                setSelectedItem(undefined);
              }}
              initialData={
                selectedItem || {
                  tipoIncidente: 'INCIDENTE_QUASE_ACIDENTE',
                  dataIncidente: new Date(),
                  horaIncidente: new Date(),
                  dataComunicacao: new Date(),
                  dataCriacao: new Date(),
                  data: new Date(),
                }
              }
            />
          ) : (
            !isLoading && (
              <DataTable
                columns={columns}
                data={data}
                searchKey='localIncidente'
                filename='relatorio-inicial-incidente'
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
