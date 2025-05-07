'use client';

import React from 'react';
import { TenantProjectSelector } from '@/components/tenant-project-selector';

// Use the self-contained TenantProjectSelector which handles its own context requirements
export function ContextSwitcher() {
  return <TenantProjectSelector />;
}
