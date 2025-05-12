'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/forms/membros-equipa/columns';
import { Button } from '@/components/ui/button';
import { useMembrosEquipa } from '@/lib/hooks/use-membros-equipa';
import { MembroEquipa } from '@/lib/types/forms';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { FormField } from '@/components/forms/form-field';
import { FormActions } from '@/components/forms/form-actions';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MembrosEquipaPage() {
  // Mock tenant data - replace with actual auth
  const tenantId = 'test-tenant-id';

  const {
    data: membrosEquipa,
    isLoading,
    error,
    fetchData: fetchMembrosEquipa,
    create: createMembroEquipa,
    update: updateMembroEquipa,
    remove: deleteMembroEquipa,
  } = useMembrosEquipa();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMembro, setSelectedMembro] = useState<MembroEquipa | null>(
    null
  );
  const [formData, setFormData] = useState<Omit<MembroEquipa, 'id'>>({
    nome: '',
    cargo: '',
    departamento: '',
  });

  // Load membros equipa on mount
  useEffect(() => {
    if (tenantId) {
      fetchMembrosEquipa();
    }
  }, [tenantId]);

  const handleChange = (
    field: keyof Omit<MembroEquipa, 'id'>,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMembroEquipa(formData);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating membro:', error);
    }
  };

  const handleEdit = (membro: MembroEquipa) => {
    setSelectedMembro(membro);
    setFormData({
      nome: membro.nome,
      cargo: membro.cargo,
      departamento: membro.departamento,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMembro) return;

    try {
      await updateMembroEquipa(selectedMembro.id, formData);
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error updating membro:', error);
    }
  };

  const handleDelete = (membro: MembroEquipa) => {
    setSelectedMembro(membro);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMembro) return;

    try {
      await deleteMembroEquipa(selectedMembro.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting membro:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cargo: '',
      departamento: '',
    });
    setSelectedMembro(null);
  };

  // Add action column to columns
  const columnsWithActions = [
    ...columns,
    {
      id: 'actions',
      cell: ({ row }: { row: any }) => {
        const membro = row.original;
        return (
          <div className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleEdit(membro)}
            >
              <Pencil className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleDelete(membro)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Membros da Equipa</CardTitle>
              <CardDescription>
                Gerencie membros da equipa para objetivos e metas ambientais e
                sociais
              </CardDescription>
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Novo Membro
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Criar Novo Membro</DialogTitle>
                  <DialogDescription>
                    Adicione um novo membro da equipa ao sistema.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate}>
                  <div className='space-y-4 py-4'>
                    <FormField label='Nome' required>
                      <Input
                        value={formData.nome}
                        onChange={(e) => handleChange('nome', e.target.value)}
                        required
                      />
                    </FormField>
                    <FormField label='Cargo' required>
                      <Input
                        value={formData.cargo}
                        onChange={(e) => handleChange('cargo', e.target.value)}
                        required
                      />
                    </FormField>
                    <FormField label='Departamento' required>
                      <Input
                        value={formData.departamento}
                        onChange={(e) =>
                          handleChange('departamento', e.target.value)
                        }
                        required
                      />
                    </FormField>
                  </div>
                  <FormActions
                    onCancel={() => setIsCreateDialogOpen(false)}
                    submitLabel='Criar'
                  />
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className='mb-4'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className='text-center py-4'>Carregando...</div>
          ) : (
            <DataTable
              columns={columnsWithActions}
              data={membrosEquipa}
              searchKey='nome'
              filename='membros-equipa'
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Editar Membro</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className='space-y-4 py-4'>
              <FormField label='Nome' required>
                <Input
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  required
                />
              </FormField>
              <FormField label='Cargo' required>
                <Input
                  value={formData.cargo}
                  onChange={(e) => handleChange('cargo', e.target.value)}
                  required
                />
              </FormField>
              <FormField label='Departamento' required>
                <Input
                  value={formData.departamento}
                  onChange={(e) => handleChange('departamento', e.target.value)}
                  required
                />
              </FormField>
            </div>
            <FormActions
              onCancel={() => setIsEditDialogOpen(false)}
              submitLabel='Atualizar'
            />
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <p>
              Tem certeza de que deseja excluir este membro?
              {selectedMembro && (
                <span className='font-semibold block mt-2'>
                  "{selectedMembro.nome}"
                </span>
              )}
            </p>
            <p className='text-sm text-muted-foreground mt-2'>
              Esta ação não pode ser desfeita e removerá este membro de
              quaisquer objetivos e metas associados.
            </p>
          </div>
          <div className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant='destructive' onClick={confirmDelete}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
