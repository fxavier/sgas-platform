// prisma/seed.ts

import { PrismaClient, Eficacia } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Check if tenants already exist
  let tenant = await prisma.tenant.findUnique({
    where: { slug: 'aias' },
  });

  // Create tenant if it doesn't exist
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'AIAS',
        slug: 'aias',
        description: 'AIAS',
      },
    });
    console.log('Created tenant AIAS');
  } else {
    console.log('Tenant AIAS already exists');
  }

  // Check if second tenant exists
  let tenant2 = await prisma.tenant.findUnique({
    where: { slug: 'dnaas' },
  });

  // Create second tenant if it doesn't exist
  if (!tenant2) {
    tenant2 = await prisma.tenant.create({
      data: {
        name: 'DNAAS',
        slug: 'dnaas',
        description: 'DNAAS',
      },
    });
    console.log('Created tenant DNAAS');
  } else {
    console.log('Tenant DNAAS already exists');
  }

  // Check if projects already exist for AIAS
  let project1 = await prisma.project.findFirst({
    where: {
      name: 'Aguas seguras',
      tenantId: tenant.id,
    },
  });

  // Create first project if it doesn't exist
  if (!project1) {
    project1 = await prisma.project.create({
      data: {
        name: 'Aguas seguras',
        description: 'Aguas seguras',
        tenantId: tenant.id,
      },
    });
    console.log('Created project Aguas seguras');
  } else {
    console.log('Project Aguas seguras already exists');
  }

  // Check if second project exists
  let project2 = await prisma.project.findFirst({
    where: {
      name: 'CERP',
      tenantId: tenant.id,
    },
  });

  // Create second project if it doesn't exist
  if (!project2) {
    project2 = await prisma.project.create({
      data: {
        name: 'CERP',
        description:
          'Projeto de reflorestamento e conservação no Parque Nacional da Gorongosa',
        tenantId: tenant.id,
      },
    });
    console.log('Created project CERP');
  } else {
    console.log('Project CERP already exists');
  }

  // Check if projects already exist for DNAAS
  let project3 = await prisma.project.findFirst({
    where: {
      name: 'Saneamento Urbano',
      tenantId: tenant2.id,
    },
  });

  // Create projects for DNAAS if they don't exist
  if (!project3) {
    project3 = await prisma.project.create({
      data: {
        name: 'Saneamento Urbano',
        description:
          'Projeto de melhoria do sistema de saneamento na cidade de Maputo',
        tenantId: tenant2.id,
      },
    });
    console.log('Created project Saneamento Urbano');
  } else {
    console.log('Project Saneamento Urbano already exists');
  }

  let project4 = await prisma.project.findFirst({
    where: {
      name: 'Gestão de Resíduos',
      tenantId: tenant2.id,
    },
  });

  if (!project4) {
    project4 = await prisma.project.create({
      data: {
        name: 'Gestão de Resíduos',
        description:
          'Projeto de implementação de sistema de gestão de resíduos sólidos',
        tenantId: tenant2.id,
      },
    });
    console.log('Created project Gestão de Resíduos');
  } else {
    console.log('Project Gestão de Resíduos already exists');
  }

  // Create users
  const user1 = await prisma.user.create({
    data: {
      clerkUserId: 'user_' + uuidv4().substring(0, 8),
      email: 'joao.silva@ambientech.mz',
      name: 'João Silva',
      imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      tenantId: tenant.id,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      clerkUserId: 'user_' + uuidv4().substring(0, 8),
      email: 'maria.santos@ambientech.mz',
      name: 'Maria Santos',
      imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      tenantId: tenant.id,
    },
  });

  // Create transactions
  await prisma.transaction.create({
    data: {
      text: 'Compra de equipamento de monitorização ambiental',
      amount: 15000,
      userId: user1.id,
      tenantId: tenant.id,
      projectId: project1.id,
    },
  });

  await prisma.transaction.create({
    data: {
      text: 'Despesas com formação da equipa',
      amount: 5000,
      userId: user2.id,
      tenantId: tenant.id,
      projectId: project2.id,
    },
  });

  // Create areas de treinamento (training areas)
  const areasTreinamento = await Promise.all([
    prisma.areaTreinamento.create({
      data: {
        name: 'Identificação de Perigos / DSTI / Avaliação de Riscos',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Investigação de incidentes e relatórios',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Material perigoso/ Derramamento/ Enchimento de combustível/ Higiene industrial',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Conservação Auditiva / Proteção Respiratória',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Plano de Resposta a Emergências',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Combate a incêndios',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Condução Defensiva',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Primeiros Socorros',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Rigging, Elevação e carga, Transporte, Linhas elétricas aéreas 07',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Segurança da empilhadeira, manlift, Flagman',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Escavação',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Trabalho em altura',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Espaço Confinado',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Segurança química, FDSM',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Segurança Elétrica Básica',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Proteção contra quedas',
        tenantId: tenant.id,
      },
    }),
    prisma.areaTreinamento.create({
      data: {
        name: 'Autorização de trabalho',
        tenantId: tenant.id,
      },
    }),
  ]);

  // Create caixas de ferramentas (toolboxes)
  const caixasFerramentas = await Promise.all([
    prisma.caixaFerramentas.create({
      data: {
        name: 'Higiene',
        tenantId: tenant.id,
      },
    }),
    prisma.caixaFerramentas.create({
      data: {
        name: 'Stress térmico',
        tenantId: tenant.id,
      },
    }),
    prisma.caixaFerramentas.create({
      data: {
        name: 'Demolição',
        tenantId: tenant.id,
      },
    }),
    prisma.caixaFerramentas.create({
      data: {
        name: 'Encordoamento',
        tenantId: tenant.id,
      },
    }),
    prisma.caixaFerramentas.create({
      data: {
        name: 'Hidrotese',
        tenantId: tenant.id,
      },
    }),
    prisma.caixaFerramentas.create({
      data: {
        name: 'Escadas',
        tenantId: tenant.id,
      },
    }),
    prisma.caixaFerramentas.create({
      data: {
        name: 'Escorregões e Tropeções',
        tenantId: tenant.id,
      },
    }),
    prisma.caixaFerramentas.create({
      data: {
        name: 'Proteção de máquinas',
        tenantId: tenant.id,
      },
    }),
  ]);

  // Create funções (roles)
  const funcoes = await Promise.all([
    prisma.funcao.create({
      data: {
        name: 'Gestor de Projecto',
        tenantId: tenant.id,
      },
    }),
    prisma.funcao.create({
      data: {
        name: 'Coordenador Ambiental',
        tenantId: tenant.id,
      },
    }),
    prisma.funcao.create({
      data: {
        name: 'Técnico de Saúde e Segurança',
        tenantId: tenant.id,
      },
    }),
    prisma.funcao.create({
      data: {
        name: 'Engenheiro Ambiental',
        tenantId: tenant.id,
      },
    }),
    prisma.funcao.create({
      data: {
        name: 'Trabalhador de Campo',
        tenantId: tenant.id,
      },
    }),
  ]);

  // Create matriz de treinamento (training matrix) for project 1
  const matrizesProject1 = await Promise.all([
    prisma.matrizTreinamento.create({
      data: {
        data: new Date('2025-01-15'),
        funcaoId: funcoes[0].id,
        areaTreinamentoId: areasTreinamento[0].id,
        caixaFerramentasId: caixasFerramentas[0].id,
        totais_palestras: 4,
        total_horas: 16,
        total_caixa_ferramentas: 2,
        total_pessoas_informadas_caixa_ferramentas: 12,
        eficacia: Eficacia.Eficaz,
        aprovado_por: 'Carlos Mendes',
        tenantId: tenant.id,
        projectId: project1.id,
      },
    }),
    prisma.matrizTreinamento.create({
      data: {
        data: new Date('2025-02-10'),
        funcaoId: funcoes[1].id,
        areaTreinamentoId: areasTreinamento[1].id,
        caixaFerramentasId: caixasFerramentas[2].id,
        totais_palestras: 6,
        total_horas: 24,
        total_caixa_ferramentas: 3,
        total_pessoas_informadas_caixa_ferramentas: 18,
        eficacia: Eficacia.Eficaz,
        aprovado_por: 'Ana Cristina',
        tenantId: tenant.id,
        projectId: project1.id,
      },
    }),
    prisma.matrizTreinamento.create({
      data: {
        data: new Date('2025-03-05'),
        funcaoId: funcoes[2].id,
        areaTreinamentoId: areasTreinamento[2].id,
        caixaFerramentasId: caixasFerramentas[1].id,
        totais_palestras: 3,
        total_horas: 12,
        total_caixa_ferramentas: 2,
        total_pessoas_informadas_caixa_ferramentas: 10,
        eficacia: Eficacia.Nao_Eficaz,
        accoes_treinamento_nao_eficaz:
          'Necessário reforçar os procedimentos práticos de primeiros socorros',
        aprovado_por: 'Filipe Teixeira',
        tenantId: tenant.id,
        projectId: project1.id,
      },
    }),
  ]);

  // Create matriz de treinamento (training matrix) for project 2
  const matrizesProject2 = await Promise.all([
    prisma.matrizTreinamento.create({
      data: {
        data: new Date('2025-01-20'),
        funcaoId: funcoes[3].id,
        areaTreinamentoId: areasTreinamento[3].id,
        caixaFerramentasId: caixasFerramentas[3].id,
        totais_palestras: 5,
        total_horas: 20,
        total_caixa_ferramentas: 4,
        total_pessoas_informadas_caixa_ferramentas: 15,
        eficacia: Eficacia.Eficaz,
        aprovado_por: 'Teresa Lopes',
        tenantId: tenant.id,
        projectId: project2.id,
      },
    }),
    prisma.matrizTreinamento.create({
      data: {
        data: new Date('2025-02-25'),
        funcaoId: funcoes[4].id,
        areaTreinamentoId: areasTreinamento[4].id,
        caixaFerramentasId: caixasFerramentas[4].id,
        totais_palestras: 8,
        total_horas: 32,
        total_caixa_ferramentas: 5,
        total_pessoas_informadas_caixa_ferramentas: 24,
        eficacia: Eficacia.Nao_Eficaz,
        accoes_treinamento_nao_eficaz:
          'Necessário melhorar a comunicação de riscos em situações de emergência',
        aprovado_por: 'Pedro Costa',
        tenantId: tenant.id,
        projectId: project2.id,
      },
    }),
  ]);

  // Create incidentes (incidents)
  const incidente1 = await prisma.incidente.create({
    data: {
      descricao: 'Derramamento de óleo durante manutenção de equipamento',
      tenantId: tenant.id,
    },
  });

  const incidente2 = await prisma.incidente.create({
    data: {
      descricao:
        'Queda de altura durante instalação de equipamento de monitorização',
      tenantId: tenant.id,
    },
  });

  // Create relatório inicial de incidente (initial incident report)
  await prisma.relatorioInicialIncidente.create({
    data: {
      dataIncidente: new Date('2025-03-15'),
      horaIncidente: new Date('2025-03-15T09:30:00Z'),
      seccao: 'Sector Norte',
      localIncidente: 'Área de manutenção',
      dataComunicacao: new Date('2025-03-15'),
      supervisor: 'José Machado',
      empregado: 'SIM',
      nomeFuncionario: 'António Fernandes',
      descricaoCircunstanciaIncidente:
        'Durante a manutenção de um gerador, ocorreu um derramamento de óleo que atingiu o solo próximo à área de trabalho.',
      infoSobreFeriodosETratamentoFeito:
        'Não houve feridos. A área foi contida e o solo contaminado foi removido conforme procedimentos.',
      recomendacoes:
        'Reforçar os procedimentos de manutenção e equipar a área com mais kits de contenção de derramamento.',
      necessitaDeInvestigacaoAprofundada: 'SIM',
      incidenteReportavel: 'SIM',
      credoresObrigadosASeremNotificados: 'NAO',
      dataCriacao: new Date('2025-03-15'),
      nomeProvedor: 'AmbienTech Segurança',
      data: new Date('2025-03-16'),
      tenantId: tenant.id,
      projectId: project1.id,
      tipoIncidente: 'INCIDENTE_AMBIENTAL',
      incidentes: {
        create: {
          assignedAt: new Date(),
          incidenteId: incidente1.id,
        },
      },
    },
  });

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed');
  });
