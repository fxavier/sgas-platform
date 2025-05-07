"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RegistoObjetivos } from "@/lib/types/forms";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<RegistoObjetivos>[] = [
  {
    accessorKey: "numeroRefOAndM",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ref. O&M
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "objectivo",
    header: "Objetivo",
  },
  {
    accessorKey: "publicoAlvo",
    header: "Público Alvo",
  },
  {
    accessorKey: "dataInicio",
    header: "Data Início",
    cell: ({ row }) => formatDate(row.getValue("dataInicio")),
  },
  {
    accessorKey: "dataConclusaoPrevista",
    header: "Conclusão Prevista",
    cell: ({ row }) => formatDate(row.getValue("dataConclusaoPrevista")),
  },
  {
    accessorKey: "oAndMAlcancadoFechado",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("oAndMAlcancadoFechado") as "SIM" | "NAO";
      return (
        <div className={`font-medium ${status === "SIM" ? "text-green-600" : "text-yellow-600"}`}>
          {status === "SIM" ? "Concluído" : "Em Andamento"}
        </div>
      );
    },
  },
];