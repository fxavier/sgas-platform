import { ColumnDef } from '@tanstack/react-table';
import { MatrizTreinamento } from '@/lib/types/forms';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, Trash } from 'lucide-react';

interface ColumnsProps {
  onEdit?: (data: MatrizTreinamento) => void;
  onDelete?: (id: string) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps = {}): ColumnDef<MatrizTreinamento>[] => [
  {
    accessorKey: 'data',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => formatDate(row.getValue('data')),
  },
  {
    accessorKey: 'funcao.name',
    header: 'Função',
    cell: ({ row }) => {
      const funcao = row.original.funcao;
      return funcao?.name || '';
    },
  },
  {
    accessorKey: 'areaTreinamento.name',
    header: 'Área de Treinamento',
    cell: ({ row }) => {
      const areaTreinamento = row.original.areaTreinamento;
      return areaTreinamento?.name || '';
    },
  },
  {
    accessorKey: 'caixaFerramentas.name',
    header: 'Caixa de Ferramentas',
    cell: ({ row }) => {
      const caixaFerramentas = row.original.caixaFerramentas;
      return caixaFerramentas?.name || '';
    },
  },
  {
    accessorKey: 'totais_palestras',
    header: 'Total Palestras',
  },
  {
    accessorKey: 'total_horas',
    header: 'Total Horas',
  },
  {
    accessorKey: 'eficacia',
    header: 'Eficácia',
    cell: ({ row }) => {
      const eficacia = row.getValue('eficacia') as string;
      return eficacia === 'Eficaz' ? 'Eficaz' : 'Não Eficaz';
    },
  },
  {
    accessorKey: 'aprovado_por',
    header: 'Aprovado Por',
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
