import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { projectsData } from '@/lib/mock-data';

interface ProjectsListProps {
  institution: {
    id: string;
    name: string;
    fullName: string;
  };
}

export function ProjectsList({ institution }: ProjectsListProps) {
  const projects = projectsData.filter(project => project.institution === institution.id);

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'delayed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    };
    return statusColors[status] || '';
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      'completed': 'Concluído',
      'in-progress': 'Em Andamento',
      'delayed': 'Atrasado',
      'pending': 'Pendente'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link 
          key={project.id} 
          href={`/${institution.id}/projects/${project.id}`}
          className="transition-transform hover:scale-105"
        >
          <Card>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusDisplay(project.status)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {project.progress}% Completo
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Início: {formatDate(project.startDate, 'dd/MM/yyyy')}</span>
                  <span>Término: {formatDate(project.endDate, 'dd/MM/yyyy')}</span>
                </div>

                <div className="text-sm text-muted-foreground">
                  Responsável: {project.responsible}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}