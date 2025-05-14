import { INSTITUTIONS } from '@/lib/constants';
import { projectsData } from '@/lib/mock-data';
import ProjectDashboardClient from '@/app/(tenant)/[tenant]/projects/[projectId]/ProjectDashboardClient';

interface ProjectDashboardProps {
  params: {
    tenant: string;
    projectId: string;
  };
}

// Generate static params for all tenant/project combinations
export function generateStaticParams() {
  return INSTITUTIONS.flatMap((institution) => {
    return projectsData
      .filter((project) => project.institution === institution.id)
      .map((project) => ({
        tenant: institution.id,
        projectId: project.id,
      }));
  });
}

export default function ProjectDashboard({ params }: ProjectDashboardProps) {
  return <ProjectDashboardClient params={params} />;
}
