'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { FormPoliticas } from '@/components/forms/politicas/form-politicas';
import { PoliticasFormValues } from '@/lib/validations/politicas';
import { Politicas } from '@/lib/types/forms';
import { Button } from '@/components/ui/button';

interface EditPoliticaPageProps {
  params: {
    id: string;
  };
}

export default function EditPoliticaPage({ params }: EditPoliticaPageProps) {
  const router = useRouter();
  const [politica, setPolitica] = useState<Politicas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      console.log('Loading politica with ID:', params.id);
      loadPolitica();
    } else {
      console.error('Missing ID parameter');
      toast.error('ID da política não fornecido');
      router.push('/esms-documents/policies');
    }
  }, [params?.id]);

  const loadPolitica = async () => {
    try {
      setLoading(true);

      if (!params.id) {
        throw new Error('ID is required');
      }

      console.log(`Fetching politica with ID: ${params.id}`);
      const response = await fetch(`/api/forms/politicas/${params.id}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to load politica');
      }

      const data = await response.json();
      console.log('Loaded politica data:', data);

      // Convert date strings to Date objects
      if (data.periodoRetencao) {
        data.periodoRetencao = new Date(data.periodoRetencao);
      }

      setPolitica(data);
    } catch (error) {
      console.error('Error loading politica:', error);
      toast.error(
        `Erro ao carregar política: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        }`
      );
      // Navigate back to list on error
      router.push('/esms-documents/policies');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PoliticasFormValues) => {
    try {
      // Create a safe copy of the data for submission
      const submissionData = {
        ...data,
        // Transform Date objects to ISO strings for JSON serialization
        periodoRetencao: data.periodoRetencao
          ? data.periodoRetencao instanceof Date
            ? data.periodoRetencao.toISOString()
            : data.periodoRetencao
          : null,
        id: params.id,
      };

      console.log('Updating politica with data:', {
        ...submissionData,
        ficheiro: submissionData.ficheiro
          ? submissionData.ficheiro.substring(0, 30) + '...'
          : 'Missing',
      });

      const response = await fetch(
        `/api/forms/politicas?tenantId=${data.tenantId}&projectId=${data.projectId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        // Try to parse the error response
        let errorMessage = `Failed to update policy (${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
            if (errorData.details) {
              console.error('Error details:', errorData.details);
            }
          }
        } catch (e) {
          // If we can't parse the error, use the status text
          errorMessage = `${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      toast.success('Política atualizada com sucesso');
      router.push('/esms-documents/policies');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        `Erro ao atualizar política: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        }`
      );
      throw error;
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center p-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-lg'>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!politica) {
    return (
      <div className='p-8 text-center'>
        <div className='mb-4 text-5xl'>🔍</div>
        <h2 className='text-2xl font-bold mb-2'>Política não encontrada</h2>
        <p className='mb-4 text-muted-foreground'>
          Não foi possível encontrar a política solicitada.
        </p>
        <Button onClick={() => router.push('/esms-documents/policies')}>
          Voltar para a lista
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-2xl font-bold'>Editar Política</h1>
        <p className='text-muted-foreground'>Atualize os dados da política</p>
      </div>
      <Separator />
      <FormPoliticas initialData={politica} onSubmit={onSubmit} />
    </div>
  );
}
