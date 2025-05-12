'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { FichaInformacaoAmbientalPreliminar } from '@/lib/types/forms';
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

interface FichaInformacaoAmbientalFormProps {
  initialData?: Partial<FichaInformacaoAmbientalPreliminar>;
  onSuccess?: (data: FichaInformacaoAmbientalPreliminar) => void;
  onCancel?: () => void;
  tenantId?: string;
  projectId?: string;
}

export function FichaInformacaoAmbientalForm({
  initialData,
  onSuccess,
  onCancel,
  tenantId: initialTenantId,
  projectId: initialProjectId,
}: FichaInformacaoAmbientalFormProps) {
  // Form data state
  const [formData, setFormData] = useState<
    Partial<FichaInformacaoAmbientalPreliminar>
  >({
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
    useFormApi<FichaInformacaoAmbientalPreliminar>({
      endpoint: 'ficha-informacao-ambiental',
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
            setFormData(
              (prev: Partial<FichaInformacaoAmbientalPreliminar>) => ({
                ...prev,
                tenantId: initialTenantId,
              })
            );
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
            setFormData(
              (prev: Partial<FichaInformacaoAmbientalPreliminar>) => ({
                ...prev,
                projectId: initialProjectId,
              })
            );
          } else {
            // Clear selected project if it doesn't belong to the selected tenant
            setSelectedProjectId(undefined);
            setFormData(
              (prev: Partial<FichaInformacaoAmbientalPreliminar>) => ({
                ...prev,
                projectId: undefined,
              })
            );
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
    setFormData((prev: Partial<FichaInformacaoAmbientalPreliminar>) => ({
      ...prev,
      tenantId,
    }));
    setTenantOpen(false);

    // Clear project when tenant changes
    setSelectedProjectId(undefined);
    setFormData((prev: Partial<FichaInformacaoAmbientalPreliminar>) => ({
      ...prev,
      projectId: undefined,
    }));
  };

  // Handle project selection
  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setFormData((prev: Partial<FichaInformacaoAmbientalPreliminar>) => ({
      ...prev,
      projectId,
    }));
    setProjectOpen(false);
  };

  const handleChange = (
    field: keyof FichaInformacaoAmbientalPreliminar,
    value: any
  ) => {
    setFormData((prev: Partial<FichaInformacaoAmbientalPreliminar>) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = formData.id
        ? await update(
            formData.id,
            formData as FichaInformacaoAmbientalPreliminar
          )
        : await create(formData as FichaInformacaoAmbientalPreliminar);

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

      <FormSection title='Informações Básicas'>
        <FormRow>
          <FormField label='Nome da Atividade' required>
            <Input
              value={formData.nomeActividade || ''}
              onChange={(e) => handleChange('nomeActividade', e.target.value)}
            />
          </FormField>

          <FormField label='Tipo de Atividade' required>
            <Select
              value={formData.tipoActividade}
              onValueChange={(value) => handleChange('tipoActividade', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='TURISTICA'>Turística</SelectItem>
                <SelectItem value='INDUSTRIAL'>Industrial</SelectItem>
                <SelectItem value='AGRO_PECUARIA'>Agro-Pecuária</SelectItem>
                <SelectItem value='ENERGETICA'>Energética</SelectItem>
                <SelectItem value='SERVICOS'>Serviços</SelectItem>
                <SelectItem value='OUTRA'>Outra</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </FormRow>

        <FormField label='Proponentes'>
          <Input
            value={formData.proponentes || ''}
            onChange={(e) => handleChange('proponentes', e.target.value)}
          />
        </FormField>
      </FormSection>

      <FormSection title='Informações de Contato'>
        <FormRow>
          <FormField label='Endereço' required>
            <Input
              value={formData.endereco || ''}
              onChange={(e) => handleChange('endereco', e.target.value)}
            />
          </FormField>

          <FormField label='Telefone'>
            <Input
              value={formData.telefone || ''}
              onChange={(e) => handleChange('telefone', e.target.value)}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Fax'>
            <Input
              value={formData.fax || ''}
              onChange={(e) => handleChange('fax', e.target.value)}
            />
          </FormField>

          <FormField label='Telemóvel'>
            <Input
              value={formData.telemovel || ''}
              onChange={(e) => handleChange('telemovel', e.target.value)}
            />
          </FormField>
        </FormRow>

        <FormField label='Email' required>
          <Input
            type='email'
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </FormField>
      </FormSection>

      <FormSection title='Localização'>
        <FormRow>
          <FormField label='Bairro' required>
            <Input
              value={formData.bairroActividade || ''}
              onChange={(e) => handleChange('bairroActividade', e.target.value)}
            />
          </FormField>

          <FormField label='Vila' required>
            <Input
              value={formData.vilaActividade || ''}
              onChange={(e) => handleChange('vilaActividade', e.target.value)}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Cidade' required>
            <Input
              value={formData.cidadeActividade || ''}
              onChange={(e) => handleChange('cidadeActividade', e.target.value)}
            />
          </FormField>

          <FormField label='Localidade'>
            <Input
              value={formData.localidadeActividade || ''}
              onChange={(e) =>
                handleChange('localidadeActividade', e.target.value)
              }
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Distrito'>
            <Input
              value={formData.distritoActividade || ''}
              onChange={(e) =>
                handleChange('distritoActividade', e.target.value)
              }
            />
          </FormField>

          <FormField label='Província' required>
            <Select
              value={formData.provinciaActividade}
              onValueChange={(value) =>
                handleChange('provinciaActividade', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='MAPUTO'>Maputo</SelectItem>
                <SelectItem value='MAPUTO_CIDADE'>Maputo Cidade</SelectItem>
                <SelectItem value='GAZA'>Gaza</SelectItem>
                <SelectItem value='INHAMBANE'>Inhambane</SelectItem>
                <SelectItem value='SOFALA'>Sofala</SelectItem>
                <SelectItem value='MANICA'>Manica</SelectItem>
                <SelectItem value='TETE'>Tete</SelectItem>
                <SelectItem value='ZAMBEZIA'>Zambézia</SelectItem>
                <SelectItem value='NAMPULA'>Nampula</SelectItem>
                <SelectItem value='CABO_DELGADO'>Cabo Delgado</SelectItem>
                <SelectItem value='NIASSA'>Niassa</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </FormRow>

        <FormField label='Coordenadas Geográficas'>
          <Input
            value={formData.coordenadasGeograficas || ''}
            onChange={(e) =>
              handleChange('coordenadasGeograficas', e.target.value)
            }
          />
        </FormField>
      </FormSection>

      <FormSection title='Características do Projeto'>
        <FormRow>
          <FormField label='Meio de Inserção' required>
            <Select
              value={formData.meioInsercao}
              onValueChange={(value) => handleChange('meioInsercao', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='RURAL'>Rural</SelectItem>
                <SelectItem value='URBANO'>Urbano</SelectItem>
                <SelectItem value='PERIURBANO'>Periurbano</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label='Enquadramento Orçamental' required>
            <Select
              value={formData.enquadramentoOrcamentoTerritorial}
              onValueChange={(value) =>
                handleChange('enquadramentoOrcamentoTerritorial', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ESPACO_HABITACIONAL'>
                  Espaço Habitacional
                </SelectItem>
                <SelectItem value='INDUSTRIAL'>Industrial</SelectItem>
                <SelectItem value='SERVICOS'>Serviços</SelectItem>
                <SelectItem value='OUTRO'>Outro</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </FormRow>

        <FormField label='Descrição da Atividade'>
          <Textarea
            value={formData.descricaoActividade || ''}
            onChange={(e) =>
              handleChange('descricaoActividade', e.target.value)
            }
          />
        </FormField>

        <FormField label='Atividades Associadas'>
          <Textarea
            value={formData.actividadesAssociadas || ''}
            onChange={(e) =>
              handleChange('actividadesAssociadas', e.target.value)
            }
          />
        </FormField>

        <FormField label='Descrição da Tecnologia de Construção/Operação'>
          <Textarea
            value={formData.descricaoTecnologiaConstrucaoOperacao || ''}
            onChange={(e) =>
              handleChange(
                'descricaoTecnologiaConstrucaoOperacao',
                e.target.value
              )
            }
          />
        </FormField>

        <FormField label='Atividades Complementares Principais'>
          <Textarea
            value={formData.actividadesComplementaresPrincipais || ''}
            onChange={(e) =>
              handleChange(
                'actividadesComplementaresPrincipais',
                e.target.value
              )
            }
          />
        </FormField>
      </FormSection>

      <FormSection title='Recursos e Infraestrutura'>
        <FormField label='Tipo e Quantidade de Origem da Mão de Obra'>
          <Textarea
            value={formData.tipoQuantidadeOrigemMaoDeObra || ''}
            onChange={(e) =>
              handleChange('tipoQuantidadeOrigemMaoDeObra', e.target.value)
            }
          />
        </FormField>

        <FormField label='Tipo e Quantidade de Origem/Proveniência de Matérias Primas'>
          <Textarea
            value={
              formData.tipoQuantidadeOrigemProvenienciaMateriasPrimas || ''
            }
            onChange={(e) =>
              handleChange(
                'tipoQuantidadeOrigemProvenienciaMateriasPrimas',
                e.target.value
              )
            }
          />
        </FormField>

        <FormField label='Químicos Utilizados'>
          <Textarea
            value={formData.quimicosUtilizados || ''}
            onChange={(e) => handleChange('quimicosUtilizados', e.target.value)}
          />
        </FormField>

        <FormField label='Tipo e Origem do Consumo de Água/Energia'>
          <Textarea
            value={formData.tipoOrigemConsumoAguaEnergia || ''}
            onChange={(e) =>
              handleChange('tipoOrigemConsumoAguaEnergia', e.target.value)
            }
          />
        </FormField>

        <FormField label='Origem de Combustíveis/Lubrificantes'>
          <Textarea
            value={formData.origemCombustiveisLubrificantes || ''}
            onChange={(e) =>
              handleChange('origemCombustiveisLubrificantes', e.target.value)
            }
          />
        </FormField>

        <FormField label='Outros Recursos Necessários'>
          <Textarea
            value={formData.outrosRecursosNecessarios || ''}
            onChange={(e) =>
              handleChange('outrosRecursosNecessarios', e.target.value)
            }
          />
        </FormField>
      </FormSection>

      <FormSection title='Informações Ambientais'>
        <FormField label='Posse de Terra'>
          <Textarea
            value={formData.posseDeTerra || ''}
            onChange={(e) => handleChange('posseDeTerra', e.target.value)}
          />
        </FormField>

        <FormField label='Alternativas de Localização da Atividade'>
          <Textarea
            value={formData.alternativasLocalizacaoActividade || ''}
            onChange={(e) =>
              handleChange('alternativasLocalizacaoActividade', e.target.value)
            }
          />
        </FormField>

        <FormField label='Descrição Breve da Situação Ambiental de Referência Local/Regional'>
          <Textarea
            value={
              formData.descricaoBreveSituacaoAmbientalReferenciaLocalRegional ||
              ''
            }
            onChange={(e) =>
              handleChange(
                'descricaoBreveSituacaoAmbientalReferenciaLocalRegional',
                e.target.value
              )
            }
          />
        </FormField>

        <FormRow>
          <FormField label='Características Físicas do Local'>
            <Select
              value={formData.caracteristicasFisicasLocalActividade}
              onValueChange={(value) =>
                handleChange('caracteristicasFisicasLocalActividade', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='PLANICIE'>Planície</SelectItem>
                <SelectItem value='PLANALTO'>Planalto</SelectItem>
                <SelectItem value='VALE'>Vale</SelectItem>
                <SelectItem value='MONTANHA'>Montanha</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label='Ecossistemas Predominantes'>
            <Select
              value={formData.ecosistemasPredominantes}
              onValueChange={(value) =>
                handleChange('ecosistemasPredominantes', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='FLUVIAL'>Fluvial</SelectItem>
                <SelectItem value='LACUSTRE'>Lacustre</SelectItem>
                <SelectItem value='MARINHO'>Marinho</SelectItem>
                <SelectItem value='TERRESTRE'>Terrestre</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Zona de Localização'>
            <Select
              value={formData.zonaLocalizacao}
              onValueChange={(value) => handleChange('zonaLocalizacao', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='COSTEIRA'>Costeira</SelectItem>
                <SelectItem value='INTERIOR'>Interior</SelectItem>
                <SelectItem value='ILHA'>Ilha</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label='Tipo de Vegetação Predominante'>
            <Select
              value={formData.tipoVegetacaoPredominante}
              onValueChange={(value) =>
                handleChange('tipoVegetacaoPredominante', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='FLORESTA'>Floresta</SelectItem>
                <SelectItem value='SAVANA'>Savana</SelectItem>
                <SelectItem value='OUTRO'>Outro</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </FormRow>

        <FormField label='Uso do Solo'>
          <Select
            value={formData.usoSolo}
            onValueChange={(value) => handleChange('usoSolo', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='AGROPECUARIO'>Agropecuário</SelectItem>
              <SelectItem value='HABITACIONAL'>Habitacional</SelectItem>
              <SelectItem value='INDUSTRIAL'>Industrial</SelectItem>
              <SelectItem value='PROTECCAO'>Proteção</SelectItem>
              <SelectItem value='OUTRO'>Outro</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label='Infraestrutura Existente na Área da Atividade'>
          <Textarea
            value={formData.infraestruturaExistenteAreaActividade || ''}
            onChange={(e) =>
              handleChange(
                'infraestruturaExistenteAreaActividade',
                e.target.value
              )
            }
          />
        </FormField>

        <FormField label='Informação Complementar Através de Maps'>
          <Textarea
            value={formData.informacaoComplementarAtravesMaps || ''}
            onChange={(e) =>
              handleChange('informacaoComplementarAtravesMaps', e.target.value)
            }
          />
        </FormField>

        <FormField label='Valor Total do Investimento'>
          <Input
            type='number'
            step='0.01'
            value={formData.valorTotalInvestimento}
            onChange={(e) =>
              handleChange('valorTotalInvestimento', parseFloat(e.target.value))
            }
          />
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
        submitLabel={formData.id ? 'Atualizar' : 'Criar'}
      />
    </form>
  );
}
