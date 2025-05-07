'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RelatorioIncidenteForm } from '@/components/forms/relatorio-incidente/form';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/forms/relatorio-incidente/columns';
import { useRouter } from 'next/navigation';
import { RelatorioIncidente } from '@/lib/types/forms';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';

// Mock data - replace with actual data from your API
const mockData: RelatorioIncidente[] = [
  // Add mock data here
];

export default function RelatorioIncidentePage() {
  const router = useRouter();
  const params = useParams();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState(mockData);

  // Extract tenantId and projectId from URL params or use defaults
  const tenantId =
    typeof params?.tenant === 'string' ? params.tenant : 'default-tenant';
  const projectId =
    typeof params?.projectId === 'string'
      ? params.projectId
      : 'default-project';

  const handleSuccess = (newData: RelatorioIncidente) => {
    setData((prev) => [...prev, newData]);
    setShowForm(false);
  };

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>FR.AS.009 - Relatório de Incidente</CardTitle>
              <CardDescription>
                Formulário para registro e documentação de incidentes
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className='h-4 w-4 mr-2' />
              {showForm ? 'Cancelar' : 'Novo Registro'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <RelatorioIncidenteForm
              onSuccess={handleSuccess}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <DataTable
              columns={columns}
              data={data}
              searchKey='descricaoDoIncidente'
              filename='relatorio-incidente'
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
