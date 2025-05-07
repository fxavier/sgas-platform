'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { RelatorioIncidente } from '@/lib/types/forms';
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

interface RelatorioIncidenteFormProps {
  initialData?: Partial<RelatorioIncidente>;
  onSuccess?: (data: RelatorioIncidente) => void;
  onCancel?: () => void;
  tenantId?: string;
  projectId?: string;
}

export function RelatorioIncidenteForm({
  initialData,
  onSuccess,
  onCancel,
  tenantId: initialTenantId,
  projectId: initialProjectId,
}: RelatorioIncidenteFormProps) {
  // Form data state
  const [formData, setFormData] = useState<Partial<RelatorioIncidente>>({
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

  const { create, update, isLoading, error } = useFormApi<RelatorioIncidente>({
    endpoint: 'relatorio-incidente',
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

  const handleChange = (field: keyof RelatorioIncidente, value: any) => {
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

      if (!(processedData.horaIncident instanceof Date)) {
        // Use dataIncidente as the base if available, otherwise use current date
        const baseDate =
          processedData.dataIncidente instanceof Date
            ? new Date(processedData.dataIncidente)
            : new Date();

        // Default to current time if none is set
        processedData.horaIncident = baseDate;
      }

      // Handle optional date field
      if (
        processedData.dataInvestigacaoCompleta &&
        !(processedData.dataInvestigacaoCompleta instanceof Date)
      ) {
        processedData.dataInvestigacaoCompleta = new Date(
          processedData.dataInvestigacaoCompleta
        );
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
        ? await update(formData.id, processedData as RelatorioIncidente)
        : await create(processedData as RelatorioIncidente);

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
                formData.horaIncident instanceof Date
                  ? formData.horaIncident.toTimeString().slice(0, 5)
                  : formData.horaIncident
                  ? new Date(formData.horaIncident).toTimeString().slice(0, 5)
                  : ''
              }
              onChange={(e) => {
                if (!e.target.value) {
                  handleChange('horaIncident', undefined);
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
                handleChange('horaIncident', base);
              }}
            />
          </FormField>
        </FormRow>

        <FormField label='Descrição do Incidente' required>
          <Textarea
            value={formData.descricaoDoIncidente || ''}
            onChange={(e) =>
              handleChange('descricaoDoIncidente', e.target.value)
            }
          />
        </FormField>

        <FormField label='Detalhes da Lesão' required>
          <Textarea
            value={formData.detalhesLesao || ''}
            onChange={(e) => handleChange('detalhesLesao', e.target.value)}
          />
        </FormField>

        <FormField label='Ações Imediatas Tomadas' required>
          <Textarea
            value={formData.accoesImediatasTomadas || ''}
            onChange={(e) =>
              handleChange('accoesImediatasTomadas', e.target.value)
            }
          />
        </FormField>

        <FormRow>
          <FormField label='Tipo de Funcionário' required>
            <Select
              value={formData.tipoFuncionario}
              onValueChange={(value) => handleChange('tipoFuncionario', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='CONTRATADO'>Contratado</SelectItem>
                <SelectItem value='INCIDENTE_DE_TERCEIROS'>
                  Incidente de Terceiros
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label='Categoria da Pessoa Envolvida' required>
            <Input
              value={formData.categoriaPessoaEnvolvida || ''}
              onChange={(e) =>
                handleChange('categoriaPessoaEnvolvida', e.target.value)
              }
            />
          </FormField>
        </FormRow>

        <FormField label='Forma de Atividade' required>
          <Select
            value={formData.formaActividade}
            onValueChange={(value) => handleChange('formaActividade', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='CONTROLADA'>Controlada</SelectItem>
              <SelectItem value='NAO_CONTROLADA'>Não Controlada</SelectItem>
              <SelectItem value='MONITORADA'>Monitorada</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </FormSection>

      <FormSection title='Avaliação de Risco'>
        <FormRow>
          <FormField label='Foi realizada avaliação de risco?' required>
            <Select
              value={formData.foiRealizadaAvaliacaoRisco}
              onValueChange={(value) =>
                handleChange('foiRealizadaAvaliacaoRisco', value)
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

          <FormField label='Existe padrão de controle de risco?' required>
            <Select
              value={formData.existePadraoControleRisco}
              onValueChange={(value) =>
                handleChange('existePadraoControleRisco', value)
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
      </FormSection>

      <FormSection title='Consequências do Incidente'>
        <FormRow>
          <FormField label='Tipo de Consequência (Real)'>
            <Input
              value={formData.tipoConsequenciaIncidenteReal || ''}
              onChange={(e) =>
                handleChange('tipoConsequenciaIncidenteReal', e.target.value)
              }
            />
          </FormField>

          <FormField label='Tipo de Consequência (Potencial)'>
            <Input
              value={formData.tipoConsequenciaIncidentePotencial || ''}
              onChange={(e) =>
                handleChange(
                  'tipoConsequenciaIncidentePotencial',
                  e.target.value
                )
              }
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Efeitos do Incidente (Real)' required>
            <Select
              value={formData.efeitosIncidenteReal}
              onValueChange={(value) =>
                handleChange('efeitosIncidenteReal', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='SAUDE'>Saúde</SelectItem>
                <SelectItem value='SEGURANCA'>Segurança</SelectItem>
                <SelectItem value='AMBIENTE'>Ambiente</SelectItem>
                <SelectItem value='COMUNIDADE'>Comunidade</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label='Classificação da Gravidade (Real)'>
            <Input
              value={formData.classificacaoGravidadeIncidenteReal || ''}
              onChange={(e) =>
                handleChange(
                  'classificacaoGravidadeIncidenteReal',
                  e.target.value
                )
              }
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Efeitos do Incidente (Potencial)'>
            <Select
              value={formData.efeitosIncidentePotencial}
              onValueChange={(value) =>
                handleChange('efeitosIncidentePotencial', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='SAUDE'>Saúde</SelectItem>
                <SelectItem value='SEGURANCA'>Segurança</SelectItem>
                <SelectItem value='AMBIENTE'>Ambiente</SelectItem>
                <SelectItem value='COMUNIDADE'>Comunidade</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label='Classificação da Gravidade (Potencial)'>
            <Input
              value={formData.classificacaoGravidadeIncidentePotencial || ''}
              onChange={(e) =>
                handleChange(
                  'classificacaoGravidadeIncidentePotencial',
                  e.target.value
                )
              }
            />
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title='Análise do Incidente'>
        <FormRow>
          <FormField label='Este foi um incidente sem barreira?' required>
            <Select
              value={formData.esteFoiIncidenteSemBarreira}
              onValueChange={(value) =>
                handleChange('esteFoiIncidenteSemBarreira', value)
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

        <FormRow>
          <FormField label='Foi um incidente repetitivo?' required>
            <Select
              value={formData.foiIncidenteRepetitivo}
              onValueChange={(value) =>
                handleChange('foiIncidenteRepetitivo', value)
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

        <FormRow>
          <FormField
            label='Foi incidente resultante de falha no processo?'
            required
          >
            <Select
              value={formData.foiIncidenteResultanteFalhaProcesso}
              onValueChange={(value) =>
                handleChange('foiIncidenteResultanteFalhaProcesso', value)
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
      </FormSection>

      <FormSection title='Danos e Custos'>
        <FormRow>
          <FormField label='Houve danos materiais?' required>
            <Select
              value={formData.danosMateriais}
              onValueChange={(value) => handleChange('danosMateriais', value)}
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

          {formData.danosMateriais === 'SIM' && (
            <FormField label='Valor dos Danos'>
              <Input
                type='number'
                step='0.01'
                value={formData.valorDanos}
                onChange={(e) =>
                  handleChange('valorDanos', parseFloat(e.target.value))
                }
              />
            </FormField>
          )}
        </FormRow>
      </FormSection>

      <FormSection title='Investigação'>
        <FormRow>
          <FormField label='Status da Investigação'>
            <Input
              value={formData.statusInvestigacao || ''}
              onChange={(e) =>
                handleChange('statusInvestigacao', e.target.value)
              }
            />
          </FormField>

          <FormField label='Data da Investigação Completa'>
            <Input
              type='date'
              value={
                formData.dataInvestigacaoCompleta instanceof Date
                  ? formData.dataInvestigacaoCompleta
                      .toISOString()
                      .split('T')[0]
                  : formData.dataInvestigacaoCompleta
                  ? new Date(formData.dataInvestigacaoCompleta)
                      .toISOString()
                      .split('T')[0]
                  : ''
              }
              onChange={(e) => {
                const dateValue = e.target.value
                  ? new Date(e.target.value)
                  : null;
                handleChange(
                  'dataInvestigacaoCompleta',
                  dateValue instanceof Date && !isNaN(dateValue.getTime())
                    ? dateValue
                    : undefined
                );
              }}
            />
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title='Análise de Causas'>
        <FormField label='Ausência ou Falha nas Defesas?'>
          <Select
            value={formData.ausenciaOuFalhaDefesas}
            onValueChange={(value) =>
              handleChange('ausenciaOuFalhaDefesas', value)
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

        <FormField label='Descrição da Ausência ou Falha nas Defesas'>
          <Textarea
            value={formData.descricaoAusenciaOuFalhaDefesas || ''}
            onChange={(e) =>
              handleChange('descricaoAusenciaOuFalhaDefesas', e.target.value)
            }
          />
        </FormField>

        <FormField label='Ações Individuais ou de Equipe'>
          <Input
            value={formData.accoesIndividuaisOuEquipe || ''}
            onChange={(e) =>
              handleChange('accoesIndividuaisOuEquipe', e.target.value)
            }
          />
        </FormField>

        <FormField label='Descrição das Ações Individuais ou de Equipe'>
          <Textarea
            value={formData.descricaoAccaoIndividualOuEquipe || ''}
            onChange={(e) =>
              handleChange('descricaoAccaoIndividualOuEquipe', e.target.value)
            }
          />
        </FormField>

        <FormField label='Tarefa ou Condições Ambientais do Local de Trabalho'>
          <Input
            value={formData.tarefaOuCondicoesAmbientaisLocalTrabalho || ''}
            onChange={(e) =>
              handleChange(
                'tarefaOuCondicoesAmbientaisLocalTrabalho',
                e.target.value
              )
            }
          />
        </FormField>

        <FormField label='Descrição da Tarefa ou Condições Ambientais do Local de Trabalho'>
          <Textarea
            value={
              formData.descricaoTarefaOuCondicoesAmbientaisLocalTrabalho || ''
            }
            onChange={(e) =>
              handleChange(
                'descricaoTarefaOuCondicoesAmbientaisLocalTrabalho',
                e.target.value
              )
            }
          />
        </FormField>

        <FormField label='Tarefa ou Condições Ambientais (Fatores Humanos)'>
          <Input
            value={formData.tarefaOuCondicoesAmbientaisHumano || ''}
            onChange={(e) =>
              handleChange('tarefaOuCondicoesAmbientaisHumano', e.target.value)
            }
          />
        </FormField>

        <FormField label='Descrição da Tarefa ou Condições Ambientais (Fatores Humanos)'>
          <Textarea
            value={formData.descricaoTarefaOuCondicoesAmbientaisHumano || ''}
            onChange={(e) =>
              handleChange(
                'descricaoTarefaOuCondicoesAmbientaisHumano',
                e.target.value
              )
            }
          />
        </FormField>
      </FormSection>

      <FormSection title='Fatores Organizacionais e Lições Aprendidas'>
        <FormField label='Fatores Organizacionais'>
          <Textarea
            value={formData.factoresOrganizacionais || ''}
            onChange={(e) =>
              handleChange('factoresOrganizacionais', e.target.value)
            }
          />
        </FormField>

        <FormField label='Descrição dos Fatores Organizacionais'>
          <Textarea
            value={formData.descricaoFactoresOrganizacionais || ''}
            onChange={(e) =>
              handleChange('descricaoFactoresOrganizacionais', e.target.value)
            }
          />
        </FormField>

        <FormField label='Causas Subjacentes e Principais Fatores Contribuintes'>
          <Textarea
            value={
              formData.causasSubjacentesEPrincipaisFactoresContribuintes || ''
            }
            onChange={(e) =>
              handleChange(
                'causasSubjacentesEPrincipaisFactoresContribuintes',
                e.target.value
              )
            }
          />
        </FormField>

        <FormField label='Descrição do Incidente Após Investigação'>
          <Textarea
            value={formData.descricaoIncidenteAposInvestigacao || ''}
            onChange={(e) =>
              handleChange('descricaoIncidenteAposInvestigacao', e.target.value)
            }
          />
        </FormField>

        <FormField label='Principais Lições'>
          <Textarea
            value={formData.principaisLicoes || ''}
            onChange={(e) => handleChange('principaisLicoes', e.target.value)}
          />
        </FormField>
      </FormSection>

      <FormSection title='Compartilhamento de Conhecimento'>
        <FormRow>
          <FormField label='Registros de risco ativos atualizados após investigação?'>
            <Select
              value={formData.resgistoRiscoActivosActualizadosAposInvestigacao}
              onValueChange={(value) =>
                handleChange(
                  'resgistoRiscoActivosActualizadosAposInvestigacao',
                  value
                )
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

        <FormRow>
          <FormField label='Você compartilhou o aprendizado deste evento com o restante da organização?'>
            <Select
              value={
                formData.voceCompartilhouAprendizadoDesteEventoComRestanteOrganizacao
              }
              onValueChange={(value) =>
                handleChange(
                  'voceCompartilhouAprendizadoDesteEventoComRestanteOrganizacao',
                  value
                )
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

        <FormField label='Como compartilhou?'>
          <Textarea
            value={formData.comoPartilhou || ''}
            onChange={(e) => handleChange('comoPartilhou', e.target.value)}
          />
        </FormField>
      </FormSection>

      <FormSection title='Responsável'>
        <FormRow>
          <FormField label='Superior Hierárquico Responsável'>
            <Input
              value={formData.superiorHierarquicoResponsavel || ''}
              onChange={(e) =>
                handleChange('superiorHierarquicoResponsavel', e.target.value)
              }
            />
          </FormField>

          <FormField label='Telefone do Superior Hierárquico'>
            <Input
              value={formData.telefoneSuperiorHierarquicoResponsavel || ''}
              onChange={(e) =>
                handleChange(
                  'telefoneSuperiorHierarquicoResponsavel',
                  e.target.value
                )
              }
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Título do Superior Hierárquico'>
            <Input
              value={formData.tituloSuperiorHierarquicoResponsavel || ''}
              onChange={(e) =>
                handleChange(
                  'tituloSuperiorHierarquicoResponsavel',
                  e.target.value
                )
              }
            />
          </FormField>

          <FormField label='Email do Superior Hierárquico'>
            <Input
              type='email'
              value={formData.emailSuperiorHierarquicoResponsavel || ''}
              onChange={(e) =>
                handleChange(
                  'emailSuperiorHierarquicoResponsavel',
                  e.target.value
                )
              }
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
