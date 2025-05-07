import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { notFound } from 'next/navigation';
import { INSTITUTIONS } from '@/lib/constants';

interface TenantLayoutProps {
  children: React.ReactNode;
  params: {
    tenant: string;
  };
}

export default function TenantLayout({ children, params }: TenantLayoutProps) {
  // Validate tenant
  const isValidTenant = INSTITUTIONS.some((inst) => inst.id === params.tenant);
  if (!isValidTenant) {
    notFound();
  }

  return <DashboardLayout tenant={params.tenant}>{children}</DashboardLayout>;
}
