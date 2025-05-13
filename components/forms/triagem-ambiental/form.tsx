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
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  triagemAmbientalSchema,
  type TriagemAmbientalFormData,
} from '@/lib/validations/triagem-ambiental';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddOptionDialog } from '@/components/forms/identificacao-avaliacao-riscos/add-option-dialog';

interface TriagemAmbientalFormProps {
  initialData?: TriagemAmbientalFormData;
  onSubmit: (data: TriagemAmbientalFormData) => Promise<void>;
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

interface Responsavel {
  id: string;
  nome: string;
  funcao: string;
}

interface Subprojecto {
  id: string;
  nome: string;
}

interface ResultadoTriagem {
  id: string;
  categoriaRisco: string;
  descricao: string;
}

interface BiodiversidadeRecurso {
  id: string;
  reference: string;
  description: string;
}

export function TriagemAmbientalForm({
  initialData,
  onSubmit,
  isLoading,
}: TriagemAmbientalFormProps) {
  const router = useRouter();
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [responsaveisPreenchimento, setResponsaveisPreenchimento] = useState<
    Responsavel[]
  >([]);
  const [responsaveisVerificacao, setResponsaveisVerificacao] = useState<
    Responsavel[]
  >([]);
  const [subprojectos, setSubprojectos] = useState<Subprojecto[]>([]);
  const [resultadosTriagem, setResultadosTriagem] = useState<
    ResultadoTriagem[]
  >([]);
  const [biodiversidadeRecursos, setBiodiversidadeRecursos] = useState<
    BiodiversidadeRecurso[]
  >([]);
  const [isLoadingTenants, setIsLoadingTenants] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingResponsaveis, setIsLoadingResponsaveis] = useState(false);
  const [isLoadingSubprojectos, setIsLoadingSubprojectos] = useState(false);
  const [isLoadingResultados, setIsLoadingResultados] = useState(false);
  const [isLoadingRecursos, setIsLoadingRecursos] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>(
    currentTenantId || undefined
  );
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(currentProjectId || undefined);
  const [openTenantDialog, setOpenTenantDialog] = useState(false);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openResponsavelDialog, setOpenResponsavelDialog] = useState(false);
  const [openSubprojectoDialog, setOpenSubprojectoDialog] = useState(false);
  const [openResultadoTriagemDialog, setOpenResultadoTriagemDialog] =
    useState(false);
  const [openBiodiversidadeRecursoDialog, setOpenBiodiversidadeRecursoDialog] =
    useState(false);

  const form = useForm<TriagemAmbientalFormData>({
    resolver: zodResolver(triagemAmbientalSchema),
    defaultValues: {
      tenantId: currentTenantId || undefined,
      projectId: currentProjectId || undefined,
      responsavelPeloPreenchimentoId:
        initialData?.responsavelPeloPreenchimentoId,
      responsavelPelaVerificacaoId: initialData?.responsavelPelaVerificacaoId,
      subprojectoId: initialData?.subprojectoId,
      consultaEngajamento: initialData?.consultaEngajamento,
      accoesRecomendadas: initialData?.accoesRecomendadas,
      resultadoTriagemId: initialData?.resultadoTriagemId,
      identificacaoRiscos: initialData?.identificacaoRiscos || [],
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

  useEffect(() => {
    const fetchResponsaveis = async () => {
      if (!selectedTenantId) return;

      setIsLoadingResponsaveis(true);
      try {
        const response = await fetch(
          `/api/responsaveis?tenantId=${selectedTenantId}`
        );
        const data = await response.json();
        setResponsaveisPreenchimento(data);
        setResponsaveisVerificacao(data);
      } catch (error) {
        console.error('Error fetching responsaveis:', error);
        toast.error('Erro ao carregar responsáveis');
      } finally {
        setIsLoadingResponsaveis(false);
      }
    };

    fetchResponsaveis();
  }, [selectedTenantId]);

  useEffect(() => {
    const fetchSubprojectos = async () => {
      if (!selectedTenantId) return;

      setIsLoadingSubprojectos(true);
      try {
        const response = await fetch(
          `/api/subprojectos?tenantId=${selectedTenantId}`
        );
        const data = await response.json();
        setSubprojectos(data);
      } catch (error) {
        console.error('Error fetching subprojectos:', error);
        toast.error('Erro ao carregar subprojetos');
      } finally {
        setIsLoadingSubprojectos(false);
      }
    };

    fetchSubprojectos();
  }, [selectedTenantId]);

  useEffect(() => {
    const fetchResultadosTriagem = async () => {
      if (!selectedTenantId) return;

      setIsLoadingResultados(true);
      try {
        const response = await fetch(
          `/api/resultados-triagem?tenantId=${selectedTenantId}`
        );
        const data = await response.json();
        setResultadosTriagem(data);
      } catch (error) {
        console.error('Error fetching resultados triagem:', error);
        toast.error('Erro ao carregar resultados da triagem');
      } finally {
        setIsLoadingResultados(false);
      }
    };

    fetchResultadosTriagem();
  }, [selectedTenantId]);

  useEffect(() => {
    const fetchBiodiversidadeRecursos = async () => {
      if (!selectedTenantId) return;

      setIsLoadingRecursos(true);
      try {
        const response = await fetch(
          `/api/biodiversidade-recursos?tenantId=${selectedTenantId}`
        );
        const data = await response.json();
        setBiodiversidadeRecursos(data);
      } catch (error) {
        console.error('Error fetching biodiversidade recursos:', error);
        toast.error('Erro ao carregar recursos de biodiversidade');
      } finally {
        setIsLoadingRecursos(false);
      }
    };

    fetchBiodiversidadeRecursos();
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

  const handleSubmit = async (data: TriagemAmbientalFormData) => {
    try {
      await onSubmit(data);
      toast.success('Formulário salvo com sucesso');
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao salvar formulário');
    }
  };

  const handleAddNewOption = async (type: string, value: string) => {
    try {
      let endpoint = '';
      let data = {};

      switch (type) {
        case 'responsavel':
          endpoint = '/api/responsaveis';
          data = {
            nome: value,
            funcao: '',
            contacto: '',
            data: new Date(),
            tenantId: selectedTenantId,
          };
          break;
        case 'subprojecto':
          endpoint = '/api/subprojectos';
          data = {
            nome: value,
            tenantId: selectedTenantId,
          };
          break;
        case 'resultado-triagem':
          endpoint = '/api/resultados-triagem';
          data = {
            categoriaRisco: value,
            descricao: '',
            instrumentosASeremDesenvolvidos: '',
            tenantId: selectedTenantId,
            subprojectoId: form.getValues('subprojectoId'),
          };
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

      const newItem = await response.json();

      // Update the respective state
      switch (type) {
        case 'responsavel':
          setResponsaveisPreenchimento((prev) => [...prev, newItem]);
          setResponsaveisVerificacao((prev) => [...prev, newItem]);
          break;
        case 'subprojecto':
          setSubprojectos((prev) => [...prev, newItem]);
          break;
        case 'resultado-triagem':
          setResultadosTriagem((prev) => [...prev, newItem]);
          break;
      }

      toast.success('Item adicionado com sucesso');
    } catch (error) {
      console.error('Error adding new option:', error);
      toast.error('Erro ao adicionar item');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                          ? tenants.find((tenant) => tenant.id === field.value)
                              ?.name
                          : 'Selecione um tenant'}
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0'>
                    <Command>
                      <CommandInput placeholder='Buscar tenant...' />
                      <CommandList>
                        <CommandEmpty>
                          <div className='flex items-center justify-between p-2'>
                            <span>Nenhum tenant encontrado</span>
                            <Dialog
                              open={openTenantDialog}
                              onOpenChange={setOpenTenantDialog}
                            >
                              <DialogTrigger asChild>
                                <Button variant='outline' size='sm'>
                                  <Plus className='h-4 w-4 mr-2' />
                                  Novo Tenant
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Novo Tenant</DialogTitle>
                                  <DialogDescription>
                                    Preencha os dados do novo tenant
                                  </DialogDescription>
                                </DialogHeader>
                                {/* Add tenant form here */}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CommandEmpty>
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
                        <CommandEmpty>
                          <div className='flex items-center justify-between p-2'>
                            <span>Nenhum projeto encontrado</span>
                            <Dialog
                              open={openProjectDialog}
                              onOpenChange={setOpenProjectDialog}
                            >
                              <DialogTrigger asChild>
                                <Button variant='outline' size='sm'>
                                  <Plus className='h-4 w-4 mr-2' />
                                  Novo Projeto
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Novo Projeto</DialogTitle>
                                  <DialogDescription>
                                    Preencha os dados do novo projeto
                                  </DialogDescription>
                                </DialogHeader>
                                {/* Add project form here */}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CommandEmpty>
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
                                onSelect={() => handleProjectSelect(project.id)}
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

          <FormField
            control={form.control}
            name='responsavelPeloPreenchimentoId'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Responsável pelo Preenchimento</FormLabel>
                <div className='flex items-center gap-2'>
                  <div className='flex-1'>
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
                              ? responsaveisPreenchimento.find(
                                  (responsavel) =>
                                    responsavel.id === field.value
                                )?.nome
                              : 'Selecione um responsável'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-full p-0'>
                        <Command>
                          <CommandInput placeholder='Buscar responsável...' />
                          <CommandList>
                            <CommandEmpty>
                              <div className='flex items-center justify-between p-2'>
                                <span>Nenhum responsável encontrado</span>
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              {isLoadingResponsaveis ? (
                                <div className='p-2'>
                                  <Skeleton className='h-8 w-full' />
                                </div>
                              ) : (
                                responsaveisPreenchimento.map((responsavel) => (
                                  <CommandItem
                                    value={responsavel.nome}
                                    key={responsavel.id}
                                    onSelect={() =>
                                      field.onChange(responsavel.id)
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        responsavel.id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {responsavel.nome}
                                  </CommandItem>
                                ))
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <AddOptionDialog
                    type='Responsável'
                    onAdd={(value) => handleAddNewOption('responsavel', value)}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='responsavelPelaVerificacaoId'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Responsável pela Verificação</FormLabel>
                <div className='flex items-center gap-2'>
                  <div className='flex-1'>
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
                              ? responsaveisVerificacao.find(
                                  (responsavel) =>
                                    responsavel.id === field.value
                                )?.nome
                              : 'Selecione um responsável'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-full p-0'>
                        <Command>
                          <CommandInput placeholder='Buscar responsável...' />
                          <CommandList>
                            <CommandEmpty>
                              <div className='flex items-center justify-between p-2'>
                                <span>Nenhum responsável encontrado</span>
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              {isLoadingResponsaveis ? (
                                <div className='p-2'>
                                  <Skeleton className='h-8 w-full' />
                                </div>
                              ) : (
                                responsaveisVerificacao.map((responsavel) => (
                                  <CommandItem
                                    value={responsavel.nome}
                                    key={responsavel.id}
                                    onSelect={() =>
                                      field.onChange(responsavel.id)
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        responsavel.id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {responsavel.nome}
                                  </CommandItem>
                                ))
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <AddOptionDialog
                    type='Responsável'
                    onAdd={(value) => handleAddNewOption('responsavel', value)}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='subprojectoId'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Subprojeto</FormLabel>
                <div className='flex items-center gap-2'>
                  <div className='flex-1'>
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
                              ? subprojectos.find((s) => s.id === field.value)
                                  ?.nome
                              : 'Selecione um subprojeto'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-full p-0'>
                        <Command>
                          <CommandInput placeholder='Buscar subprojeto...' />
                          <CommandList>
                            <CommandEmpty>
                              <div className='flex items-center justify-between p-2'>
                                <span>Nenhum subprojeto encontrado</span>
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              {isLoadingSubprojectos ? (
                                <div className='p-2'>
                                  <Skeleton className='h-8 w-full' />
                                </div>
                              ) : (
                                subprojectos.map((subprojecto) => (
                                  <CommandItem
                                    value={subprojecto.nome}
                                    key={subprojecto.id}
                                    onSelect={() =>
                                      field.onChange(subprojecto.id)
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        subprojecto.id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {subprojecto.nome}
                                  </CommandItem>
                                ))
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <AddOptionDialog
                    type='Subprojeto'
                    onAdd={(value) => handleAddNewOption('subprojecto', value)}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='resultadoTriagemId'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Resultado da Triagem</FormLabel>
                <div className='flex items-center gap-2'>
                  <div className='flex-1'>
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
                              ? resultadosTriagem.find(
                                  (r) => r.id === field.value
                                )?.categoriaRisco
                              : 'Selecione um resultado'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-full p-0'>
                        <Command>
                          <CommandInput placeholder='Buscar resultado...' />
                          <CommandList>
                            <CommandEmpty>
                              <div className='flex items-center justify-between p-2'>
                                <span>Nenhum resultado encontrado</span>
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              {isLoadingResultados ? (
                                <div className='p-2'>
                                  <Skeleton className='h-8 w-full' />
                                </div>
                              ) : (
                                resultadosTriagem.map((resultado) => (
                                  <CommandItem
                                    value={resultado.categoriaRisco}
                                    key={resultado.id}
                                    onSelect={() =>
                                      field.onChange(resultado.id)
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        resultado.id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {resultado.categoriaRisco}
                                  </CommandItem>
                                ))
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <AddOptionDialog
                    type='Resultado'
                    onAdd={(value) =>
                      handleAddNewOption('resultado-triagem', value)
                    }
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='consultaEngajamento'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consulta de Engajamento</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Digite a consulta de engajamento'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='accoesRecomendadas'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ações Recomendadas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Digite as ações recomendadas'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Identificação de Riscos</h3>
          {biodiversidadeRecursos.map((recurso, index) => (
            <div key={recurso.id} className='space-y-4 rounded-lg border p-4'>
              <h4 className='font-medium'>{recurso.reference}</h4>
              <p className='text-sm text-muted-foreground'>
                {recurso.description}
              </p>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name={`identificacaoRiscos.${index}.resposta`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resposta</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione uma resposta' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='SIM'>Sim</SelectItem>
                          <SelectItem value='NAO'>Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`identificacaoRiscos.${index}.comentario`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comentário</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`identificacaoRiscos.${index}.normaAmbientalSocial`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Norma Ambiental Social</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Limpar
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
