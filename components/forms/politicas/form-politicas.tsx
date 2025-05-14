'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import {
  politicasSchema,
  PoliticasFormValues,
} from '@/lib/validations/politicas';
import { uploadFileToS3 } from '@/lib/upload-service';
import { Politicas } from '@/lib/types/forms';
import { FormSection } from '../form-section';
import { FormRow } from '../form-row';
import { FormActions } from '../form-actions';
import { ProjectTenantSelectors } from '../project-tenant-selectors';

type FormPoliticasProps = {
  initialData?: Politicas;
  onSubmit: (data: PoliticasFormValues) => Promise<void>;
};

export function FormPoliticas({ initialData, onSubmit }: FormPoliticasProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Get query parameters for tenant and project
  const defaultTenantId = searchParams.get('tenantId') || initialData?.tenantId;
  const defaultProjectId =
    searchParams.get('projectId') || initialData?.projectId;

  const form = useForm<PoliticasFormValues>({
    resolver: zodResolver(politicasSchema),
    defaultValues: initialData || {
      codigo: '',
      nomeDocumento: '',
      ficheiro: '',
      estadoDocumento: 'REVISAO',
      periodoRetencao: null,
      tenantId: defaultTenantId || '',
      projectId: defaultProjectId || '',
    },
  });

  // Set form values if initialData changes
  useEffect(() => {
    if (initialData) {
      // Reset the form with initial data
      Object.entries(initialData).forEach(([key, value]) => {
        // Skip the id field
        if (key !== 'id') {
          form.setValue(key as any, value);
        }
      });
    }
  }, [initialData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // If it's a new document (no existing file), set a temporary value to pass validation
      if (!form.getValues('ficheiro')) {
        form.setValue('ficheiro', 'temp-file-selected', {
          shouldValidate: true,
        });
      }
    }
  };

  // Modified file upload approach to handle errors gracefully
  const uploadFile = async (file: File): Promise<string> => {
    try {
      // Create a FormData object for the file upload
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name, file.type, file.size);

      // Upload the file using the /api/upload/local endpoint
      const uploadResponse = await fetch('/api/upload/local', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', uploadResponse.status);

      if (!uploadResponse.ok) {
        let errorMessage = `Upload failed with status ${uploadResponse.status}`;
        try {
          const errorData = await uploadResponse.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse the error as JSON, just use the status code message
        }
        throw new Error(errorMessage);
      }

      const uploadResult = await uploadResponse.json();
      console.log('File uploaded successfully:', uploadResult);

      return uploadResult.url;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (data: PoliticasFormValues) => {
    try {
      setUploading(true);

      // If there's a new file to upload
      if (file) {
        try {
          // Use our standalone upload function
          const fileUrl = await uploadFile(file);
          // Make sure we set the actual URL, not a placeholder
          data.ficheiro = fileUrl;
          console.log('Set ficheiro to uploaded file URL:', fileUrl);
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          toast.error(
            `Erro ao fazer upload do arquivo: ${
              uploadError instanceof Error
                ? uploadError.message
                : 'Erro desconhecido'
            }`
          );
          setUploading(false);
          return; // Stop submission if file upload fails
        }
      } else if (data.ficheiro === 'temp-file-selected') {
        // This is just a validation placeholder and not a real URL
        toast.error('Erro: Nenhum arquivo foi carregado');
        setUploading(false);
        return;
      } else if (!data.ficheiro && !initialData?.ficheiro) {
        // No file was provided for a new record
        toast.error('Ficheiro é obrigatório');
        setUploading(false);
        return;
      }

      // Prepare data for API
      const submissionData = {
        ...data,
        // Make sure ficheiro is the actual value, not a display placeholder
        ficheiro:
          data.ficheiro === 'temp-file-selected'
            ? ''
            : data.ficheiro || initialData?.ficheiro || '',
      };

      console.log('Submitting data with actual values:', submissionData);
      console.log('File URL:', submissionData.ficheiro);

      // Call original onSubmit function
      await onSubmit(submissionData);

      toast.success('Política salva com sucesso');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        `Erro ao salvar política: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <Card>
          <CardContent className='pt-6'>
            <FormSection title='Informações da Política'>
              {/* Tenant and Project selectors */}
              <FormRow>
                <ProjectTenantSelectors
                  form={form}
                  defaultTenantId={defaultTenantId || undefined}
                  defaultProjectId={defaultProjectId || undefined}
                  disabled={false} // Explicitly set disabled to false
                />
              </FormRow>

              <FormRow>
                <FormField
                  control={form.control}
                  name='codigo'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder='PR-XX-YYY' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='nomeDocumento'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Nome do Documento</FormLabel>
                      <FormControl>
                        <Input placeholder='Nome do documento' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormRow>

              <FormRow>
                <FormField
                  control={form.control}
                  name='estadoDocumento'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Estado do Documento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecionar estado' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='REVISAO'>Em Revisão</SelectItem>
                          <SelectItem value='EM_USO'>Em Uso</SelectItem>
                          <SelectItem value='ABSOLETO'>Obsoleto</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='periodoRetencao'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Período de Retenção</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', { locale: pt })
                              ) : (
                                <span>Selecionar data</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Data até quando o documento deve ser mantido
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormRow>

              <FormRow>
                <FormField
                  control={form.control}
                  name='ficheiro'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Ficheiro</FormLabel>
                      <FormControl>
                        <div className='flex flex-col gap-2'>
                          <Input
                            type='file'
                            onChange={handleFileChange}
                            accept='.pdf,.docx,.doc'
                          />
                          {field.value &&
                            field.value !== 'temp-file-selected' &&
                            !file && (
                              <div className='text-sm text-muted-foreground'>
                                Ficheiro atual:{' '}
                                <a
                                  href={field.value}
                                  target='_blank'
                                  className='text-primary underline'
                                >
                                  Ver ficheiro
                                </a>
                              </div>
                            )}
                          {file && (
                            <div className='text-sm text-green-600'>
                              Novo ficheiro selecionado: {file.name}
                            </div>
                          )}
                          <Input type='hidden' {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormRow>
            </FormSection>
          </CardContent>
        </Card>

        <FormActions isSubmitting={uploading} onCancel={() => router.back()} />
      </form>
    </Form>
  );
}
