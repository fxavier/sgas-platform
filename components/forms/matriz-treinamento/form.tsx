'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormField } from '../form-field';
import { FormSection } from '../form-section';
import { FormRow } from '../form-row';
import { FormActions } from '../form-actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormApi } from '@/lib/hooks/use-form-api';
import { useToast } from '@/hooks/use-toast';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { MatrizTreinamento } from '@/lib/types/forms';
import {
  matrizTreinamentoSchema,
  MatrizTreinamentoFormData,
} from '@/lib/validations/matriz-treinamento';

interface FormProps {
  initialData?: MatrizTreinamento;
  onSuccess?: (data: MatrizTreinamento) => void;
  onCancel?: () => void;
}

interface AreaTreinamento {
  id: string;
  name: string;
}

interface Funcao {
  id: string;
  name: string;
}

interface CaixaFerramentas {
  id: string;
  name: string;
}

interface Tenant {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

export function MatrizTreinamentoForm({
  initialData,
  onSuccess,
  onCancel,
}: FormProps) {
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const { create, update, isLoading } = useFormApi<MatrizTreinamentoFormData>({
    endpoint: 'matriz-treinamento',
  });
  const { toast } = useToast();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [areasTreinamento, setAreasTreinamento] = useState<AreaTreinamento[]>(
    []
  );
  const [funcoes, setFuncoes] = useState<Funcao[]>([]);
  const [caixasFerramentas, setCaixasFerramentas] = useState<
    CaixaFerramentas[]
  >([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const form = useForm<MatrizTreinamentoFormData>({
    resolver: zodResolver(matrizTreinamentoSchema),
    defaultValues: {
      id: initialData?.id,
      data: initialData?.data || new Date(),
      funcaoId: initialData?.funcaoId || '',
      areaTreinamentoId: initialData?.areaTreinamentoId || '',
      caixaFerramentasId: initialData?.caixaFerramentasId || '',
      totais_palestras: initialData?.totais_palestras || 0,
      total_horas: initialData?.total_horas || 0,
      total_caixa_ferramentas: initialData?.total_caixa_ferramentas || 0,
      total_pessoas_informadas_caixa_ferramentas:
        initialData?.total_pessoas_informadas_caixa_ferramentas || 0,
      eficacia: initialData?.eficacia || 'Eficaz',
      accoes_treinamento_nao_eficaz:
        initialData?.accoes_treinamento_nao_eficaz || '',
      aprovado_por: initialData?.aprovado_por || '',
      tenantId: initialData?.tenantId || currentTenantId || '',
      projectId: initialData?.projectId || currentProjectId || '',
    },
  });

  // Fetch options on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoadingOptions(true);

        // Get the tenant ID for filtering other options
        const tenantIdToUse = form.watch('tenantId') || currentTenantId;

        // Fetch tenants
        const tenantsResponse = await fetch(`/api/tenants`);
        if (!tenantsResponse.ok) {
          throw new Error('Failed to fetch tenants');
        }
        const tenantsData = await tenantsResponse.json();
        setTenants(tenantsData);

        // If we have a tenant ID, fetch the other options
        if (tenantIdToUse) {
          const [
            projectsResponse,
            areasResponse,
            funcoesResponse,
            caixasResponse,
          ] = await Promise.all([
            fetch(`/api/projects?tenantId=${tenantIdToUse}`),
            fetch(`/api/areas-treinamento?tenantId=${tenantIdToUse}`),
            fetch(`/api/funcoes?tenantId=${tenantIdToUse}`),
            fetch(`/api/caixas-ferramentas?tenantId=${tenantIdToUse}`),
          ]);

          if (projectsResponse.ok) {
            const projectsData = await projectsResponse.json();
            setProjects(projectsData);
          }

          if (areasResponse.ok && funcoesResponse.ok && caixasResponse.ok) {
            const [areasData, funcoesData, caixasData] = await Promise.all([
              areasResponse.json(),
              funcoesResponse.json(),
              caixasResponse.json(),
            ]);

            setAreasTreinamento(areasData);
            setFuncoes(funcoesData);
            setCaixasFerramentas(caixasData);
          }
        } else {
          // Reset all dependent options if no tenant
          setProjects([]);
          setAreasTreinamento([]);
          setFuncoes([]);
          setCaixasFerramentas([]);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar opções',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [currentTenantId, toast, form]);

  // Show or hide accoes_treinamento_nao_eficaz field based on eficacia value
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'eficacia') {
        if (value.eficacia === 'Nao_Eficaz') {
          form.register('accoes_treinamento_nao_eficaz');
        } else {
          form.unregister('accoes_treinamento_nao_eficaz');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Add a handler for tenant change to update project options
  const handleTenantChange = async (tenantId: string) => {
    form.setValue('tenantId', tenantId);
    form.setValue('projectId', ''); // Reset project when tenant changes

    if (!tenantId) {
      setProjects([]);
      return;
    }

    try {
      const response = await fetch(`/api/projects?tenantId=${tenantId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects for tenant');
      }
      const projectsData = await response.json();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar projetos',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: MatrizTreinamentoFormData) => {
    try {
      if (!data.tenantId || !data.projectId) {
        toast({
          title: 'Erro',
          description: 'Tenant e Projeto são obrigatórios',
          variant: 'destructive',
        });
        return;
      }

      let result;
      if (initialData?.id) {
        result = await update(initialData.id, data);
      } else {
        result = await create(data);
      }

      toast({
        title: 'Sucesso',
        description: initialData?.id
          ? 'Matriz de treinamento atualizada com sucesso'
          : 'Matriz de treinamento criada com sucesso',
      });

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar matriz de treinamento',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
      <FormSection title='Seleção de Tenant e Projeto'>
        <FormRow>
          <FormField label='Tenant' required>
            <Select
              disabled={isLoadingOptions}
              value={form.watch('tenantId')}
              onValueChange={handleTenantChange}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione o tenant' />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.tenantId && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.tenantId.message}
              </p>
            )}
          </FormField>

          <FormField label='Projeto' required>
            <Select
              disabled={isLoadingOptions || !form.watch('tenantId')}
              value={form.watch('projectId')}
              onValueChange={(value) => form.setValue('projectId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione o projeto' />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.projectId && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.projectId.message}
              </p>
            )}
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title='Informações Gerais'>
        <FormRow>
          <FormField label='Data' required>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !form.watch('data') && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {form.watch('data') ? (
                    formatDate(form.watch('data'))
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={form.watch('data')}
                  onSelect={(date) => {
                    form.setValue('data', date || new Date());
                    setCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.data && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.data.message}
              </p>
            )}
          </FormField>

          <FormField label='Aprovado Por' required>
            <Input
              {...form.register('aprovado_por')}
              placeholder='Nome do aprovador'
            />
            {form.formState.errors.aprovado_por && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.aprovado_por.message}
              </p>
            )}
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Função' required>
            <Select
              disabled={isLoadingOptions}
              value={form.watch('funcaoId')}
              onValueChange={(value) => form.setValue('funcaoId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione a função' />
              </SelectTrigger>
              <SelectContent>
                {funcoes.map((funcao) => (
                  <SelectItem key={funcao.id} value={funcao.id}>
                    {funcao.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.funcaoId && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.funcaoId.message}
              </p>
            )}
          </FormField>

          <FormField label='Área de Treinamento' required>
            <Select
              disabled={isLoadingOptions}
              value={form.watch('areaTreinamentoId')}
              onValueChange={(value) =>
                form.setValue('areaTreinamentoId', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione a área de treinamento' />
              </SelectTrigger>
              <SelectContent>
                {areasTreinamento.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.areaTreinamentoId && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.areaTreinamentoId.message}
              </p>
            )}
          </FormField>
        </FormRow>

        <FormField label='Caixa de Ferramentas' required>
          <Select
            disabled={isLoadingOptions}
            value={form.watch('caixaFerramentasId')}
            onValueChange={(value) =>
              form.setValue('caixaFerramentasId', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione a caixa de ferramentas' />
            </SelectTrigger>
            <SelectContent>
              {caixasFerramentas.map((caixa) => (
                <SelectItem key={caixa.id} value={caixa.id}>
                  {caixa.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.caixaFerramentasId && (
            <p className='text-sm text-red-500'>
              {form.formState.errors.caixaFerramentasId.message}
            </p>
          )}
        </FormField>
      </FormSection>

      <FormSection title='Detalhes do Treinamento'>
        <FormRow>
          <FormField label='Total de Palestras' required>
            <Input
              type='number'
              {...form.register('totais_palestras', { valueAsNumber: true })}
              placeholder='0'
              min={0}
            />
            {form.formState.errors.totais_palestras && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.totais_palestras.message}
              </p>
            )}
          </FormField>

          <FormField label='Total de Horas' required>
            <Input
              type='number'
              {...form.register('total_horas', { valueAsNumber: true })}
              placeholder='0'
              min={0}
            />
            {form.formState.errors.total_horas && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.total_horas.message}
              </p>
            )}
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Total de Caixa de Ferramentas' required>
            <Input
              type='number'
              {...form.register('total_caixa_ferramentas', {
                valueAsNumber: true,
              })}
              placeholder='0'
              min={0}
            />
            {form.formState.errors.total_caixa_ferramentas && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.total_caixa_ferramentas.message}
              </p>
            )}
          </FormField>

          <FormField label='Total de Pessoas Informadas' required>
            <Input
              type='number'
              {...form.register('total_pessoas_informadas_caixa_ferramentas', {
                valueAsNumber: true,
              })}
              placeholder='0'
              min={0}
            />
            {form.formState.errors
              .total_pessoas_informadas_caixa_ferramentas && (
              <p className='text-sm text-red-500'>
                {
                  form.formState.errors
                    .total_pessoas_informadas_caixa_ferramentas.message
                }
              </p>
            )}
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Eficácia' required>
            <Select
              value={form.watch('eficacia')}
              onValueChange={(value) =>
                form.setValue('eficacia', value as 'Eficaz' | 'Nao_Eficaz')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione a eficácia' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Eficaz'>Eficaz</SelectItem>
                <SelectItem value='Nao_Eficaz'>Não Eficaz</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.eficacia && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.eficacia.message}
              </p>
            )}
          </FormField>
        </FormRow>

        {form.watch('eficacia') === 'Nao_Eficaz' && (
          <FormField label='Ações para Treinamento Não Eficaz' required>
            <Textarea
              {...form.register('accoes_treinamento_nao_eficaz')}
              placeholder='Descreva as ações para treinamento não eficaz'
              className='min-h-[100px]'
            />
            {form.formState.errors.accoes_treinamento_nao_eficaz && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.accoes_treinamento_nao_eficaz.message}
              </p>
            )}
          </FormField>
        )}
      </FormSection>

      <FormActions
        onCancel={onCancel}
        isSubmitting={isLoading}
        submitLabel={initialData?.id ? 'Atualizar' : 'Salvar'}
      />
    </form>
  );
}
