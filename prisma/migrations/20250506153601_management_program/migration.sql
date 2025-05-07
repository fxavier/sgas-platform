-- CreateEnum
CREATE TYPE "RespostaSimNao" AS ENUM ('SIM', 'NAO');

-- CreateEnum
CREATE TYPE "TipoFuncionario" AS ENUM ('CONTRATADO', 'INCIDENTE_DE_TERCEIROS');

-- CreateEnum
CREATE TYPE "FormaActividade" AS ENUM ('CONTROLADA', 'NAO_CONTROLADA', 'MONITORADA');

-- CreateEnum
CREATE TYPE "EfeitosIncidente" AS ENUM ('SAUDE', 'SEGURANCA', 'AMBIENTE', 'COMUNIDADE');

-- CreateEnum
CREATE TYPE "TipoIncidente" AS ENUM ('FATALIDADE', 'OCORRENCIA_PERIGOSA', 'INCIDENTE_QUASE_ACIDENTE', 'TEMPO_PERDIDO', 'INCIDENTE_AMBIENTAL', 'SEGURANCA', 'RECLAMACAO_EXTERNA', 'NOTIFICACAO_DO_REGULADOR_VIOLACAO', 'DERAMAMENTO_LBERACAO_DESCONTROLADA', 'DANOS_PERDAS', 'FLORA_FAUNA', 'AUDITORIA_NAO_CONFORMIDADE');

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoas_envolvidas_investigacao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "pessoas_envolvidas_investigacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accoes_correctivas_permanentes" (
    "id" TEXT NOT NULL,
    "accao" TEXT,
    "prazo" TIMESTAMP(3),
    "responsavel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "accoes_correctivas_permanentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fotografias_incidente" (
    "id" TEXT NOT NULL,
    "fotografia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "fotografias_incidente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membros_equipa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "membros_equipa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tabela_accoes" (
    "id" TEXT NOT NULL,
    "accao" TEXT NOT NULL,
    "pessoaResponsavel" TEXT NOT NULL,
    "prazo" TIMESTAMP(3) NOT NULL,
    "dataConclusao" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "tabela_accoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidentes" (
    "id" TEXT NOT NULL,
    "descricao" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "incidentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorios_incidente" (
    "id" TEXT NOT NULL,
    "dataIncidente" TIMESTAMP(3) NOT NULL,
    "horaIncident" TIME(6) NOT NULL,
    "descricaoDoIncidente" TEXT NOT NULL,
    "detalhesLesao" TEXT NOT NULL,
    "accoesImediatasTomadas" TEXT NOT NULL,
    "tipoFuncionario" "TipoFuncionario" NOT NULL,
    "categoriaPessoaEnvolvida" TEXT NOT NULL,
    "formaActividade" "FormaActividade" NOT NULL,
    "foiRealizadaAvaliacaoRisco" "RespostaSimNao" NOT NULL,
    "existePadraoControleRisco" "RespostaSimNao" NOT NULL,
    "tipoConsequenciaIncidenteReal" TEXT,
    "tipoConsequenciaIncidentePotencial" TEXT,
    "efeitosIncidenteReal" "EfeitosIncidente" NOT NULL,
    "classificacaoGravidadeIncidenteReal" TEXT,
    "efeitosIncidentePotencial" "EfeitosIncidente",
    "classificacaoGravidadeIncidentePotencial" TEXT,
    "esteFoiIncidenteSemBarreira" "RespostaSimNao" NOT NULL,
    "foiIncidenteRepetitivo" "RespostaSimNao" NOT NULL,
    "foiIncidenteResultanteFalhaProcesso" "RespostaSimNao" NOT NULL,
    "danosMateriais" "RespostaSimNao" NOT NULL,
    "valorDanos" DECIMAL(10,2),
    "statusInvestigacao" TEXT,
    "dataInvestigacaoCompleta" TIMESTAMP(3),
    "ausenciaOuFalhaDefesas" "RespostaSimNao",
    "descricaoAusenciaOuFalhaDefesas" TEXT,
    "accoesIndividuaisOuEquipe" TEXT,
    "descricaoAccaoIndividualOuEquipe" TEXT,
    "tarefaOuCondicoesAmbientaisLocalTrabalho" TEXT,
    "descricaoTarefaOuCondicoesAmbientaisLocalTrabalho" TEXT,
    "tarefaOuCondicoesAmbientaisHumano" TEXT,
    "descricaoTarefaOuCondicoesAmbientaisHumano" TEXT,
    "factoresOrganizacionais" TEXT,
    "descricaoFactoresOrganizacionais" TEXT,
    "causasSubjacentesEPrincipaisFactoresContribuintes" TEXT,
    "descricaoIncidenteAposInvestigacao" TEXT,
    "principaisLicoes" TEXT,
    "resgistoRiscoActivosActualizadosAposInvestigacao" "RespostaSimNao",
    "voceCompartilhouAprendizadoDesteEventoComRestanteOrganizacao" "RespostaSimNao",
    "comoPartilhou" TEXT,
    "superiorHierarquicoResponsavel" TEXT,
    "telefoneSuperiorHierarquicoResponsavel" TEXT,
    "tituloSuperiorHierarquicoResponsavel" TEXT,
    "emailSuperiorHierarquicoResponsavel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "relatorios_incidente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objetivos_metas_ambientais_sociais" (
    "id" TEXT NOT NULL,
    "numeroRefOAndM" TEXT NOT NULL,
    "aspetoRefNumero" TEXT NOT NULL,
    "centroCustos" TEXT NOT NULL,
    "objectivo" TEXT NOT NULL,
    "publicoAlvo" TEXT NOT NULL,
    "orcamentoRecursos" TEXT NOT NULL,
    "refDocumentoComprovativo" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataConclusaoPrevista" TIMESTAMP(3) NOT NULL,
    "dataConclusaoReal" TIMESTAMP(3) NOT NULL,
    "pgasAprovadoPor" TEXT NOT NULL,
    "dataAprovacao" TIMESTAMP(3) NOT NULL,
    "observacoes" TEXT NOT NULL,
    "oAndMAlcancadoFechado" "RespostaSimNao" NOT NULL,
    "assinaturaDirectorGeral" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "objetivos_metas_ambientais_sociais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorios_iniciais_incidente" (
    "id" TEXT NOT NULL,
    "dataIncidente" TIMESTAMP(3) NOT NULL,
    "seccao" VARCHAR(100),
    "localIncidente" TEXT NOT NULL,
    "dataComunicacao" TIMESTAMP(3) NOT NULL,
    "supervisor" VARCHAR(100) NOT NULL,
    "empregado" "RespostaSimNao",
    "nomeFuncionario" VARCHAR(100),
    "subcontratante" "RespostaSimNao",
    "nomeSubcontratado" VARCHAR(100),
    "descricaoCircunstanciaIncidente" TEXT NOT NULL,
    "infoSobreFeriodosETratamentoFeito" TEXT NOT NULL,
    "declaracaoDeTestemunhas" TEXT,
    "conclusaoPreliminar" TEXT,
    "recomendacoes" TEXT NOT NULL,
    "inclusaoEmMateriaSeguranca" VARCHAR(100),
    "prazo" TIMESTAMP(3),
    "necessitaDeInvestigacaoAprofundada" "RespostaSimNao" NOT NULL,
    "incidenteReportavel" "RespostaSimNao" NOT NULL,
    "credoresObrigadosASeremNotificados" "RespostaSimNao" NOT NULL,
    "autorDoRelatorio" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL,
    "nomeProvedor" VARCHAR(100) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "tipoIncidente" "TipoIncidente" NOT NULL,
    "horaIncidente" TIME(6) NOT NULL,

    CONSTRAINT "relatorios_iniciais_incidente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorio_incidente_pessoas_envolvidas" (
    "relatorioIncidenteId" TEXT NOT NULL,
    "pessoaEnvolvidaId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relatorio_incidente_pessoas_envolvidas_pkey" PRIMARY KEY ("relatorioIncidenteId","pessoaEnvolvidaId")
);

-- CreateTable
CREATE TABLE "relatorio_incidente_accoes_correctivas" (
    "relatorioIncidenteId" TEXT NOT NULL,
    "accaoCorrectivaId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relatorio_incidente_accoes_correctivas_pkey" PRIMARY KEY ("relatorioIncidenteId","accaoCorrectivaId")
);

-- CreateTable
CREATE TABLE "relatorio_incidente_fotografias" (
    "relatorioIncidenteId" TEXT NOT NULL,
    "fotografiaId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relatorio_incidente_fotografias_pkey" PRIMARY KEY ("relatorioIncidenteId","fotografiaId")
);

-- CreateTable
CREATE TABLE "objetivos_metas_membros_equipa" (
    "objetivoMetaId" TEXT NOT NULL,
    "membroEquipaId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "objetivos_metas_membros_equipa_pkey" PRIMARY KEY ("objetivoMetaId","membroEquipaId")
);

-- CreateTable
CREATE TABLE "objetivos_metas_tabela_accoes" (
    "objetivoMetaId" TEXT NOT NULL,
    "tabelaAccaoId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "objetivos_metas_tabela_accoes_pkey" PRIMARY KEY ("objetivoMetaId","tabelaAccaoId")
);

-- CreateTable
CREATE TABLE "relatorio_inicial_incidente_incidentes" (
    "relatorioInicialId" TEXT NOT NULL,
    "incidenteId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relatorio_inicial_incidente_incidentes_pkey" PRIMARY KEY ("relatorioInicialId","incidenteId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE INDEX "projects_tenantId_idx" ON "projects"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_name_tenantId_key" ON "projects"("name", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkUserId_key" ON "users"("clerkUserId");

-- CreateIndex
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_tenantId_key" ON "users"("email", "tenantId");

-- CreateIndex
CREATE INDEX "transactions_tenantId_projectId_userId_idx" ON "transactions"("tenantId", "projectId", "userId");

-- CreateIndex
CREATE INDEX "pessoas_envolvidas_investigacao_tenantId_idx" ON "pessoas_envolvidas_investigacao"("tenantId");

-- CreateIndex
CREATE INDEX "accoes_correctivas_permanentes_tenantId_idx" ON "accoes_correctivas_permanentes"("tenantId");

-- CreateIndex
CREATE INDEX "fotografias_incidente_tenantId_idx" ON "fotografias_incidente"("tenantId");

-- CreateIndex
CREATE INDEX "membros_equipa_tenantId_idx" ON "membros_equipa"("tenantId");

-- CreateIndex
CREATE INDEX "tabela_accoes_tenantId_idx" ON "tabela_accoes"("tenantId");

-- CreateIndex
CREATE INDEX "incidentes_tenantId_idx" ON "incidentes"("tenantId");

-- CreateIndex
CREATE INDEX "relatorios_incidente_tenantId_projectId_idx" ON "relatorios_incidente"("tenantId", "projectId");

-- CreateIndex
CREATE INDEX "objetivos_metas_ambientais_sociais_tenantId_projectId_idx" ON "objetivos_metas_ambientais_sociais"("tenantId", "projectId");

-- CreateIndex
CREATE INDEX "relatorios_iniciais_incidente_tenantId_projectId_idx" ON "relatorios_iniciais_incidente"("tenantId", "projectId");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_envolvidas_investigacao" ADD CONSTRAINT "pessoas_envolvidas_investigacao_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accoes_correctivas_permanentes" ADD CONSTRAINT "accoes_correctivas_permanentes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotografias_incidente" ADD CONSTRAINT "fotografias_incidente_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membros_equipa" ADD CONSTRAINT "membros_equipa_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabela_accoes" ADD CONSTRAINT "tabela_accoes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios_incidente" ADD CONSTRAINT "relatorios_incidente_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios_incidente" ADD CONSTRAINT "relatorios_incidente_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objetivos_metas_ambientais_sociais" ADD CONSTRAINT "objetivos_metas_ambientais_sociais_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objetivos_metas_ambientais_sociais" ADD CONSTRAINT "objetivos_metas_ambientais_sociais_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios_iniciais_incidente" ADD CONSTRAINT "relatorios_iniciais_incidente_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios_iniciais_incidente" ADD CONSTRAINT "relatorios_iniciais_incidente_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_incidente_pessoas_envolvidas" ADD CONSTRAINT "relatorio_incidente_pessoas_envolvidas_pessoaEnvolvidaId_fkey" FOREIGN KEY ("pessoaEnvolvidaId") REFERENCES "pessoas_envolvidas_investigacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_incidente_pessoas_envolvidas" ADD CONSTRAINT "relatorio_incidente_pessoas_envolvidas_relatorioIncidenteI_fkey" FOREIGN KEY ("relatorioIncidenteId") REFERENCES "relatorios_incidente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_incidente_accoes_correctivas" ADD CONSTRAINT "relatorio_incidente_accoes_correctivas_accaoCorrectivaId_fkey" FOREIGN KEY ("accaoCorrectivaId") REFERENCES "accoes_correctivas_permanentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_incidente_accoes_correctivas" ADD CONSTRAINT "relatorio_incidente_accoes_correctivas_relatorioIncidenteI_fkey" FOREIGN KEY ("relatorioIncidenteId") REFERENCES "relatorios_incidente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_incidente_fotografias" ADD CONSTRAINT "relatorio_incidente_fotografias_fotografiaId_fkey" FOREIGN KEY ("fotografiaId") REFERENCES "fotografias_incidente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_incidente_fotografias" ADD CONSTRAINT "relatorio_incidente_fotografias_relatorioIncidenteId_fkey" FOREIGN KEY ("relatorioIncidenteId") REFERENCES "relatorios_incidente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objetivos_metas_membros_equipa" ADD CONSTRAINT "objetivos_metas_membros_equipa_membroEquipaId_fkey" FOREIGN KEY ("membroEquipaId") REFERENCES "membros_equipa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objetivos_metas_membros_equipa" ADD CONSTRAINT "objetivos_metas_membros_equipa_objetivoMetaId_fkey" FOREIGN KEY ("objetivoMetaId") REFERENCES "objetivos_metas_ambientais_sociais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objetivos_metas_tabela_accoes" ADD CONSTRAINT "objetivos_metas_tabela_accoes_objetivoMetaId_fkey" FOREIGN KEY ("objetivoMetaId") REFERENCES "objetivos_metas_ambientais_sociais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objetivos_metas_tabela_accoes" ADD CONSTRAINT "objetivos_metas_tabela_accoes_tabelaAccaoId_fkey" FOREIGN KEY ("tabelaAccaoId") REFERENCES "tabela_accoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_inicial_incidente_incidentes" ADD CONSTRAINT "relatorio_inicial_incidente_incidentes_incidenteId_fkey" FOREIGN KEY ("incidenteId") REFERENCES "incidentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_inicial_incidente_incidentes" ADD CONSTRAINT "relatorio_inicial_incidente_incidentes_relatorioInicialId_fkey" FOREIGN KEY ("relatorioInicialId") REFERENCES "relatorios_iniciais_incidente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
