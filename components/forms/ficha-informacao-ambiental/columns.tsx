import { ColumnDef } from '@tanstack/react-table';
import { FichaInformacaoAmbientalPreliminar } from '@/lib/types/forms';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';

interface ActionsProps {
  onEdit: (item: FichaInformacaoAmbientalPreliminar) => void;
  onDelete: (id: string) => Promise<void>;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ActionsProps): ColumnDef<FichaInformacaoAmbientalPreliminar>[] => [
  {
    accessorKey: 'nomeActividade',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nome da Atividade
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'tipoActividade',
    header: 'Tipo de Atividade',
  },
  {
    accessorKey: 'endereco',
    header: 'Endereço',
  },
  {
    accessorKey: 'provinciaActividade',
    header: 'Província',
  },
  {
    accessorKey: 'meioInsercao',
    header: 'Meio de Inserção',
  },
  {
    accessorKey: 'enquadramentoOrcamentoTerritorial',
    header: 'Enquadramento Orçamental',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data de Criação
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => formatDate(row.getValue('createdAt')),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => onEdit(item)}>
            <Pencil className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='icon' onClick={() => onDelete(item.id)}>
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      );
    },
  },
];
