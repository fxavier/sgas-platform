'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  fichaInformacaoSchema,
  type FichaInformacaoFormData,
} from '@/lib/validations/ficha-informacao';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { FormSection } from '@/components/forms/form-section';
import { FormRow } from '@/components/forms/form-row';
import { CustomFormField } from '@/components/forms/form-field';

interface FichaInformacaoAmbientalFormProps {
  initialData?: FichaInformacaoFormData;
  onSubmit: (data: FichaInformacaoFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface Tenant {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

export function FichaInformacaoAmbientalForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: FichaInformacaoAmbientalFormProps) {
  const router = useRouter();
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingTenants, setIsLoadingTenants] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>(
    currentTenantId || undefined
  );
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(currentProjectId || undefined);

  const form = useForm<FichaInformacaoFormData>({
    resolver: zodResolver(fichaInformacaoSchema),
    defaultValues: {
      tenantId: currentTenantId || undefined,
      projectId: currentProjectId || undefined,
      nomeActividade: initialData?.nomeActividade || '',
      tipoActividade: initialData?.tipoActividade || 'TURISTICA',
      proponentes: initialData?.proponentes || '',
      endereco: initialData?.endereco || '',
      telefone: initialData?.telefone || '',
      fax: initialData?.fax || '',
      telemovel: initialData?.telemovel || '',
      email: initialData?.email || '',
      bairroActividade: initialData?.bairroActividade || '',
      vilaActividade: initialData?.vilaActividade || '',
      cidadeActividade: initialData?.cidadeActividade || '',
      localidadeActividade: initialData?.localidadeActividade || '',
      distritoActividade: initialData?.distritoActividade || '',
      provinciaActividade: initialData?.provinciaActividade || 'MAPUTO',
      coordenadasGeograficas: initialData?.coordenadasGeograficas || '',
      meioInsercao: initialData?.meioInsercao || 'RURAL',
      enquadramentoOrcamentoTerritorial:
        initialData?.enquadramentoOrcamentoTerritorial || 'ESPACO_HABITACIONAL',
      descricaoActividade: initialData?.descricaoActividade || '',
      actividadesAssociadas: initialData?.actividadesAssociadas || '',
      descricaoTecnologiaConstrucaoOperacao:
        initialData?.descricaoTecnologiaConstrucaoOperacao || '',
      actividadesComplementaresPrincipais:
        initialData?.actividadesComplementaresPrincipais || '',
      tipoQuantidadeOrigemMaoDeObra:
        initialData?.tipoQuantidadeOrigemMaoDeObra || '',
      tipoQuantidadeOrigemProvenienciaMateriasPrimas:
        initialData?.tipoQuantidadeOrigemProvenienciaMateriasPrimas || '',
      quimicosUtilizados: initialData?.quimicosUtilizados || '',
      tipoOrigemConsumoAguaEnergia:
        initialData?.tipoOrigemConsumoAguaEnergia || '',
      origemCombustiveisLubrificantes:
        initialData?.origemCombustiveisLubrificantes || '',
      outrosRecursosNecessarios: initialData?.outrosRecursosNecessarios || '',
      posseDeTerra: initialData?.posseDeTerra || '',
      alternativasLocalizacaoActividade:
        initialData?.alternativasLocalizacaoActividade || '',
      descricaoBreveSituacaoAmbientalReferenciaLocalRegional:
        initialData?.descricaoBreveSituacaoAmbientalReferenciaLocalRegional ||
        '',
      caracteristicasFisicasLocalActividade:
        initialData?.caracteristicasFisicasLocalActividade || 'PLANICIE',
      ecosistemasPredominantes:
        initialData?.ecosistemasPredominantes || 'FLUVIAL',
      zonaLocalizacao: initialData?.zonaLocalizacao || 'COSTEIRA',
      tipoVegetacaoPredominante:
        initialData?.tipoVegetacaoPredominante || 'FLORESTA',
      usoSolo: initialData?.usoSolo || 'AGROPECUARIO',
      infraestruturaExistenteAreaActividade:
        initialData?.infraestruturaExistenteAreaActividade || '',
      informacaoComplementarAtravesMaps:
        initialData?.informacaoComplementarAtravesMaps || '',
      valorTotalInvestimento: initialData?.valorTotalInvestimento || 0,
    },
  });

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/tenants');
        const data = await response.json();
        setTenants(data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        toast.error('Erro ao carregar tenants');
      } finally {
        setIsLoadingTenants(false);
      }
    };

