import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ManagementProgramPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PR.AS.013 - Procedimento de gestão de patrimonio cultural</CardTitle>
        <CardDescription>
          Procedimento para gestão e preservação do patrimônio cultural durante a execução dos projetos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Este procedimento estabelece diretrizes e práticas para identificar, proteger e gerenciar 
            elementos do patrimônio cultural que possam ser afetados durante a implementação dos projetos.
          </p>

          <h3>Documentos Relacionados</h3>
          <ul>
            <li>Política Ambiental e Social</li>
            <li>Plano de Gestão Ambiental e Social</li>
            <li>Procedimentos de Avaliação de Impacto</li>
          </ul>

          <h3>Responsabilidades</h3>
          <ul>
            <li>Coordenador Ambiental e Social</li>
            <li>Equipe de Gestão de Projetos</li>
            <li>Especialistas em Patrimônio Cultural</li>
            <li>Contratados e Subcontratados</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}