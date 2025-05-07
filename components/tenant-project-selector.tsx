'use client';

import { useState, useEffect, useContext } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  TenantProjectContext,
  TenantProjectProvider,
} from '@/lib/context/tenant-project-context';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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

// Inner component that uses the context directly
function InnerTenantProjectSelector() {
  // Get context values
  const context = useContext(TenantProjectContext);
  if (!context) {
    return (
      <div className='flex items-center space-x-2'>
        <div className='w-[200px]'>
          <div className='h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-400'>
            Tenant não disponível
          </div>
        </div>
      </div>
    );
  }

  const {
    currentTenantId,
    currentProjectId,
    setCurrentTenant,
    setCurrentProject,
  } = context;

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingTenants, setIsLoadingTenants] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [tenantOpen, setTenantOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  // Fetch tenants on component mount with improved error handling
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        console.log('Fetching tenants...');
        setIsLoadingTenants(true);

        const response = await fetch('/api/tenants');
        console.log('Tenant API response status:', response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch tenants: ${response.status}`);
        }

        const data = await response.json();
        console.log('Tenants data received:', data);

        if (!Array.isArray(data)) {
          console.error('Expected array of tenants but got:', typeof data);
          setTenants([]);
        } else if (data.length === 0) {
          console.log('No tenants returned from API');
          setTenants([]);
        } else {
          setTenants(data);
        }
      } catch (error) {
        console.error('Error fetching tenants:', error);
        setTenants([]);
      } finally {
        setIsLoadingTenants(false);
      }
    };

    fetchTenants();
  }, []);

  // Fetch projects when tenant changes
  useEffect(() => {
    if (!currentTenantId) {
      setProjects([]);
      return;
    }

    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const response = await fetch(
          `/api/projects?tenantId=${currentTenantId}`
        );
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [currentTenantId]);

  // Find the current tenant and project names
  const currentTenant = tenants.find((tenant) => tenant.id === currentTenantId);
  const currentProject = projects.find(
    (project) => project.id === currentProjectId
  );

  // Handle tenant selection
  const handleTenantSelect = (tenantId: string) => {
    setCurrentTenant(tenantId);
    setTenantOpen(false);
  };

  // Handle project selection
  const handleProjectSelect = (projectId: string) => {
    setCurrentProject(projectId);
    setProjectOpen(false);
  };

  // Handle clearing project selection
  const handleClearProject = () => {
    setCurrentProject(null);
    setProjectOpen(false);
  };

  return (
    <div className='flex items-center space-x-2'>
      {/* Tenant Selector */}
      <Popover open={tenantOpen} onOpenChange={setTenantOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={tenantOpen}
            className='w-[200px] justify-between'
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
        <PopoverContent className='w-[200px] p-0'>
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
                        currentTenantId === tenant.id
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

      {/* Project Selector - Only show if tenant is selected */}
      {currentTenantId && (
        <Popover open={projectOpen} onOpenChange={setProjectOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={projectOpen}
              className='w-[200px] justify-between'
              disabled={isLoadingProjects}
            >
              {isLoadingProjects ? (
                <Skeleton className='h-4 w-[160px]' />
              ) : currentProject ? (
                currentProject.name
              ) : (
                'Selecionar Projeto'
              )}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0'>
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
                          currentProjectId === project.id
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {project.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {currentProjectId && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem onSelect={handleClearProject}>
                        Limpar seleção de projeto
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

// Wrapper component with simplified context handling
export function TenantProjectSelector() {
  return (
    <TenantProjectProvider>
      <InnerTenantProjectSelector />
    </TenantProjectProvider>
  );
}
