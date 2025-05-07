'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { 
  BarChart4,
  CalendarDays, 
  FileText, 
  FolderKanban, 
  Plus, 
  TrendingUp,
} from 'lucide-react';
import { projectsData, documentsData, chartData } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/dashboard/kpi-card';
import { ProjectProgressChart } from '@/components/dashboard/project-progress-chart';
import { ProjectStatusChart } from '@/components/dashboard/project-status-chart';
import { MonthlyProgressChart } from '@/components/dashboard/monthly-progress-chart';
import { ProjectsTable } from '@/components/dashboard/projects-table';
import { RecentDocuments } from '@/components/dashboard/recent-documents';
import { TeamMembers } from '@/components/dashboard/team-members';
import { Institution } from '@/lib/constants';

interface DashboardContentProps {
  institution: Institution;
  tenantId: string;
}

export function DashboardContent({ institution, tenantId }: DashboardContentProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  // Filter data for this institution
  const institutionProjects = projectsData.filter(p => p.institution === tenantId);
  const institutionDocuments = documentsData.filter(d => d.institution === tenantId);

  // Mock KPI data
  const kpiData = {
    activeProjects: institutionProjects.filter(p => p.status === 'in-progress').length,
    completedProjects: institutionProjects.filter(p => p.status === 'completed').length,
    recentDocuments: institutionDocuments.slice(0, 5).length,
    pendingNotifications: 3,
  };

  const teamMembers = [
    { name: 'Carlos Oliveira', role: 'Gerente de Projetos', online: true },
    { name: 'Ana Silva', role: 'Especialista Ambiental', online: true },
    { name: 'Manuel Costa', role: 'Engenheiro Hídrico', online: false },
    { name: 'Luísa Mendes', role: 'Coordenadora Social', online: true },
    { name: 'João Ferreira', role: 'Analista de Dados', online: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel de Gestão de Projetos SGAS</h1>
          <p className="text-muted-foreground">
            Monitoramento e acompanhamento de projetos ambientais e sociais
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Projetos Ativos"
          value={kpiData.activeProjects}
          icon={FolderKanban}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBgColor="bg-blue-100 dark:bg-blue-900"
          link={{
            href: "/projects",
            text: "Ver todos os projetos"
          }}
        />
        <KPICard
          title="Projetos Concluídos"
          value={kpiData.completedProjects}
          icon={TrendingUp}
          iconColor="text-green-600 dark:text-green-400"
          iconBgColor="bg-green-100 dark:bg-green-900"
          footer={{
            text: "↑ 1 no último mês",
            color: "text-green-600 dark:text-green-400"
          }}
        />
        <KPICard
          title="Documentos Recentes"
          value={kpiData.recentDocuments}
          icon={FileText}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBgColor="bg-purple-100 dark:bg-purple-900"
          link={{
            href: "/documents",
            text: "Ver todos os documentos"
          }}
        />
        <KPICard
          title="Notificações Pendentes"
          value={kpiData.pendingNotifications}
          icon={CalendarDays}
          iconColor="text-yellow-600 dark:text-yellow-400"
          iconBgColor="bg-yellow-100 dark:bg-yellow-900"
          footer={{
            text: "2 próximos de vencer",
            color: "text-yellow-600 dark:text-yellow-400"
          }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectProgressChart data={chartData.projectProgress.filter(p => p.name.includes(institution.name))} />
        <ProjectStatusChart data={chartData.projectStatus} />
      </div>

      {/* Monthly Progress Chart */}
      <MonthlyProgressChart data={chartData.monthlyProgress} />

      {/* Projects Table */}
      <ProjectsTable projects={institutionProjects.slice(0, 5)} />

      {/* Recent Documents */}
      <RecentDocuments documents={institutionDocuments.slice(0, 6)} />

      {/* Team Members */}
      <TeamMembers members={teamMembers} />
    </div>
  );
}