    fetchTenants();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!selectedTenantId) return;

      setIsLoadingProjects(true);
      try {
        const response = await fetch(
          `/api/projects?tenantId=${selectedTenantId}`
        );
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Erro ao carregar projetos');
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [selectedTenantId]);

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    setSelectedProjectId(undefined);
    form.setValue('tenantId', tenantId);
    form.setValue('projectId', '');
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    form.setValue('projectId', projectId);
  };

  const handleSubmit = async (data: FichaInformacaoFormData) => {
    try {
      await onSubmit(data);
      toast.success('Formulário salvo com sucesso');
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao salvar formulário');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
        <FormSection title='Informações Básicas'>
          <FormRow>
            <FormField
              control={form.control}
              name='tenantId'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Tenant</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? tenants.find(
                                (tenant) => tenant.id === field.value
                              )?.name
                            : 'Selecione um tenant'}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0'>
                      <Command>
                        <CommandInput placeholder='Buscar tenant...' />
                        <CommandList>
                          <CommandEmpty>Nenhum tenant encontrado</CommandEmpty>
                          <CommandGroup>
                            {isLoadingTenants ? (
                              <div className='p-2'>
                                <Skeleton className='h-8 w-full' />
                              </div>
                            ) : (
                              tenants.map((tenant) => (
                                <CommandItem
                                  value={tenant.name}
                                  key={tenant.id}
                                  onSelect={() => handleTenantSelect(tenant.id)}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      tenant.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {tenant.name}
                                </CommandItem>
                              ))
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='projectId'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Projeto</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={!selectedTenantId}
                        >
                          {field.value
                            ? projects.find(
                                (project) => project.id === field.value
                              )?.name
                            : 'Selecione um projeto'}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0'>
                      <Command>
                        <CommandInput placeholder='Buscar projeto...' />
                        <CommandList>
                          <CommandEmpty>Nenhum projeto encontrado</CommandEmpty>
                          <CommandGroup>
                            {isLoadingProjects ? (
                              <div className='p-2'>
                                <Skeleton className='h-8 w-full' />
                              </div>
                            ) : (
                              projects.map((project) => (
                                <CommandItem
                                  value={project.name}
                                  key={project.id}
                                  onSelect={() =>
                                    handleProjectSelect(project.id)
                                  }
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      project.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {project.name}
                                </CommandItem>
                              ))
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='nomeActividade'
              label='Nome da Atividade'
              placeholder='Digite o nome da atividade'
            />

            <CustomFormField
              control={form.control}
              name='tipoActividade'
              label='Tipo de Atividade'
              type='select'
              options={[
                { value: 'TURISTICA', label: 'Turística' },
                { value: 'INDUSTRIAL', label: 'Industrial' },
                { value: 'AGRO_PECUARIA', label: 'Agro-pecuária' },
                { value: 'ENERGETICA', label: 'Energética' },
                { value: 'SERVICOS', label: 'Serviços' },
                { value: 'OUTRA', label: 'Outra' },
              ]}
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='proponentes'
              label='Proponentes'
              placeholder='Digite os proponentes'
            />

            <CustomFormField
              control={form.control}
              name='endereco'
              label='Endereço'
              placeholder='Digite o endereço'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='telefone'
              label='Telefone'
              placeholder='Digite o telefone'
            />

            <CustomFormField
              control={form.control}
              name='fax'
              label='Fax'
              placeholder='Digite o fax'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='telemovel'
              label='Telemóvel'
              placeholder='Digite o telemóvel'
            />

            <CustomFormField
              control={form.control}
              name='email'
              label='Email'
              placeholder='Digite o email'
            />
          </FormRow>
        </FormSection>

        <FormSection title='Localização'>
          <FormRow>
            <CustomFormField
              control={form.control}
              name='bairroActividade'
              label='Bairro'
              placeholder='Digite o bairro'
            />

            <CustomFormField
              control={form.control}
              name='vilaActividade'
              label='Vila'
              placeholder='Digite a vila'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='cidadeActividade'
              label='Cidade'
              placeholder='Digite a cidade'
            />

            <CustomFormField
              control={form.control}
              name='localidadeActividade'
              label='Localidade'
              placeholder='Digite a localidade'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='distritoActividade'
              label='Distrito'
              placeholder='Digite o distrito'
            />

            <CustomFormField
              control={form.control}
              name='provinciaActividade'
              label='Província'
              type='select'
              options={[
                { value: 'MAPUTO', label: 'Maputo' },
                { value: 'MAPUTO_CIDADE', label: 'Maputo Cidade' },
                { value: 'GAZA', label: 'Gaza' },
                { value: 'INHAMBANE', label: 'Inhambane' },
                { value: 'SOFALA', label: 'Sofala' },
                { value: 'MANICA', label: 'Manica' },
                { value: 'TETE', label: 'Tete' },
                { value: 'ZAMBEZIA', label: 'Zambézia' },
                { value: 'NAMPULA', label: 'Nampula' },
                { value: 'CABO_DELGADO', label: 'Cabo Delgado' },
                { value: 'NIASSA', label: 'Niassa' },
              ]}
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='coordenadasGeograficas'
              label='Coordenadas Geográficas'
              placeholder='Digite as coordenadas geográficas'
            />

            <CustomFormField
              control={form.control}
              name='meioInsercao'
              label='Meio de Inserção'
              type='select'
              options={[
                { value: 'RURAL', label: 'Rural' },
                { value: 'URBANO', label: 'Urbano' },
                { value: 'PERIURBANO', label: 'Periurbano' },
              ]}
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='enquadramentoOrcamentoTerritorial'
              label='Enquadramento Orçamento Territorial'
              type='select'
              options={[
                { value: 'ESPACO_HABITACIONAL', label: 'Espaço Habitacional' },
                { value: 'INDUSTRIAL', label: 'Industrial' },
                { value: 'SERVICOS', label: 'Serviços' },
                { value: 'OUTRO', label: 'Outro' },
              ]}
            />
          </FormRow>
        </FormSection>

        <FormSection title='Descrição da Atividade'>
          <FormRow>
            <CustomFormField
              control={form.control}
              name='descricaoActividade'
              label='Descrição da Atividade'
              type='textarea'
              placeholder='Digite a descrição da atividade'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='actividadesAssociadas'
              label='Atividades Associadas'
              type='textarea'
              placeholder='Digite as atividades associadas'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='descricaoTecnologiaConstrucaoOperacao'
              label='Descrição da Tecnologia de Construção e Operação'
              type='textarea'
              placeholder='Digite a descrição da tecnologia'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='actividadesComplementaresPrincipais'
              label='Atividades Complementares Principais'
              type='textarea'
              placeholder='Digite as atividades complementares'
            />
          </FormRow>
        </FormSection>

        <FormSection title='Recursos e Infraestrutura'>
          <FormRow>
            <CustomFormField
              control={form.control}
              name='tipoQuantidadeOrigemMaoDeObra'
              label='Tipo e Quantidade de Mão de Obra'
              type='textarea'
              placeholder='Digite informações sobre a mão de obra'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='tipoQuantidadeOrigemProvenienciaMateriasPrimas'
              label='Tipo e Quantidade de Matérias Primas'
              type='textarea'
              placeholder='Digite informações sobre as matérias primas'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='quimicosUtilizados'
              label='Químicos Utilizados'
              type='textarea'
              placeholder='Digite os químicos utilizados'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='tipoOrigemConsumoAguaEnergia'
              label='Origem do Consumo de Água e Energia'
              type='textarea'
              placeholder='Digite informações sobre o consumo de água e energia'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='origemCombustiveisLubrificantes'
              label='Origem de Combustíveis e Lubrificantes'
              type='textarea'
              placeholder='Digite informações sobre combustíveis e lubrificantes'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='outrosRecursosNecessarios'
              label='Outros Recursos Necessários'
              type='textarea'
              placeholder='Digite outros recursos necessários'
            />
          </FormRow>
        </FormSection>

        <FormSection title='Características do Local'>
          <FormRow>
            <CustomFormField
              control={form.control}
              name='posseDeTerra'
              label='Posse de Terra'
              type='textarea'
              placeholder='Digite informações sobre a posse de terra'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='alternativasLocalizacaoActividade'
              label='Alternativas de Localização'
              type='textarea'
              placeholder='Digite as alternativas de localização'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='descricaoBreveSituacaoAmbientalReferenciaLocalRegional'
              label='Situação Ambiental de Referência'
              type='textarea'
              placeholder='Digite a situação ambiental de referência'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='caracteristicasFisicasLocalActividade'
              label='Características Físicas do Local'
              type='select'
              options={[
                { value: 'PLANICIE', label: 'Planície' },
                { value: 'PLANALTO', label: 'Planalto' },
                { value: 'VALE', label: 'Vale' },
                { value: 'MONTANHA', label: 'Montanha' },
              ]}
            />

            <CustomFormField
              control={form.control}
              name='ecosistemasPredominantes'
              label='Ecossistemas Predominantes'
              type='select'
              options={[
                { value: 'FLUVIAL', label: 'Fluvial' },
                { value: 'LACUSTRE', label: 'Lacustre' },
                { value: 'MARINHO', label: 'Marinho' },
                { value: 'TERRESTRE', label: 'Terrestre' },
              ]}
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='zonaLocalizacao'
              label='Zona de Localização'
              type='select'
              options={[
                { value: 'COSTEIRA', label: 'Costeira' },
                { value: 'INTERIOR', label: 'Interior' },
                { value: 'ILHA', label: 'Ilha' },
              ]}
            />

            <CustomFormField
              control={form.control}
              name='tipoVegetacaoPredominante'
              label='Tipo de Vegetação Predominante'
              type='select'
              options={[
                { value: 'FLORESTA', label: 'Floresta' },
                { value: 'SAVANA', label: 'Savana' },
                { value: 'OUTRO', label: 'Outro' },
              ]}
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='usoSolo'
              label='Uso do Solo'
              type='select'
              options={[
                { value: 'AGROPECUARIO', label: 'Agropecuário' },
                { value: 'HABITACIONAL', label: 'Habitacional' },
                { value: 'INDUSTRIAL', label: 'Industrial' },
                { value: 'PROTECCAO', label: 'Proteção' },
                { value: 'OUTRO', label: 'Outro' },
              ]}
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='infraestruturaExistenteAreaActividade'
              label='Infraestrutura Existente'
              type='textarea'
              placeholder='Digite informações sobre a infraestrutura existente'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='informacaoComplementarAtravesMaps'
              label='Informação Complementar via Maps'
              type='textarea'
              placeholder='Digite informações complementares via maps'
            />
          </FormRow>

          <FormRow>
            <CustomFormField
              control={form.control}
              name='valorTotalInvestimento'
              label='Valor Total do Investimento'
              type='number'
              placeholder='Digite o valor total do investimento'
            />
          </FormRow>
        </FormSection>

        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
