'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useFormApi } from '@/lib/hooks/use-form-api';
import { FormSection } from '../form-section';
import { FormRow } from '../form-row';
import { FormField } from '../form-field';
import { FormActions } from '../form-actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais } from '@/lib/types/forms';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  identificacaoAvaliacaoRiscosSchema,
  type IdentificacaoAvaliacaoRiscosFormData,
} from '@/lib/validations/identificacao-avaliacao-riscos';
import { AddOptionDialog } from './add-option-dialog';

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

interface RiscoImpacto {
  id: string;
  descricao: string;
}

interface FactorAmbiental {
  id: string;
  descricao: string;
}

interface IdentificacaoAvaliacaoRiscosFormProps {
  initialData?: any;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  tenantId?: string;
  projectId?: string;
}

interface FormProps {
  initialData?: IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais;
  onSubmit: (data: IdentificacaoAvaliacaoRiscosFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const calculateSignificance = (
  intensity: string,
  probability: string
): string => {
  if (intensity === 'BAIXA') {
    if (probability === 'IMPROVAVEL' || probability === 'PROVAVEL') {
      return 'Pouco Significativo';
    } else if (
      probability === 'ALTAMENTE_PROVAVEL' ||
      probability === 'DEFINITIVA'
    ) {
      return 'Significativo';
    }
  } else if (intensity === 'MEDIA') {
    if (probability === 'IMPROVAVEL') {
      return 'Pouco Significativo';
    } else if (
      probability === 'PROVAVEL' ||
      probability === 'ALTAMENTE_PROVAVEL'
    ) {
      return 'Significativo';
    } else if (probability === 'DEFINITIVA') {
      return 'Muito Significativo';
    }
  } else if (intensity === 'ALTA') {
    if (probability === 'IMPROVAVEL' || probability === 'PROVAVEL') {
      return 'Significativo';
    } else if (
      probability === 'ALTAMENTE_PROVAVEL' ||
      probability === 'DEFINITIVA'
    ) {
      return 'Muito Significativo';
    }
  }
  return '';
};

export function IdentificacaoAvaliacaoRiscosForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: FormProps) {
  const [riscosImpactos, setRiscosImpactos] = useState<RiscoImpacto[]>([]);
  const [fatoresAmbientais, setFatoresAmbientais] = useState<FactorAmbiental[]>(
    []
  );
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const form = useForm<IdentificacaoAvaliacaoRiscosFormData>({
    resolver: zodResolver(identificacaoAvaliacaoRiscosSchema),
    defaultValues: {
      id: initialData?.id,
      tenantId: initialData?.tenantId || '',
      projectId: initialData?.projectId || '',
      numeroReferencia: initialData?.numeroReferencia || '',
      processo: initialData?.processo || '',
      actiactividade: initialData?.actiactividade || '',
      riscosImpactosId: initialData?.riscosImpactosId || '',
      realOuPotencial: initialData?.realOuPotencial || '',
      condicao: initialData?.condicao || 'NORMAL',
      factorAmbientalImpactadoId: initialData?.factorAmbientalImpactadoId || '',
      faseProjecto: initialData?.faseProjecto || 'PRE_CONSTRUCAO',
      estatuto: initialData?.estatuto || 'POSITIVO',
      extensao: initialData?.extensao || 'LOCAL',
      duduacao: initialData?.duduacao || 'CURTO_PRAZO',
      intensidade: initialData?.intensidade || 'BAIXA',
      probabilidade: initialData?.probabilidade || 'IMPROVAVEL',
      significancia: initialData?.significancia || '',
      duracaoRisco: initialData?.duracaoRisco || '',
      descricaoMedidas: initialData?.descricaoMedidas || '',
      respresponsavelonsible: initialData?.respresponsavelonsible || '',
      prazo: initialData?.prazo || new Date(),
      referenciaDocumentoControl: initialData?.referenciaDocumentoControl || '',
      legislacaoMocambicanaAplicavel:
        initialData?.legislacaoMocambicanaAplicavel || '',
      observacoes: initialData?.observacoes || '',
    },
  });

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

  const {
    create,
    update,
    isLoading: formApiLoading,
    error,
  } = useFormApi({
    endpoint: 'identificacao-riscos',
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
        console.log('Fetched tenants:', data); // Debug log

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
        console.log('Fetched projects:', data); // Debug log
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

  // Fetch options on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoadingOptions(true);
        const [riscosResponse, fatoresResponse] = await Promise.all([
          fetch('/api/riscos-impactos'),
          fetch('/api/fatores-ambientais'),
        ]);

        if (!riscosResponse.ok || !fatoresResponse.ok) {
          throw new Error('Failed to fetch options');
        }

        const [riscosData, fatoresData] = await Promise.all([
          riscosResponse.json(),
          fatoresResponse.json(),
        ]);

        setRiscosImpactos(riscosData);
        setFatoresAmbientais(fatoresData);
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // Find the current tenant and project objects
  const currentTenant = tenants.find(
    (tenant) => tenant.id === selectedTenantId
  );
  const currentProject = projects.find(
    (project) => project.id === selectedProjectId
  );

  // Handle tenant selection
  const handleTenantSelect = (tenantId: string) => {
    console.log('Selected tenant:', tenantId); // Debug log
    setSelectedTenantId(tenantId);
    form.setValue('tenantId', tenantId || '');
    setTenantOpen(false);

    // Clear project when tenant changes
    setSelectedProjectId(undefined);
    form.setValue('projectId', '');
  };

  // Handle project selection
  const handleProjectSelect = (projectId: string) => {
    console.log('Selected project:', projectId); // Debug log
    setSelectedProjectId(projectId);
    form.setValue('projectId', projectId || '');
    setProjectOpen(false);
  };

  const handleAddNewOption = async (type: string, value: string) => {
    if (!value) return;

    try {
      let endpoint = '';
      let data = {};

      switch (type) {
        case 'risco-impacto':
          endpoint = '/api/riscos-impactos';
          data = { descricao: value };
          break;
        case 'fator-ambiental':
          endpoint = '/api/fatores-ambientais';
          data = { descricao: value };
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add new option');
      }

      const newOption = await response.json();

      // Update the form with the new option
      if (type === 'risco-impacto' && newOption.id) {
        form.setValue('riscosImpactosId', newOption.id);
        setRiscosImpactos((prev) => [...prev, newOption]);
      } else if (type === 'fator-ambiental' && newOption.id) {
        form.setValue('factorAmbientalImpactadoId', newOption.id);
        setFatoresAmbientais((prev) => [...prev, newOption]);
      }
    } catch (error) {
      console.error('Error adding new option:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = form.getValues();

      if (!selectedTenantId || !selectedProjectId) {
        throw new Error('Tenant and Project are required');
      }

      const dataToSubmit = {
        ...formData,
        prazo: new Date(formData.prazo),
        tenantId: selectedTenantId,
        projectId: selectedProjectId,
      };

      if (initialData?.id) {
        await update(initialData.id, dataToSubmit);
      } else {
        await create(dataToSubmit);
      }

      if (onSubmit) {
        onSubmit(dataToSubmit);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Add useEffect to watch intensity and probability
  useEffect(() => {
    const intensity = form.watch('intensidade');
    const probability = form.watch('probabilidade');
    if (intensity && probability) {
      const significance = calculateSignificance(intensity, probability);
      form.setValue('significancia', significance);
    }
  }, [form.watch('intensidade'), form.watch('probabilidade')]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                    ) : (
                      currentTenant?.name
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
                    ) : (
                      currentProject?.name
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
            <FormField label='Número de Referência'>
              <Input {...form.register('numeroReferencia')} />
            </FormField>

            <FormField label='Processo'>
              <Input {...form.register('processo')} />
            </FormField>
          </FormRow>

          <FormField label='Atividade' required>
            <Input {...form.register('actiactividade')} />
          </FormField>
        </FormSection>

        <FormSection title='Riscos e Impactos'>
          <FormRow>
            <FormField label='Risco/Impacto' required>
              <div className='flex gap-2'>
                <Select
                  value={form.watch('riscosImpactosId') || ''}
                  onValueChange={(value) =>
                    form.setValue('riscosImpactosId', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione um risco/impacto' />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingOptions ? (
                      <SelectItem value='loading' disabled>
                        Carregando...
                      </SelectItem>
                    ) : (
                      riscosImpactos.map((risco) => (
                        <SelectItem key={risco.id} value={risco.id}>
                          {risco.descricao}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <AddOptionDialog
                  type='Risco/Impacto'
                  onAdd={(value) => handleAddNewOption('risco-impacto', value)}
                />
              </div>
            </FormField>

            <FormField label='Fator Ambiental Impactado' required>
              <div className='flex gap-2'>
                <Select
                  value={form.watch('factorAmbientalImpactadoId') || ''}
                  onValueChange={(value) =>
                    form.setValue('factorAmbientalImpactadoId', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione um fator ambiental' />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingOptions ? (
                      <SelectItem value='loading' disabled>
                        Carregando...
                      </SelectItem>
                    ) : (
                      fatoresAmbientais.map((factor) => (
                        <SelectItem key={factor.id} value={factor.id}>
                          {factor.descricao}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <AddOptionDialog
                  type='Fator Ambiental'
                  onAdd={(value) =>
                    handleAddNewOption('fator-ambiental', value)
                  }
                />
              </div>
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label='Real ou Potencial'>
              <Input {...form.register('realOuPotencial')} />
            </FormField>

            <FormField label='Condição' required>
              <Select
                value={form.watch('condicao')}
                onValueChange={(value) =>
                  form.setValue(
                    'condicao',
                    value as 'NORMAL' | 'ANORMAL' | 'EMERGENCIA'
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione a condição' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='NORMAL'>Normal</SelectItem>
                  <SelectItem value='ANORMAL'>Anormal</SelectItem>
                  <SelectItem value='EMERGENCIA'>Emergência</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title='Avaliação'>
          <FormRow>
            <FormField label='Fase do Projeto' required>
              <Select
                value={form.watch('faseProjecto')}
                onValueChange={(value) =>
                  form.setValue(
                    'faseProjecto',
                    value as
                      | 'PRE_CONSTRUCAO'
                      | 'CONSTRUCAO'
                      | 'OPERACAO'
                      | 'DESATIVACAO'
                      | 'ENCERRAMENTO'
                      | 'RESTAURACAO'
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione a fase' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='PRE_CONSTRUCAO'>Pre Construção</SelectItem>
                  <SelectItem value='CONSTRUCAO'>Construção</SelectItem>
                  <SelectItem value='OPERACAO'>Operação</SelectItem>
                  <SelectItem value='DESATIVACAO'>Desativação</SelectItem>
                  <SelectItem value='ENCERRAMENTO'>Encerramento</SelectItem>
                  <SelectItem value='RESTAURACAO'>Restauração</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label='Estatuto' required>
              <Select
                value={form.watch('estatuto')}
                onValueChange={(value) =>
                  form.setValue('estatuto', value as 'POSITIVO' | 'NEGATIVO')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione o estatuto' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='POSITIVO'>Positivo</SelectItem>
                  <SelectItem value='NEGATIVO'>Negativo</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label='Extensão' required>
              <Select
                value={form.watch('extensao')}
                onValueChange={(value) =>
                  form.setValue(
                    'extensao',
                    value as 'LOCAL' | 'REGIONAL' | 'NACIONAL' | 'GLOBAL'
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione a extensão' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='LOCAL'>Local</SelectItem>
                  <SelectItem value='REGIONAL'>Regional</SelectItem>
                  <SelectItem value='NACIONAL'>Nacional</SelectItem>
                  <SelectItem value='GLOBAL'>Global</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label='Duração' required>
              <Select
                value={form.watch('duduacao')}
                onValueChange={(value) =>
                  form.setValue(
                    'duduacao',
                    value as 'CURTO_PRAZO' | 'MEDIO_PRAZO' | 'LONGO_PRAZO'
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione a duração' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='CURTO_PRAZO'>Curto Prazo</SelectItem>
                  <SelectItem value='MEDIO_PRAZO'>Médio Prazo</SelectItem>
                  <SelectItem value='LONGO_PRAZO'>Longo Prazo</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label='Intensidade' required>
              <Select
                value={form.watch('intensidade')}
                onValueChange={(value) =>
                  form.setValue(
                    'intensidade',
                    value as 'BAIXA' | 'MEDIA' | 'ALTA'
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione a intensidade' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='BAIXA'>Baixa</SelectItem>
                  <SelectItem value='MEDIA'>Média</SelectItem>
                  <SelectItem value='ALTA'>Alta</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label='Probabilidade' required>
              <Select
                value={form.watch('probabilidade')}
                onValueChange={(value) =>
                  form.setValue(
                    'probabilidade',
                    value as
                      | 'IMPROVAVEL'
                      | 'PROVAVEL'
                      | 'ALTAMENTE_PROVAVEL'
                      | 'DEFINITIVA'
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione a probabilidade' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='IMPROVAVEL'>Improvável</SelectItem>
                  <SelectItem value='PROVAVEL'>Provável</SelectItem>
                  <SelectItem value='ALTAMENTE_PROVAVEL'>
                    Altamente Provável
                  </SelectItem>
                  <SelectItem value='DEFINITIVA'>Definitiva</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title='Medidas e Controles'>
          <FormField label='Significância' required>
            <Input
              {...form.register('significancia')}
              disabled
              placeholder='Calculado automaticamente'
            />
          </FormField>

          <FormField label='Duração do Risco'>
            <Input {...form.register('duracaoRisco')} />
          </FormField>

          <FormField label='Descrição das Medidas' required>
            <Textarea {...form.register('descricaoMedidas')} />
          </FormField>

          <FormField label='Responsável'>
            <Input {...form.register('respresponsavelonsible')} />
          </FormField>

          <FormField label='Prazo' required>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !form.watch('prazo') && 'text-muted-foreground'
                  )}
                >
                  {form.watch('prazo') ? (
                    format(form.watch('prazo'), 'PPP')
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={form.watch('prazo')}
                  onSelect={(date) => {
                    if (date) {
                      form.setValue('prazo', date);
                    }
                  }}
                  disabled={(date) =>
                    date < new Date() || date < new Date('1900-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormField>

          <FormField label='Referência do Documento de Controle'>
            <Input {...form.register('referenciaDocumentoControl')} />
          </FormField>

          <FormField label='Legislação Moçambicana Aplicável'>
            <Input {...form.register('legislacaoMocambicanaAplicavel')} />
          </FormField>

          <FormField label='Observações' required>
            <Textarea {...form.register('observacoes')} />
          </FormField>
        </FormSection>

        {error && (
          <div className='bg-red-50 p-4 rounded-md border border-red-200 text-red-800 mb-4'>
            <p className='font-semibold'>Erro ao enviar o formulário:</p>
            <p>{error}</p>
          </div>
        )}

        <FormActions
          isSubmitting={isLoading}
          onCancel={onCancel}
          submitLabel={initialData?.id ? 'Atualizar' : 'Criar'}
        />
      </form>
    </Form>
  );
}
