'use client';

import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProjectTenantSelectorsProps {
  form: UseFormReturn<any>;
  defaultTenantId?: string;
  defaultProjectId?: string;
  disabled?: boolean; // Add this prop to allow control of disabled state
}

export function ProjectTenantSelectors({
  form,
  defaultTenantId,
  defaultProjectId,
  disabled = false, // Default to not disabled
}: ProjectTenantSelectorsProps) {
  const [tenants, setTenants] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>(
    defaultTenantId
  );

  // Load tenants on component mount
  useEffect(() => {
    loadTenants();
  }, []);

  // Load projects when tenant changes
  useEffect(() => {
    if (selectedTenantId) {
      loadProjects(selectedTenantId);
    }
  }, [selectedTenantId]);

  // Set form values when defaults are provided
  useEffect(() => {
    if (defaultTenantId) {
      form.setValue('tenantId', defaultTenantId);
      setSelectedTenantId(defaultTenantId);
    }
    if (defaultProjectId) {
      form.setValue('projectId', defaultProjectId);
    }
  }, [defaultTenantId, defaultProjectId, form]);

  const loadTenants = async () => {
    try {
      setLoadingTenants(true);
      const response = await fetch('/api/tenants');
      if (!response.ok) throw new Error('Failed to load tenants');
      const data = await response.json();
      setTenants(data);
    } catch (error) {
      console.error('Error loading tenants:', error);
    } finally {
      setLoadingTenants(false);
    }
  };

  const loadProjects = async (tenantId: string) => {
    try {
      setLoadingProjects(true);
      const response = await fetch(`/api/projects?tenantId=${tenantId}`);
      if (!response.ok) throw new Error('Failed to load projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name='tenantId'
        render={({ field }) => (
          <FormItem className='flex-1'>
            <FormLabel>Entidade</FormLabel>
            <Select
              disabled={disabled || loadingTenants} // Use prop instead of hardcoded value
              onValueChange={(value) => {
                field.onChange(value);
                setSelectedTenantId(value);
                // Reset project when tenant changes
                form.setValue('projectId', '');
              }}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecionar entidade' />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='projectId'
        render={({ field }) => (
          <FormItem className='flex-1'>
            <FormLabel>Projeto</FormLabel>
            <Select
              disabled={disabled || !selectedTenantId || loadingProjects} // Use prop instead of hardcoded value
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecionar projeto' />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
