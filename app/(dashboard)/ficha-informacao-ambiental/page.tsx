'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FichaInformacaoAmbientalPreliminar } from '@/lib/types/forms';
import { useFichaInformacaoAmbiental } from '@/lib/hooks/use-ficha-informacao-ambiental';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, LoaderCircle } from 'lucide-react';
import { createColumns } from '@/components/forms/ficha-informacao-ambiental/columns';
import { FichaInformacaoAmbientalForm } from '@/components/forms/ficha-informacao-ambiental/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function FichaInformacaoAmbientalPage() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<FichaInformacaoAmbientalPreliminar | null>(null);

  const {
    data,
    isLoading,
    error,
    remove: deleteItem,
  } = useFichaInformacaoAmbiental();

  const handleCreate = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: FichaInformacaoAmbientalPreliminar) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await deleteItem(id);
        router.refresh();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    router.refresh();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Ficha de Informação Ambiental</h1>
        <Button onClick={handleCreate}>
          <Plus className='mr-2 h-4 w-4' />
          Nova Ficha
        </Button>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-8'>
          <LoaderCircle className='h-8 w-8 animate-spin text-primary' />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          searchKey='nomeActividade'
          filename='ficha-informacao-ambiental'
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Editar Ficha' : 'Nova Ficha'}
            </DialogTitle>
          </DialogHeader>
          <FichaInformacaoAmbientalForm
            initialData={selectedItem || undefined}
            onSubmit={async (data) => {
              await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
              handleFormSuccess();
            }}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
