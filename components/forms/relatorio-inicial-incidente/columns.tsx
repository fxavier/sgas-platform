import { ColumnDef } from '@tanstack/react-table';
import { RelatorioInicialIncidente } from '@/lib/types/forms';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, Trash, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ColumnsProps {
  onEdit?: (data: RelatorioInicialIncidente) => void;
  onDelete?: (id: string) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps = {}): ColumnDef<RelatorioInicialIncidente>[] => [
  {
    accessorKey: 'dataIncidente',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data do Incidente
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => formatDate(row.getValue('dataIncidente')),
  },
  {
    accessorKey: 'localIncidente',
    header: 'Local do Incidente',
  },
  {
    accessorKey: 'descricaoCircunstanciaIncidente',
    header: 'Descrição',
    cell: ({ row }) => {
      const descricao = row.getValue(
        'descricaoCircunstanciaIncidente'
      ) as string;
      return descricao.length > 50
        ? `${descricao.substring(0, 50)}...`
        : descricao;
    },
  },
  {
    accessorKey: 'supervisor',
    header: 'Supervisor',
  },
  {
    accessorKey: 'necessitaDeInvestigacaoAprofundada',
    header: 'Necessita Investigação',
    cell: ({ row }) =>
      row.getValue('necessitaDeInvestigacaoAprofundada') === 'SIM'
        ? 'Sim'
        : 'Não',
  },
  {
    accessorKey: 'incidenteReportavel',
    header: 'Incidente Reportável',
    cell: ({ row }) =>
      row.getValue('incidenteReportavel') === 'SIM' ? 'Sim' : 'Não',
  },
  {
    accessorKey: 'dataComunicacao',
    header: 'Data da Comunicação',
    cell: ({ row }) => formatDate(row.getValue('dataComunicacao')),
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className='flex items-center gap-2'>
          {onEdit && (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onEdit(data)}
              className='h-8 w-8'
              title='Editar'
            >
              <Edit className='h-4 w-4' />
              <span className='sr-only'>Editar</span>
            </Button>
          )}
          {onDelete && (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onDelete(data.id!)}
              className='h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100'
              title='Excluir'
            >
              <Trash className='h-4 w-4' />
              <span className='sr-only'>Excluir</span>
            </Button>
          )}
        </div>
      );
    },
  },
];

// For backward compatibility
export const columns = createColumns();
