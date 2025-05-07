import { ColumnDef } from '@tanstack/react-table';
import { RelatorioInicialIncidente } from '@/lib/types/forms';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<RelatorioInicialIncidente>[] = [
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
];
