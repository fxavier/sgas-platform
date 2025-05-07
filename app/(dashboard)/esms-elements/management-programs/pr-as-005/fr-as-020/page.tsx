'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RegistoObjetivosForm } from '@/components/forms/registo-objetivos/form';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/forms/registo-objetivos/columns';
import { useRouter } from 'next/navigation';
import { RegistoObjetivos } from '@/lib/types/forms';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRegistoObjetivos } from '@/lib/hooks/use-registo-objetivos';
import { LoaderCircle } from 'lucide-react';

export default function RegistoObjetivosPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, error, create } = useRegistoObjetivos();

  const handleSuccess = (newData: RegistoObjetivos) => {
    setShowForm(false);
  };

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>
                FR.AS.020 - Registo de Objetivos e Metas Ambientais e Sociais
              </CardTitle>
              <CardDescription>
                Formulário para registro de objetivos e metas ambientais e
                sociais
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
            <RegistoObjetivosForm
              onSuccess={handleSuccess}
              onCancel={() => setShowForm(false)}
            />
          ) : isLoading ? (
            <div className='flex justify-center items-center py-8'>
              <LoaderCircle className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : error ? (
            <div className='bg-red-50 text-red-600 p-4 rounded-md'>
              Erro ao carregar os dados: {error}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              searchKey='objectivo'
              filename='registo-objetivos'
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
