'use client';

import { useState, useEffect } from 'react';
import { RelatorioIncidenteForm } from '@/components/forms/relatorio-incidente/form';
import { RelatorioIncidente } from '@/lib/types/forms';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

export default function TestFormPage() {
  const searchParams = useSearchParams();

  // Get IDs from URL params or use placeholders
  const tenantId = searchParams.get('tenantId') || undefined;
  const projectId = searchParams.get('projectId') || undefined;

  const [validationError, setValidationError] = useState('');

  // Validate UUIDs if provided
  useEffect(() => {
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (tenantId && !uuidPattern.test(tenantId)) {
      setValidationError('Invalid tenant ID format. UUID format required.');
    } else if (projectId && !uuidPattern.test(projectId)) {
      setValidationError('Invalid project ID format. UUID format required.');
    } else {
      setValidationError('');
    }

    if (tenantId) console.log('Using tenant ID:', tenantId);
    if (projectId) console.log('Using project ID:', projectId);
  }, [tenantId, projectId]);

  const handleSuccess = (data: RelatorioIncidente) => {
    console.log('Form submitted successfully:', data);
    alert('Form submitted successfully!');
  };

  return (
    <div className='container mx-auto py-10'>
      <Card>
        <CardHeader>
          <CardTitle>Test Relatório de Incidente Form</CardTitle>
          <CardDescription>
            You can optionally provide tenant and project IDs in the URL:
            <code className='ml-2 p-1 bg-gray-100 rounded'>
              ?tenantId=uuid&projectId=uuid
            </code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {validationError ? (
            <Alert variant='destructive' className='mb-4'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          ) : !tenantId || !projectId ? (
            <Alert className='mb-4'>
              <Info className='h-4 w-4' />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                No tenant or project IDs provided in URL. You can select them
                from the dropdown menus below.
              </AlertDescription>
            </Alert>
          ) : null}

          <RelatorioIncidenteForm
            tenantId={tenantId}
            projectId={projectId}
            onSuccess={handleSuccess}
            onCancel={() => console.log('Form cancelled')}
            initialData={{
              dataIncidente: new Date(),
              horaIncident: new Date(),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
