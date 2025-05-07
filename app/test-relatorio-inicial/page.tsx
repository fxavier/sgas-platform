'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function TestRelatorioInicialPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testData = {
    tipoIncidente: 'OCORRENCIA_PERIGOSA',
    dataIncidente: new Date(),
    horaIncidente: new Date(),
    dataComunicacao: new Date(),
    dataCriacao: new Date(),
    data: new Date(),
    tenantId: '6a7252df-8330-4db2-8500-7be693ac39ab',
    projectId: '2a3bff0a-f73b-4e3f-b92f-999303e2f0be',
    seccao: 'Teste',
    localIncidente: 'Local teste',
    supervisor: 'Supervisor teste',
    empregado: 'SIM',
    nomeFuncionario: 'Funcionário teste',
    subcontratante: 'SIM',
    nomeSubcontratado: 'Subcontratado teste',
    descricaoCircunstanciaIncidente: 'Descrição teste',
    infoSobreFeriodosETratamentoFeito: 'Informações teste',
    declaracaoDeTestemunhas: 'Declaração teste',
    conclusaoPreliminar: 'Conclusão teste',
    recomendacoes: 'Recomendações teste',
    inclusaoEmMateriaSeguranca: 'Inclusão teste',
    prazo: new Date(),
    necessitaDeInvestigacaoAprofundada: 'SIM',
    incidenteReportavel: 'SIM',
    credoresObrigadosASeremNotificados: 'SIM',
    autorDoRelatorio: 'Autor teste',
    nomeProvedor: 'Provedor teste',
  };

  const testValidationEndpoint = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        '/api/forms/relatorio-inicial-incidente/test',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Test error:', error);
      setError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  const testActualEndpoint = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/forms/relatorio-inicial-incidente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Test error:', error);
      setError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto py-10'>
      <Card>
        <CardHeader>
          <CardTitle>Teste RelatorioInicialIncidente</CardTitle>
          <CardDescription>
            Página para testar o endpoint de RelatorioInicialIncidente
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex space-x-4'>
            <Button onClick={testValidationEndpoint} disabled={loading}>
              {loading
                ? 'Testando...'
                : 'Testar Validação (Sem Banco de Dados)'}
            </Button>

            <Button
              onClick={testActualEndpoint}
              disabled={loading}
              variant='destructive'
            >
              {loading
                ? 'Testando...'
                : 'Testar Endpoint Real (Com Banco de Dados)'}
            </Button>
          </div>

          {error && (
            <div className='bg-red-50 p-4 rounded-md text-red-600 border border-red-200'>
              <p className='font-semibold'>Erro:</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className='bg-gray-50 p-4 rounded-md border'>
              <p className='font-semibold'>Resultado:</p>
              <pre className='mt-2 overflow-auto text-sm'>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
