import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type TriagemAmbiental = {
  id: string;
  tenantId: string;
  projectId: string;
  responsavelPeloPreenchimentoId: string;
  responsavelPelaVerificacaoId: string;
  subprojectoId: string;
  consultaEngajamento: string | null;
  accoesRecomendadas: string | null;
  resultadoTriagemId: string;
  createdAt: Date;
  updatedAt: Date;
  responsavelPeloPreenchimento: {
    id: string;
    nome: string;
    funcao: string;
  };
  responsavelPelaVerificacao: {
    id: string;
    nome: string;
    funcao: string;
  };
  subprojecto: {
    id: string;
    nome: string;
  };
  resultadoTriagem: {
    id: string;
    categoriaRisco: string;
    descricao: string;
  };
};

interface CreateColumnsProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: CreateColumnsProps): ColumnDef<TriagemAmbiental>[] => [
  {
    accessorKey: 'subprojecto.nome',
    header: 'Subprojeto',
    enableSorting: true,
  },
  {
    accessorKey: 'responsavelPeloPreenchimento.nome',
    header: 'Responsável pelo Preenchimento',
    enableSorting: true,
  },
  {
    accessorKey: 'responsavelPelaVerificacao.nome',
    header: 'Responsável pela Verificação',
    enableSorting: true,
  },
  {
    accessorKey: 'resultadoTriagem.categoriaRisco',
    header: 'Categoria de Risco',
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: 'Data de Criação',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date;
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const triagem = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Abrir menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(triagem.id)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(triagem.id)}
              className='text-red-600'
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
