'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileEdit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { Politicas } from '@/lib/types/forms';
import { AlertModal } from '@/components/ui/alert-modal';

export default function PoliticasPage() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('tenantId');
  const projectId = searchParams.get('projectId');

  const [politicas, setPoliticas] = useState<Politicas[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    loadPoliticas();
  }, [tenantId, projectId]);

  const loadPoliticas = async () => {
    try {
      setLoading(true);

      // Create query string with any available filters
      const queryParams = new URLSearchParams();
      if (tenantId) queryParams.append('tenantId', tenantId);
      if (projectId) queryParams.append('projectId', projectId);

      const response = await fetch(
        `/api/forms/politicas?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to load politicas');
      }

      const data = await response.json();
      setPoliticas(data);
    } catch (error) {
      console.error('Error loading politicas:', error);
      toast.error('Erro ao carregar políticas');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!deleteId) return;

    try {
      const politica = politicas.find((p) => p.id === deleteId);
      if (!politica) return;

      const response = await fetch(
        `/api/forms/politicas/${deleteId}?tenantId=${politica.tenantId}&projectId=${politica.projectId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete politica');
      }

      toast.success('Política excluída com sucesso');
      loadPoliticas();
    } catch (error) {
      console.error('Error deleting politica:', error);
      toast.error('Erro ao excluir política');
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const translateEstadoDocumento = (estado: string) => {
    switch (estado) {
      case 'REVISAO':
        return 'Em Revisão';
      case 'EM_USO':
        return 'Em Uso';
      case 'ABSOLETO':
        return 'Obsoleto';
      default:
        return estado;
    }
  };

  // Function to format date values safely
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: pt });
    } catch (e) {
      return '-';
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Políticas</h1>
        <Button asChild>
          <Link href='/esms-documents/policies/new'>
            <Plus className='mr-2 h-4 w-4' /> Nova Política
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Políticas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='py-8 text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
              <p>Carregando...</p>
            </div>
          ) : politicas.length === 0 ? (
            <div className='py-8 text-center'>Nenhuma política encontrada</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome do Documento</TableHead>
                  <TableHead>Data Criação</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {politicas.map((politica) => (
                  <TableRow key={politica.id}>
                    <TableCell>{politica.codigo}</TableCell>
                    <TableCell>{politica.nomeDocumento}</TableCell>
                    <TableCell>{formatDate(politica.dataCriacao)}</TableCell>
                    <TableCell>
                      {translateEstadoDocumento(politica.estadoDocumento)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Abrir menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/esms-documents/policies/edit/${politica.id}`}
                              className='flex items-center'
                            >
                              <FileEdit className='mr-2 h-4 w-4' /> Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDeleteId(politica.id!);
                              setDeleteOpen(true);
                            }}
                            className='text-destructive flex items-center'
                          >
                            <Trash2 className='mr-2 h-4 w-4' /> Excluir
                          </DropdownMenuItem>
                          {politica.ficheiro && (
                            <DropdownMenuItem asChild>
                              <a
                                href={politica.ficheiro}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center'
                              >
                                <FileEdit className='mr-2 h-4 w-4' /> Visualizar
                              </a>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        loading={false}
      />
    </div>
  );
}
