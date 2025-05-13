'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export default function ModAs01Page() {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPresignedUrl = async () => {
      try {
        const response = await fetch('/api/presigned', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: 'documents/MOD.AS.01_INSTRUÇÃO DO PROCESSO AIA.doc',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get document URL');
        }

        const data = await response.json();
        setDocumentUrl(data.url);
      } catch (error) {
        console.error('Error fetching document:', error);
        toast.error('Erro ao carregar o documento');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresignedUrl();
  }, []);

  const handleDownload = () => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>MOD.AS.01 - Instrução do Processo da AIAS</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex items-center justify-center p-8'>
              <p>Carregando documento...</p>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center space-y-4 p-8'>
              <p className='text-muted-foreground'>
                Clique no botão abaixo para baixar o documento
              </p>
              <Button onClick={handleDownload} disabled={!documentUrl}>
                <Download className='mr-2 h-4 w-4' />
                Baixar Documento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
