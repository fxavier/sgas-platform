export const APP_NAME = 'SGAS';
export const APP_DESCRIPTION = 'Sistema de Gestão Ambiental e Social';

export type Institution = 'aias' | 'dnaas';

export const INSTITUTIONS = [
  {
    id: 'aias',
    name: 'AIAS, IP',
    fullName: 'Administração de Infraestruturas de Água e Saneamento',
    projects: [
      { id: 'agua-segura', name: 'Projeto Água Segura' },
      { id: 'saneamento-urbano', name: 'Projeto de Saneamento Urbano' },
      { id: 'cerrp', name: 'Projeto CERRP' },
    ],
  },
  {
    id: 'dnaas',
    name: 'DNAAS',
    fullName: 'Direção Nacional de Abastecimento de Água e Saneamento',
    projects: [
      { id: 'agua-segura', name: 'Projeto Água Segura' },
      { id: 'project-x', name: 'Projeto XXXX' },
      { id: 'project-y', name: 'Projeto XXXXX' },
    ],
  },
];

export const STATUS_COLORS = {
  completed:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'in-progress':
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  delayed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  pending:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

export const NAV_ITEMS = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    title: 'ESMS Documents',
    href: '/esms-documents',
    icon: 'FileText',
    submenu: [
      {
        title: 'Policies',
        href: '/esms-documents/policies',
      },
      {
        title: 'Manuals',
        href: '/esms-documents/manuals',
      },
      {
        title: 'Procedures',
        href: '/esms-documents/procedures',
      },
      {
        title: 'Forms',
        href: '/esms-documents/forms',
      },
      {
        title: 'Models',
        href: '/esms-documents/models',
      },
    ],
  },
  {
    title: 'ESMS Elements',
    href: '/esms-elements',
    icon: 'FileStack',
    submenu: [
      {
        title: 'Policy',
        href: '/esms-elements/policy',
        submenu: [
          {
            title: 'PO.AS.001 - Environmental and Social Policy',
            href: '/esms-elements/policy/po-as-001',
          },
        ],
      },
      {
        title: 'ES Risks and Impacts Identification',
        href: '/esms-elements/risks-impacts',
        submenu: [
          {
            title:
              'PR.AS.002 - Procedimentos de gestão de impactos ambientais e sociais',
            href: '/esms-elements/risks-impacts/pr-as-002',
            submenu: [
              {
                title:
                  'FR.AS.002 - Identificação e Avaliação de impactos e riscos ambientais e sociais',
                href: '/esms-elements/identification-of-risks-impacts/pr-as-002/fr-as-002',
              },
            ],
          },
          {
            title:
              'PR.AS.003 - Procedimento de identificação e elaboração de instrumentos ambientais e sociais de subprojectos',
            href: '/esms-elements/risks-impacts/pr-as-003',
            submenu: [
              {
                title: 'FR.AS.003 - Controle de requisitos legais',
                href: '/esms-elements/risks-impacts/pr-as-003/fr-as-003',
              },
            ],
          },
          {
            title: 'PR.AS.004 - Procedimento de gestão da conformidade legal',
            href: '/esms-elements/risks-impacts/pr-as-004',
            submenu: [
              {
                title: 'FR.AS.023 - Controle de requisitos legais',
                href: '/esms-elements/risks-impacts/pr-as-004/fr-as-023',
              },
              {
                title: 'MOD.AS.01 - Instrução do processo de AIA',
                href: '/esms-elements/risks-impacts/pr-as-004/mod-as-01',
              },
              {
                title: 'MOD.AS.02 - Ficha de informação ambiental preliminar',
                href: '/esms-elements/risks-impacts/pr-as-004/mod-as-02',
              },
            ],
          },
        ],
      },
      {
        title: 'Management Programs',
        href: '/esms-elements/management-programs',
        submenu: [
          {
            title:
              'PR.AS.005 - Procedimento de estabelecimento e manutenção de objectivos do plano de gestão ambiental e social',
            href: '/esms-elements/management-programs/pr-as-005',
            submenu: [
              {
                title:
                  'FR.AS.020 - Registo do objectivos e metas ambientais e sociais',
                href: '/esms-elements/management-programs/pr-as-005/fr-as-020',
              },
            ],
          },
          {
            title:
              'PR.AS.011 - Procedimento de avaliação risco e plano de acção de violencia baseada no genero',
            href: '/esms-elements/management-programs/pr-as-011',
            submenu: [
              {
                title: 'FR.AS.009 - Relatório de acidente_incidente',
                href: '/esms-elements/management-programs/pr-as-011/fr-as-009',
              },
            ],
          },
          {
            title:
              'PR.AS.012 - Procedimento de gestão de saúde e segurança operacional',
            href: '/esms-elements/management-programs/pr-as-012',
            submenu: [
              {
                title: 'FR.AS.028 - Relatorio inicial de incidente',
                href: '/esms-elements/management-programs/pr-as-012/fr-as-028',
              },
            ],
          },
          {
            title: 'PR.AS.013 - Procedimento de gestão de patrimonio cultural',
            href: '/esms-elements/management-programs/pr-as-013',
          },
          {
            title: 'PR.AS.015 - Procedimento de gestão de mão de obra',
            href: '/esms-elements/management-programs/pr-as-015',
          },
          {
            title:
              'PR.AS.016 - Procedimento de Gestao Ambiental e Social das contratadas',
            href: '/esms-elements/management-programs/pr-as-016',
          },
          {
            title:
              'PR.AS.017 - Procedimento de Comunicação e Investigação de Incidentes',
            href: '/esms-elements/management-programs/pr-as-017',
          },
        ],
      },
      {
        title: 'Organizational capacity and Competence',
        href: '/esms-elements/organizational-capacity-and-competence',
        submenu: [
          {
            title:
              'PR.AS.006 - Procedimento de capacidades e competencias organizacionais',
            href: '/esms-elements/organizational-capacity-and-competence/pr-as-006',
            submenu: [
              {
                title:
                  'FR.AS.005 - Matriz de Identificacao das necessidades de treinamento ',
                href: '/esms-elements/organizational-capacity-and-competence/pr-as-006/fr-as-005',
              },
            ],
          },
        ],
      },
      {
        title: 'Emergency preparedness and response',
        href: '/esms-elements/emergency-preparedness-and-response',
        submenu: [
          {
            title: 'PR.AS.007 - Procedimento de gestão de emergências',
            href: '/esms-elements/emergency-preparedness-and-response/pr-as-018',
            submenu: [
              {
                title: 'FR.AS.010 - Relatório de simulacro ',
                href: '/esms-elements/emergency-preparedness-and-response/pr-as-018/fr-as-010',
              },
            ],
          },
        ],
      },
      {
        title: 'Stakeholders Engagement',
        href: '/esms-elements/stakeholders-engagement',
        submenu: [
          {
            title: 'PR.AS.008 - Engajamento das partes interessadas',
            href: '/esms-elements/stakeholders-engagement/pr-as-008',
            submenu: [
              {
                title: 'FR.AS.019 - Mapeamento  das partes interessadas ',
                href: '/esms-elements/stakeholders-engagement/pr-as-008/fr-as-019',
              },
            ],
          },
        ],
      },
      {
        title: 'External Communication and Grievance mechanism',
        href: '/esms-elements/external-communication-and-grievance-mechanism',
        submenu: [
          {
            title: 'PR.AS.009 - Mecanismo de queixas e reclamações',
            href: '/esms-elements/external-communication-and-grievance-mechanism/pr-as-009',
            submenu: [
              {
                title:
                  'FR.AS.013 - Controlo de queixas, reclamações e não conformidades',
                href: '/esms-elements/external-communication-and-grievance-mechanism/pr-as-009/fr-as-011',
              },
              {
                title:
                  'FR.AS.025 - Formulario de apresentação de queixas e reclamações',
                href: '/esms-elements/external-communication-and-grievance-mechanism/pr-as-009/fr-as-025',
              },
              {
                title: 'FR.AS.026 - Ficha de registo de queixas e reclamações',
                href: '/esms-elements/external-communication-and-grievance-mechanism/pr-as-009/fr-as-026',
              },
              {
                title:
                  'FR.AS.033 - formulario de registo de reclamacoes dos trabalhadores',
                href: '/esms-elements/external-communication-and-grievance-mechanism/pr-as-009/fr-as-033',
              },
            ],
          },
        ],
      },
      {
        title: 'Ongoing reporting to affected communities ',
        href: '/esms-elements/ongoing-reporting-to-affected-communities',
        submenu: [
          {
            title:
              'PR.AS.010 - Comunicação, Dialogo e Relatórias as Partes Afectadas ',
            href: '/esms-elements/ongoing-reporting-to-affected-communities/pr-as-010',
          },
        ],
      },
      {
        title: 'Monitoring and Review',
        href: '/esms-elements/monitoring-and-review',
        submenu: [
          {
            title: 'PR.AS.014 - Monitoria e revisão',
            href: '/esms-elements/monitoring-and-review/pr-as-014',
            submenu: [
              {
                title: 'FR.AS.016 - Relatório de Auditoria  ',
                href: '/esms-elements/monitoring-and-review/pr-as-014/fr-as-016',
              },
              {
                title:
                  'FR.AS.036 - Minutas do comité de gestao ambiental e social',
                href: '/esms-elements/monitoring-and-review/pr-as-014/fr-as-036',
              },
            ],
          },
        ],
      },
    ],
  },
];
