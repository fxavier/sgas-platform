'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { FormPoliticas } from '@/components/forms/politicas/form-politicas';
import { PoliticasFormValues } from '@/lib/validations/politicas';

export default function NewPoliticaPage() {
  const router = useRouter();

  const onSubmit = async (data: PoliticasFormValues) => {
    try {
      console.log('Submitting new politica with data:', {
        ...data,
        ficheiro: data.ficheiro
          ? `${data.ficheiro.substring(0, 30)}...`
          : 'Missing',
      });

      // Ensure ficheiro is a valid URL
      if (!data.ficheiro) {
        toast.error('Ficheiro é obrigatório');
        throw new Error('Ficheiro é obrigatório');
      }

      // Create a safe copy of the data for submission
      const submissionData = {
        ...data,
        // Transform Date objects to ISO strings for JSON serialization
        periodoRetencao: data.periodoRetencao
          ? data.periodoRetencao instanceof Date
            ? data.periodoRetencao.toISOString()
            : data.periodoRetencao
          : null,
      };

      console.log('Sending to API:', {
        ...submissionData,
        ficheiro: submissionData.ficheiro.substring(0, 30) + '...',
      });

      const response = await fetch(
        `/api/forms/politicas?tenantId=${data.tenantId}&projectId=${data.projectId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        // Try to parse the error response
        let errorMessage = `Failed to create policy (${response.status})`;
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

      const result = await response.json();
      console.log('Created politica:', result);

      toast.success('Política criada com sucesso');
      router.push('/esms-documents/policies');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        `Erro ao criar política: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        }`
      );
      throw error;
    }
  };

  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-2xl font-bold'>Nova Política</h1>
        <p className='text-muted-foreground'>
          Preencha o formulário para criar uma nova política
        </p>
      </div>
      <Separator />
      <FormPoliticas onSubmit={onSubmit} />
    </div>
  );
}
