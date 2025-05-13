'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MatrizTreinamentoForm } from '@/components/forms/matriz-treinamento/form';
import { DataTable } from '@/components/ui/data-table';
import { createColumns } from '@/components/forms/matriz-treinamento/columns';
import { useRouter } from 'next/navigation';
import { MatrizTreinamento } from '@/lib/types/forms';
import { Button } from '@/components/ui/button';
import { Plus, LoaderCircle } from 'lucide-react';
import { useMatrizTreinamento } from '@/lib/hooks/use-matriz-treinamento';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';

export default function MatrizTreinamentoPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    MatrizTreinamento | undefined
  >(undefined);
  const { data, isLoading, error, create, update, remove, refresh } =
    useMatrizTreinamento();
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Refresh data when tenant or project changes
  useEffect(() => {
    if (currentTenantId) {
      refresh();
    }
  }, [currentTenantId, currentProjectId, refresh]);

  // Handle successful form submission
  const handleSuccess = (newData: MatrizTreinamento) => {
    setShowForm(false);
    setSelectedItem(undefined);
    refresh(); // Refresh the data to ensure we have the latest
  };

  // Handle edit
  const handleEdit = (item: MatrizTreinamento) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      await remove(id);
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
              <CardTitle>FR.AS.005 - Matriz de Treinamento</CardTitle>
              <CardDescription>
                Formulário para registro de matriz de treinamento
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
          {showForm ? (
            <MatrizTreinamentoForm
              initialData={selectedItem}
              onSuccess={handleSuccess}
              onCancel={() => {
                setShowForm(false);
                setSelectedItem(undefined);
              }}
            />
          ) : isLoading ? (
            <div className='flex justify-center items-center py-8'>
              <LoaderCircle className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : error ? (
            <div className='bg-red-50 text-red-600 p-4 rounded-md'>
              Erro ao carregar os dados: {error}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              searchKey='aprovado_por'
              filename='matriz-treinamento'
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
