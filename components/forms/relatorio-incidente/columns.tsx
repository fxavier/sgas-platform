import { ColumnDef } from '@tanstack/react-table';
import { RelatorioIncidente } from '@/lib/types/forms';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<RelatorioIncidente>[] = [
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
    accessorKey: 'descricaoDoIncidente',
    header: 'Descrição',
  },
  {
    accessorKey: 'tipoFuncionario',
    header: 'Tipo de Funcionário',
  },
  {
    accessorKey: 'foiRealizadaAvaliacaoRisco',
    header: 'Avaliação de Risco',
    cell: ({ row }) =>
      row.getValue('foiRealizadaAvaliacaoRisco') === 'SIM' ? 'Sim' : 'Não',
  },
  {
    accessorKey: 'statusInvestigacao',
    header: 'Status da Investigação',
  },
  {
    accessorKey: 'dataInvestigacaoCompleta',
    header: 'Data da Investigação',
    cell: ({ row }) => {
      const date = row.getValue('dataInvestigacaoCompleta') as string | Date;
      return date ? formatDate(date) : '-';
    },
  },
];
