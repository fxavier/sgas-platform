'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { projectsData, documentsData, chartData } from '@/lib/mock-data';
import { FolderKanban, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/dashboard/kpi-card';
import { ProjectProgressChart } from '@/components/dashboard/project-progress-chart';
import { ProjectStatusChart } from '@/components/dashboard/project-status-chart';
import { MonthlyProgressChart } from '@/components/dashboard/monthly-progress-chart';
import { ProjectsTable } from '@/components/dashboard/projects-table';
import { RecentDocuments } from '@/components/dashboard/recent-documents';
import { TeamMembers } from '@/components/dashboard/team-members';

interface ProjectDashboardClientProps {
  params: {
    tenant: string;
    projectId: string;
  };
}

export default function ProjectDashboardClient({
  params,
}: ProjectDashboardClientProps) {
  const { user } = useAuth();
  const project = projectsData.find(
    (p) => p.id === params.projectId && p.institution === params.tenant
  );

  if (!project) {
    return (
      <div className='text-center py-12'>
        <h2 className='text-2xl font-bold mb-4'>Projeto não encontrado</h2>
        <Link href={`/${params.tenant}/dashboard`}>
          <Button>Voltar para o Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Filter data for this specific project
  const projectDocuments = documentsData.filter(
    (d) => d.projectId === project.id
  );
  const teamMembers = [
    { name: project.responsible, role: 'Gerente de Projeto', online: true },
    // Add more team members as needed
  ];

  // Create monthly progress data with proper type handling
  const monthlyProgressData = chartData.monthlyProgress.map((data) => {
    // Ensure month is always included
    const result = {
      month: data.month,
      [project.name]: (data as any)[project.name] || 0,
    };
    return result;
  });

  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{project.name}</h1>
          <p className='text-muted-foreground'>{project.description}</p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Novo Documento
        </Button>
      </div>

      {/* KPI Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <KPICard
          title='Progresso'
          value={project.progress}
          icon={FolderKanban}
          iconColor='text-blue-600 dark:text-blue-400'
          iconBgColor='bg-blue-100 dark:bg-blue-900'
          footer={{
            text: `${project.progress}% Completo`,
            color: 'text-blue-600 dark:text-blue-400',
          }}
        />
        {/* Add more KPI cards */}
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <ProjectProgressChart
          data={[{ name: project.name, progress: project.progress }]}
        />
        <MonthlyProgressChart data={monthlyProgressData} />
      </div>

      {/* Recent Documents */}
      <RecentDocuments documents={projectDocuments} />

      {/* Team Members */}
      <TeamMembers members={teamMembers} />
    </div>
  );
}
