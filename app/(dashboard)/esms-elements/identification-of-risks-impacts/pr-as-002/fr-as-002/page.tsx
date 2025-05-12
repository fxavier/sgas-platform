'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IdentificacaoAvaliacaoRiscosForm } from '@/components/forms/identificacao-avaliacao-riscos/form';
import { identificacaoAvaliacaoRiscosSchema as formSchema } from '@/lib/validations/identificacao-avaliacao-riscos';
import { DataTable } from '@/components/ui/data-table';
import { createColumns } from '@/components/forms/identificacao-avaliacao-riscos/columns';
import { useRouter } from 'next/navigation';
import { IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais } from '@/lib/types/forms';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { useFormApi } from '@/lib/hooks/use-form-api';
import { z } from 'zod';

export default function IdentificacaoAvaliacaoRiscosPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<
    IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<
    IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais | undefined
  >(undefined);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const { remove } =
    useFormApi<IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais>({
      endpoint: 'identificacao-riscos',
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
        `/api/forms/identificacao-riscos?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error('Error fetching identificacao riscos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when tenant or project changes
  useEffect(() => {
    fetchData();
  }, [currentTenantId, currentProjectId]);

  // Handle successful form submission
  const handleSuccess = (formData: z.infer<typeof formSchema>) => {
    // Create a new item with the form data
    const newItem: IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais = {
      ...formData,
      id: formData.id || crypto.randomUUID(),
      faseProjecto: formData.faseProjecto,
      estatuto: formData.estatuto,
      extensao: formData.extensao,
      duduacao: formData.duduacao,
      probabilidade: formData.probabilidade,
      riscosImpactos: { id: formData.riscosImpactosId, descricao: '' },
      factorAmbientalImpactado: {
        id: formData.factorAmbientalImpactadoId,
        descricao: '',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setData((prev) => [newItem, ...prev]);
    setShowForm(false);
    setSelectedItem(undefined);
    // Refresh data to ensure we have the latest records
    fetchData();
  };

  // Handle edit
  const handleEdit = (
    item: IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais
  ) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await remove(id);
        setData((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Error deleting item:', error);
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
              <CardTitle>
                Identificação e Avaliação de Riscos e Impactos
              </CardTitle>
              <CardDescription>
                Formulário para identificação e avaliação de riscos e impactos
                ambientais e sociais
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setSelectedItem(undefined);
                setShowForm(!showForm);
              }}
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
            <IdentificacaoAvaliacaoRiscosForm
              initialData={selectedItem}
              onSubmit={handleSuccess}
              onCancel={() => {
                setShowForm(false);
                setSelectedItem(undefined);
              }}
            />
          ) : (
            !isLoading && (
              <DataTable
                columns={columns}
                data={data}
                searchKey='actiactividade'
                filename='identificacao-avaliacao-riscos'
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
