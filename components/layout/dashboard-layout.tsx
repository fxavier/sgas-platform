'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { Footer } from './footer';
import { TenantProjectProvider } from '@/lib/context/tenant-project-context';

interface DashboardLayoutProps {
  children: React.ReactNode;
  tenant?: string;
}

export function DashboardLayout({ children, tenant }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Use provided tenant prop directly
  const activeTenant = tenant;

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col'>
      <Sidebar isOpen={sidebarOpen} tenant={activeTenant} />

      <Topbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      <main
        className={cn(
          'flex-1 transition-all duration-300 ease-in-out pt-16',
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        )}
      >
        <div className='container mx-auto p-4 md:p-6'>{children}</div>
      </main>

      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        )}
      >
        <Footer />
      </div>
    </div>
  );
}
