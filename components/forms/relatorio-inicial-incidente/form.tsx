'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { RelatorioInicialIncidente } from '@/lib/types/forms';
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

interface RelatorioInicialIncidenteFormProps {
  initialData?: Partial<RelatorioInicialIncidente>;
  onSuccess?: (data: RelatorioInicialIncidente) => void;
  onCancel?: () => void;
  tenantId?: string;
  projectId?: string;
}

export function RelatorioInicialIncidenteForm({
  initialData,
  onSuccess,
  onCancel,
  tenantId: initialTenantId,
  projectId: initialProjectId,
}: RelatorioInicialIncidenteFormProps) {
  // Form data state
  const [formData, setFormData] = useState<Partial<RelatorioInicialIncidente>>({
    ...initialData,
  });

  // Tenant and project selection state
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>(
    initialTenantId
  );
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(initialProjectId);
  const [isLoadingTenants, setIsLoadingTenants] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [tenantOpen, setTenantOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  const { create, update, isLoading, error } =
    useFormApi<RelatorioInicialIncidente>({
      endpoint: 'relatorio-inicial-incidente',
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
          if (initialTenantId) {
            setSelectedTenantId(initialTenantId);
            setFormData((prev) => ({ ...prev, tenantId: initialTenantId }));
          }
        }
      } catch (error) {
        console.error('Error fetching tenants:', error);
      } finally {
        setIsLoadingTenants(false);
      }
    };

    fetchTenants();
  }, [initialTenantId]);

  // Fetch projects when tenant changes
  useEffect(() => {
    if (!selectedTenantId) {
      setProjects([]);
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
        if (initialProjectId) {
          const projectExists = data.some(
            (p: Project) => p.id === initialProjectId
          );
          if (projectExists) {
            setSelectedProjectId(initialProjectId);
            setFormData((prev) => ({ ...prev, projectId: initialProjectId }));
          } else {
            // Clear selected project if it doesn't belong to the selected tenant
            setSelectedProjectId(undefined);
            setFormData((prev) => ({ ...prev, projectId: undefined }));
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [selectedTenantId, initialProjectId]);

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
    setFormData((prev) => ({ ...prev, tenantId }));
    setTenantOpen(false);

    // Clear project when tenant changes
    setSelectedProjectId(undefined);
    setFormData((prev) => ({ ...prev, projectId: undefined }));
  };

  // Handle project selection
  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setFormData((prev) => ({ ...prev, projectId }));
    setProjectOpen(false);
  };

  const handleChange = (field: keyof RelatorioInicialIncidente, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Process form data to ensure all dates are valid Date objects
      const processedData = { ...formData };

      // Ensure required date fields are valid Date objects
      if (!(processedData.dataIncidente instanceof Date)) {
        processedData.dataIncidente = new Date();
      }

      if (!(processedData.horaIncidente instanceof Date)) {
        // Use dataIncidente as the base if available, otherwise use current date
        const baseDate =
          processedData.dataIncidente instanceof Date
            ? new Date(processedData.dataIncidente)
            : new Date();

        // Default to current time if none is set
        processedData.horaIncidente = baseDate;
      }

      if (!(processedData.dataComunicacao instanceof Date)) {
        processedData.dataComunicacao = new Date();
      }

      if (!(processedData.dataCriacao instanceof Date)) {
        processedData.dataCriacao = new Date();
      }

      if (!(processedData.data instanceof Date)) {
        processedData.data = new Date();
      }

      // Handle optional date field
      if (processedData.prazo && !(processedData.prazo instanceof Date)) {
        processedData.prazo = new Date(processedData.prazo);
      }

      // Ensure tenantId and projectId are set
      if (!processedData.tenantId) {
        throw new Error('Tenant ID is required');
      }

      if (!processedData.projectId) {
        throw new Error('Project ID is required');
      }

      // Log the processed form data before submission for debugging
      console.log('Submitting processed form data:', processedData);

      const result = formData.id
        ? await update(formData.id, processedData as RelatorioInicialIncidente)
        : await create(processedData as RelatorioInicialIncidente);

      console.log('Submission result:', result);
      onSuccess?.(result);
    } catch (err) {
      console.error('Form submission failed:', err);
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
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

      <FormSection title='Dados do Incidente'>
        <FormField label='Tipo de Incidente' required>
          <Select
            value={formData.tipoIncidente}
            onValueChange={(value) => handleChange('tipoIncidente', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione o tipo de incidente' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='FATALIDADE'>Fatalidade</SelectItem>
              <SelectItem value='OCORRENCIA_PERIGOSA'>
                Ocorrência Perigosa
              </SelectItem>
              <SelectItem value='INCIDENTE_QUASE_ACIDENTE'>
                Incidente/Quase Acidente
              </SelectItem>
              <SelectItem value='TEMPO_PERDIDO'>Tempo Perdido</SelectItem>
              <SelectItem value='INCIDENTE_AMBIENTAL'>
                Incidente Ambiental
              </SelectItem>
              <SelectItem value='SEGURANCA'>Segurança</SelectItem>
              <SelectItem value='RECLAMACAO_EXTERNA'>
                Reclamação Externa
              </SelectItem>
              <SelectItem value='NOTIFICACAO_DO_REGULADOR_VIOLACAO'>
                Notificação do Regulador/Violação
              </SelectItem>
              <SelectItem value='DERAMAMENTO_LBERACAO_DESCONTROLADA'>
                Derramamento/Liberação Descontrolada
              </SelectItem>
              <SelectItem value='DANOS_PERDAS'>Danos/Perdas</SelectItem>
              <SelectItem value='FLORA_FAUNA'>Flora/Fauna</SelectItem>
              <SelectItem value='AUDITORIA_NAO_CONFORMIDADE'>
                Auditoria Não Conformidade
              </SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormRow>
          <FormField label='Data do Incidente' required>
            <Input
              type='date'
              value={
                formData.dataIncidente instanceof Date
                  ? formData.dataIncidente.toISOString().split('T')[0]
                  : formData.dataIncidente
                  ? new Date(formData.dataIncidente).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) => {
                const dateValue = e.target.value
                  ? new Date(e.target.value)
                  : null;
                handleChange(
                  'dataIncidente',
                  dateValue instanceof Date && !isNaN(dateValue.getTime())
                    ? dateValue
                    : undefined
                );
              }}
            />
          </FormField>

          <FormField label='Hora do Incidente' required>
            <Input
              type='time'
              value={
                formData.horaIncidente instanceof Date
                  ? formData.horaIncidente.toTimeString().slice(0, 5)
                  : formData.horaIncidente
                  ? new Date(formData.horaIncidente).toTimeString().slice(0, 5)
                  : ''
              }
              onChange={(e) => {
                if (!e.target.value) {
                  handleChange('horaIncidente', undefined);
                  return;
                }

                // Get time components
                const [hours, minutes] = e.target.value.split(':').map(Number);

                // Use the current dataIncidente as base or create a new date
                const base =
                  formData.dataIncidente instanceof Date
                    ? new Date(formData.dataIncidente)
                    : formData.dataIncidente
                    ? new Date(formData.dataIncidente)
                    : new Date();

                // Set the time components
                base.setHours(hours, minutes, 0, 0);

                // Update the state
                handleChange('horaIncidente', base);
              }}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Seção' required={false}>
            <Input
              value={formData.seccao || ''}
              onChange={(e) => handleChange('seccao', e.target.value)}
            />
          </FormField>

          <FormField label='Local do Incidente' required>
            <Input
              value={formData.localIncidente || ''}
              onChange={(e) => handleChange('localIncidente', e.target.value)}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Data da Comunicação' required>
            <Input
              type='date'
              value={
                formData.dataComunicacao instanceof Date
                  ? formData.dataComunicacao.toISOString().split('T')[0]
                  : formData.dataComunicacao
                  ? new Date(formData.dataComunicacao)
                      .toISOString()
                      .split('T')[0]
                  : ''
              }
              onChange={(e) => {
                const dateValue = e.target.value
                  ? new Date(e.target.value)
                  : null;
                handleChange(
                  'dataComunicacao',
                  dateValue instanceof Date && !isNaN(dateValue.getTime())
                    ? dateValue
                    : undefined
                );
              }}
            />
          </FormField>

          <FormField label='Supervisor' required>
            <Input
              value={formData.supervisor || ''}
              onChange={(e) => handleChange('supervisor', e.target.value)}
            />
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title='Informações do Envolvido'>
        <FormRow>
          <FormField label='É Empregado?'>
            <Select
              value={formData.empregado}
              onValueChange={(value) => handleChange('empregado', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='SIM'>Sim</SelectItem>
                <SelectItem value='NAO'>Não</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {formData.empregado === 'SIM' && (
            <FormField label='Nome do Funcionário'>
              <Input
                value={formData.nomeFuncionario || ''}
                onChange={(e) =>
                  handleChange('nomeFuncionario', e.target.value)
                }
              />
            </FormField>
          )}
        </FormRow>

        <FormRow>
          <FormField label='É Subcontratante?'>
            <Select
              value={formData.subcontratante}
              onValueChange={(value) => handleChange('subcontratante', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='SIM'>Sim</SelectItem>
                <SelectItem value='NAO'>Não</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {formData.subcontratante === 'SIM' && (
            <FormField label='Nome do Subcontratado'>
              <Input
                value={formData.nomeSubcontratado || ''}
                onChange={(e) =>
                  handleChange('nomeSubcontratado', e.target.value)
                }
              />
            </FormField>
          )}
        </FormRow>
      </FormSection>

      <FormSection title='Detalhes do Incidente'>
        <FormField label='Descrição da Circunstância do Incidente' required>
          <Textarea
            value={formData.descricaoCircunstanciaIncidente || ''}
            onChange={(e) =>
              handleChange('descricaoCircunstanciaIncidente', e.target.value)
            }
          />
        </FormField>

        <FormField
          label='Informações sobre Feridos e Tratamento Feito'
          required
        >
          <Textarea
            value={formData.infoSobreFeriodosETratamentoFeito || ''}
            onChange={(e) =>
              handleChange('infoSobreFeriodosETratamentoFeito', e.target.value)
            }
          />
        </FormField>

        <FormField label='Declaração de Testemunhas'>
          <Textarea
            value={formData.declaracaoDeTestemunhas || ''}
            onChange={(e) =>
              handleChange('declaracaoDeTestemunhas', e.target.value)
            }
          />
        </FormField>

        <FormField label='Conclusão Preliminar'>
          <Textarea
            value={formData.conclusaoPreliminar || ''}
            onChange={(e) =>
              handleChange('conclusaoPreliminar', e.target.value)
            }
          />
        </FormField>
      </FormSection>

      <FormSection title='Recomendações e Avaliação'>
        <FormField label='Recomendações' required>
          <Textarea
            value={formData.recomendacoes || ''}
            onChange={(e) => handleChange('recomendacoes', e.target.value)}
          />
        </FormField>

        <FormRow>
          <FormField label='Inclusão em Matéria de Segurança'>
            <Input
              value={formData.inclusaoEmMateriaSeguranca || ''}
              onChange={(e) =>
                handleChange('inclusaoEmMateriaSeguranca', e.target.value)
              }
            />
          </FormField>

          <FormField label='Prazo'>
            <Input
              type='date'
              value={
                formData.prazo instanceof Date
                  ? formData.prazo.toISOString().split('T')[0]
                  : formData.prazo
                  ? new Date(formData.prazo).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) => {
                const dateValue = e.target.value
                  ? new Date(e.target.value)
                  : null;
                handleChange(
                  'prazo',
                  dateValue instanceof Date && !isNaN(dateValue.getTime())
                    ? dateValue
                    : undefined
                );
              }}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Necessita de Investigação Aprofundada?' required>
            <Select
              value={formData.necessitaDeInvestigacaoAprofundada}
              onValueChange={(value) =>
                handleChange('necessitaDeInvestigacaoAprofundada', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='SIM'>Sim</SelectItem>
                <SelectItem value='NAO'>Não</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label='Incidente Reportável?' required>
            <Select
              value={formData.incidenteReportavel}
              onValueChange={(value) =>
                handleChange('incidenteReportavel', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='SIM'>Sim</SelectItem>
                <SelectItem value='NAO'>Não</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </FormRow>

        <FormField label='Credores Obrigados a Serem Notificados?' required>
          <Select
            value={formData.credoresObrigadosASeremNotificados}
            onValueChange={(value) =>
              handleChange('credoresObrigadosASeremNotificados', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='SIM'>Sim</SelectItem>
              <SelectItem value='NAO'>Não</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </FormSection>

      <FormSection title='Informações do Relatório'>
        <FormRow>
          <FormField label='Autor do Relatório'>
            <Input
              value={formData.autorDoRelatorio || ''}
              onChange={(e) => handleChange('autorDoRelatorio', e.target.value)}
            />
          </FormField>

          <FormField label='Data de Criação' required>
            <Input
              type='date'
              value={
                formData.dataCriacao instanceof Date
                  ? formData.dataCriacao.toISOString().split('T')[0]
                  : formData.dataCriacao
                  ? new Date(formData.dataCriacao).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) => {
                const dateValue = e.target.value
                  ? new Date(e.target.value)
                  : null;
                handleChange(
                  'dataCriacao',
                  dateValue instanceof Date && !isNaN(dateValue.getTime())
                    ? dateValue
                    : undefined
                );
              }}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Nome do Provedor' required>
            <Input
              value={formData.nomeProvedor || ''}
              onChange={(e) => handleChange('nomeProvedor', e.target.value)}
            />
          </FormField>

          <FormField label='Data' required>
            <Input
              type='date'
              value={
                formData.data instanceof Date
                  ? formData.data.toISOString().split('T')[0]
                  : formData.data
                  ? new Date(formData.data).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) => {
                const dateValue = e.target.value
                  ? new Date(e.target.value)
                  : null;
                handleChange(
                  'data',
                  dateValue instanceof Date && !isNaN(dateValue.getTime())
                    ? dateValue
                    : undefined
                );
              }}
            />
          </FormField>
        </FormRow>
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
        submitLabel={formData.id ? 'Atualizar' : 'Criar'}
      />
    </form>
  );
}
