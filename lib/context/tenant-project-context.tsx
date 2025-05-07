'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface TenantProjectContextType {
  currentTenantId: string | null;
  currentProjectId: string | null;
  setCurrentTenant: (tenantId: string) => void;
  setCurrentProject: (projectId: string | null) => void;
  clearContext: () => void;
}

// Export the context so it can be accessed directly if needed
export const TenantProjectContext = createContext<
  TenantProjectContextType | undefined
>(undefined);

export const TenantProjectProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Initialize with null and update in useEffect to avoid hydration issues
  const [currentTenantId, setTenantId] = useState<string | null>(null);
  const [currentProjectId, setProjectId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize values from localStorage after component mounts
  useEffect(() => {
    // Get values from localStorage
    const storedTenantId = localStorage.getItem('currentTenantId');
    const storedProjectId = localStorage.getItem('currentProjectId');

    // Check for tenant ID in URL first, then localStorage
    const tenantIdFromUrl = searchParams.get('tenantId');
    const projectIdFromUrl = searchParams.get('projectId');

    // Set initial values giving priority to URL params
    setTenantId(tenantIdFromUrl || storedTenantId);
    setProjectId(projectIdFromUrl || storedProjectId);

    // Mark as initialized to prevent unnecessary re-renders
    setIsInitialized(true);
  }, [searchParams]);

  // Set tenant ID and save to localStorage
  const setCurrentTenant = (tenantId: string) => {
    setTenantId(tenantId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentTenantId', tenantId);
    }

    // Clear project when tenant changes
    setCurrentProject(null);

    // Redirect with tenant param if on a page that requires it
    if (pathname?.includes('/dashboard') || pathname?.includes('/forms')) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('tenantId', tenantId);
      if (currentProjectId) {
        current.delete('projectId');
      }
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`${pathname}${query}`);
    }
  };

  // Set project ID and save to localStorage
  const setCurrentProject = (projectId: string | null) => {
    setProjectId(projectId);
    if (typeof window !== 'undefined') {
      if (projectId) {
        localStorage.setItem('currentProjectId', projectId);
      } else {
        localStorage.removeItem('currentProjectId');
      }
    }

    // Redirect with project param if on a page that requires it
    if (
      projectId &&
      (pathname?.includes('/dashboard') || pathname?.includes('/forms'))
    ) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('projectId', projectId);
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`${pathname}${query}`);
    }
  };

  // Clear context
  const clearContext = () => {
    setTenantId(null);
    setProjectId(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentTenantId');
      localStorage.removeItem('currentProjectId');
    }
  };

  // Don't synchronize URL params with state during initial render
  // to avoid conflicts with the initialization effect
  useEffect(() => {
    if (!isInitialized) return;

    const tenantIdFromUrl = searchParams.get('tenantId');
    const projectIdFromUrl = searchParams.get('projectId');

    if (tenantIdFromUrl && tenantIdFromUrl !== currentTenantId) {
      setTenantId(tenantIdFromUrl);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentTenantId', tenantIdFromUrl);
      }
    }

    if (projectIdFromUrl && projectIdFromUrl !== currentProjectId) {
      setProjectId(projectIdFromUrl);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentProjectId', projectIdFromUrl);
      }
    }
  }, [searchParams, currentTenantId, currentProjectId, isInitialized]);

  return (
    <TenantProjectContext.Provider
      value={{
        currentTenantId,
        currentProjectId,
        setCurrentTenant,
        setCurrentProject,
        clearContext,
      }}
    >
      {children}
    </TenantProjectContext.Provider>
  );
};

export const useTenantProjectContext = () => {
  const context = useContext(TenantProjectContext);
  if (context === undefined) {
    throw new Error(
      'useTenantProjectContext must be used within a TenantProjectProvider'
    );
  }
  return context;
};
