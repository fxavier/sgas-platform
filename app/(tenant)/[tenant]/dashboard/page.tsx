import { INSTITUTIONS } from '@/lib/constants';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

interface DashboardPageProps {
  params: {
    tenant: string;
  };
}

export function generateStaticParams() {
  return INSTITUTIONS.map((institution) => ({
    tenant: institution.id,
  }));
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const institution = INSTITUTIONS.find(inst => inst.id === params.tenant);

  if (!institution) {
    return null;
  }

  return <DashboardContent institution={institution} tenantId={params.tenant} />;
}