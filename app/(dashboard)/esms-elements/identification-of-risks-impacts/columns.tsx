import { ColumnDef } from '@tanstack/react-table';
import { IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais } from '@/lib/types/forms';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';

interface ActionsProps {
  onEdit: (
    item: IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais
  ) => void;
  onDelete: (id: string) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ActionsProps): ColumnDef<IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais>[] => [
  {
    accessorKey: 'numeroReferencia',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Número de Referência
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'processo',
    header: 'Processo',
  },
  {
    accessorKey: 'actiactividade',
    header: 'Atividade',
  },
  {
    accessorKey: 'riscosImpactos.descricao',
    header: 'Risco/Impacto',
  },
  {
    accessorKey: 'factorAmbientalImpactado.descricao',
    header: 'Fator Ambiental Impactado',
  },
  {
    accessorKey: 'faseProjecto',
    header: 'Fase do Projeto',
  },
  {
    accessorKey: 'estatuto',
    header: 'Estatuto',
  },
  {
    accessorKey: 'extensao',
    header: 'Extensão',
  },
  {
    accessorKey: 'intensidade',
    header: 'Intensidade',
  },
  {
    accessorKey: 'probabilidade',
    header: 'Probabilidade',
  },
  {
    accessorKey: 'prazo',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Prazo
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => formatDate(row.getValue('prazo')),
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
