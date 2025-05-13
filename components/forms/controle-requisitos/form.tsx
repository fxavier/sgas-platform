'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Upload, X, Check, ChevronsUpDown } from 'lucide-react';
import { FormSection } from '../form-section';
import { FormRow } from '../form-row';
import { FormField } from '../form-field';
import { FormActions } from '../form-actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField as FormFieldComponent,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  controleRequisitosSchema,
  type ControleRequisitosFormData,
} from '@/lib/validations/controle-requisitos';
import { uploadFileToS3 } from '@/lib/upload-service';
import { useToast } from '@/hooks/use-toast';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';

interface Tenant {
  id: string;
  name: string;
  slug: string;
}

interface Project {
  id: string;
  name: string;
  tenantId: string;
}

interface FormProps {
  initialData?: any;
  onSubmit: (data: ControleRequisitosFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ControleRequisitosForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: FormProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dataControleOpen, setDataControleOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Tenant and project selection state
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>(
    initialData?.tenantId
  );
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(initialData?.projectId);
  const [isLoadingTenants, setIsLoadingTenants] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [tenantOpen, setTenantOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  const form = useForm<ControleRequisitosFormData>({
    resolver: zodResolver(controleRequisitosSchema),
    defaultValues: {
      id: initialData?.id,
      tenantId: initialData?.tenantId || '',
      projectId: initialData?.projectId || '',
      numnumero: initialData?.numnumero || '',
      tituloDocumento: initialData?.tituloDocumento || '',
      descricao: initialData?.descricao || new Date(),
      revocacoesAlteracoes: initialData?.revocacoesAlteracoes || '',
      requisitoConformidade: initialData?.requisitoConformidade || '',
      dataControle: initialData?.dataControle || new Date(),
      observation: initialData?.observation || '',
      ficheiroDaLei: initialData?.ficheiroDaLei || '',
    },
  });

  // Fetch tenants on component mount
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setIsLoadingTenants(true);
        const response = await fetch('/api/tenants');

        if (!response.ok) {
          throw new Error(`Failed to fetch tenants: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setTenants(data);

          // If initialTenantId is provided, update formData
          if (initialData?.tenantId) {
            setSelectedTenantId(initialData.tenantId);
            form.setValue('tenantId', initialData.tenantId);
          }
        }
      } catch (error) {
        console.error('Error fetching tenants:', error);
      } finally {
        setIsLoadingTenants(false);
      }
    };

    fetchTenants();
  }, [initialData?.tenantId, form]);

  // Fetch projects when tenant changes
  useEffect(() => {
    if (!selectedTenantId) {
      setProjects([]);
      setSelectedProjectId('');
      form.setValue('projectId', '');
      return;
    }

    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const response = await fetch(
          `/api/projects?tenantId=${selectedTenantId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data);

        // If initialProjectId is provided and matches the current tenant, update formData
        if (initialData?.projectId) {
          const projectExists = data.some(
            (p: Project) => p.id === initialData.projectId
          );
          if (projectExists) {
            setSelectedProjectId(initialData.projectId);
            form.setValue('projectId', initialData.projectId);
          } else {
            // Clear selected project if it doesn't belong to the selected tenant
            setSelectedProjectId(undefined);
            form.setValue('projectId', '');
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [selectedTenantId, initialData?.projectId, form]);

  // Find the current tenant and project objects
  const currentTenant = tenants.find(
    (tenant) => tenant.id === selectedTenantId
  );
  const currentProject = projects.find(
    (project) => project.id === selectedProjectId
  );

  // Handle tenant selection
  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    form.setValue('tenantId', tenantId || '');
    setTenantOpen(false);

    // Clear project when tenant changes
    setSelectedProjectId(undefined);
    form.setValue('projectId', '');
  };

  // Handle project selection
  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    form.setValue('projectId', projectId || '');
    setProjectOpen(false);
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const fileUrl = await uploadFileToS3(file);
      form.setValue('ficheiroDaLei', fileUrl);
      toast({
        title: 'Sucesso',
        description: 'Arquivo enviado com sucesso',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar arquivo',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removeFile = () => {
    form.setValue('ficheiroDaLei', '');
  };

  const onFormSubmit = async (data: ControleRequisitosFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar formulário',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className='space-y-8'>
        <FormSection title='Selecione o Tenant e Projeto'>
          <FormRow>
            <FormField label='Tenant' required>
              <Popover open={tenantOpen} onOpenChange={setTenantOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={tenantOpen}
                    className='w-full justify-between'
                    disabled={isLoadingTenants}
                  >
                    {isLoadingTenants ? (
                      <Skeleton className='h-4 w-[160px]' />
                    ) : currentTenant ? (
                      currentTenant.name
                    ) : (
                      'Selecionar Tenant'
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                  <Command>
                    <CommandInput placeholder='Buscar tenant...' />
                    <CommandList>
                      <CommandEmpty>Nenhum tenant encontrado.</CommandEmpty>
                      <CommandGroup>
                        {tenants.map((tenant) => (
                          <CommandItem
                            key={tenant.id}
                            value={tenant.id}
                            onSelect={() => handleTenantSelect(tenant.id)}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedTenantId === tenant.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {tenant.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormField>

            <FormField label='Projeto' required>
              <Popover open={projectOpen} onOpenChange={setProjectOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={projectOpen}
                    className='w-full justify-between'
                    disabled={isLoadingProjects || !selectedTenantId}
                  >
                    {isLoadingProjects ? (
                      <Skeleton className='h-4 w-[160px]' />
                    ) : !selectedTenantId ? (
                      'Selecione um Tenant primeiro'
                    ) : currentProject ? (
                      currentProject.name
                    ) : (
                      'Selecionar Projeto'
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                  <Command>
                    <CommandInput placeholder='Buscar projeto...' />
                    <CommandList>
                      <CommandEmpty>Nenhum projeto encontrado.</CommandEmpty>
                      <CommandGroup>
                        {projects.map((project) => (
                          <CommandItem
                            key={project.id}
                            value={project.id}
                            onSelect={() => handleProjectSelect(project.id)}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedProjectId === project.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {project.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title='Informações Básicas'>
          <FormRow>
            <FormFieldComponent
              control={form.control}
              name='numnumero'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading || isUploading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormFieldComponent
              control={form.control}
              name='tituloDocumento'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Documento</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading || isUploading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormFieldComponent
            control={form.control}
            name='descricao'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                        disabled={isLoading || isUploading}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date);
                            setCalendarOpen(false);
                          }
                        }}
                        disabled={(date) =>
                          date < new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormFieldComponent
            control={form.control}
            name='revocacoesAlteracoes'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Revogações/Alterações</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isLoading || isUploading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormFieldComponent
            control={form.control}
            name='requisitoConformidade'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requisito de Conformidade</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isLoading || isUploading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormFieldComponent
            control={form.control}
            name='dataControle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Controle</FormLabel>
                <FormControl>
                  <Popover
                    open={dataControleOpen}
                    onOpenChange={setDataControleOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                        disabled={isLoading || isUploading}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date);
                            setDataControleOpen(false);
                          }
                        }}
                        disabled={(date) =>
                          date < new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormFieldComponent
            control={form.control}
            name='observation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isLoading || isUploading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormFieldComponent
            control={form.control}
            name='ficheiroDaLei'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ficheiro da Lei</FormLabel>
                <FormControl>
                  <div className='flex flex-col gap-2'>
                    {field.value ? (
                      <div className='flex items-center gap-2'>
                        <a
                          href={field.value}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm text-blue-600 hover:underline'
                        >
                          Ver arquivo
                        </a>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={removeFile}
                          disabled={isLoading || isUploading}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <Input
                          type='file'
                          onChange={handleFileChange}
                          disabled={isLoading || isUploading}
                          className='w-full'
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormActions
          isSubmitting={isLoading || isUploading}
          onCancel={onCancel}
          submitLabel={initialData?.id ? 'Atualizar' : 'Criar'}
        />
      </form>
    </Form>
  );
}
