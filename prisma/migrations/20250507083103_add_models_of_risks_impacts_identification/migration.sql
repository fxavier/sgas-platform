-- CreateEnum
CREATE TYPE "Duracao" AS ENUM ('CURTO_PRAZO', 'MEDIO_PRAZO', 'LONGO_PRAZO');

-- CreateEnum
CREATE TYPE "Extensao" AS ENUM ('LOCAL', 'REGIONAL', 'NACIONAL', 'GLOBAL');

-- CreateEnum
CREATE TYPE "Intensidade" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "FaseProjecto" AS ENUM ('PRE_CONSTRUCAO', 'CONSTRUCAO', 'OPERACAO', 'DESATIVACAO', 'ENCERRAMENTO', 'RESTAURACAO');

-- CreateEnum
CREATE TYPE "Probabilidade" AS ENUM ('IMPROVAVEL', 'PROVAVEL', 'ALTAMENTE_PROVAVEL', 'DEFINITIVA');

-- CreateEnum
CREATE TYPE "TipoResposta" AS ENUM ('SIM', 'NAO');

-- CreateEnum
CREATE TYPE "Estatuto" AS ENUM ('POSITIVO', 'NEGATIVO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'REVOKED', 'AMENDED');

-- CreateEnum
CREATE TYPE "Condicao" AS ENUM ('NORMAL', 'ANORMAL', 'EMERGENCIA');

-- CreateEnum
CREATE TYPE "Provincias" AS ENUM ('MAPUTO', 'MAPUTO_CIDADE', 'GAZA', 'INHAMBANE', 'SOFALA', 'MANICA', 'TETE', 'ZAMBEZIA', 'NAMPULA', 'CABO_DELGADO', 'NIASSA');

-- CreateEnum
CREATE TYPE "TipoActividade" AS ENUM ('TURISTICA', 'INDUSTRIAL', 'AGRO_PECUARIA', 'ENERGETICA', 'SERVICOS', 'OUTRA');

-- CreateEnum
CREATE TYPE "EstagioDesenvolvimento" AS ENUM ('NOVA', 'REABILITACAO', 'EXPANSAO', 'OUTRO');

-- CreateEnum
CREATE TYPE "MeioInsercao" AS ENUM ('RURAL', 'URBANO', 'PERIURBANO');

-- CreateEnum
CREATE TYPE "EnquadramentoOrcamentoTerritorial" AS ENUM ('ESPACO_HABITACIONAL', 'INDUSTRIAL', 'SERVICOS', 'OUTRO');

-- CreateEnum
CREATE TYPE "CaracteristicasFisicaslocalImplantacaoActividades" AS ENUM ('PLANICIE', 'PLANALTO', 'VALE', 'MONTANHA');

-- CreateEnum
CREATE TYPE "Ecossistemaspredominantes" AS ENUM ('FLUVIAL', 'LACUSTRE', 'MARINHO', 'TERRESTRE');

-- CreateEnum
CREATE TYPE "LocationZone" AS ENUM ('COSTEIRA', 'INTERIOR', 'ILHA');

-- CreateEnum
CREATE TYPE "TypeOfPredominantVegetation" AS ENUM ('FLORESTA', 'SAVANA', 'OUTRO');

-- CreateEnum
CREATE TYPE "LandUse" AS ENUM ('AGROPECUARIO', 'HABITACIONAL', 'INDUSTRIAL', 'PROTECCAO', 'OUTRO');

-- AlterTable
ALTER TABLE "membros_equipa" ADD COLUMN     "cargo" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "departamento" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "factor_ambiental_impactado" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "factor_ambiental_impactado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riscos_impactos" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "riscos_impactos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identificacao_avaliacao_riscos_impactos" (
    "id" TEXT NOT NULL,
    "numeroReferencia" TEXT,
    "processo" TEXT,
    "actiactividade" TEXT NOT NULL,
    "riscosImpactosId" TEXT NOT NULL,
    "realOuPotencial" TEXT,
    "condicao" "Condicao" NOT NULL,
    "factorAmbientalImpactadoId" TEXT NOT NULL,
    "faseProjecto" "FaseProjecto" NOT NULL,
    "estatuto" "Estatuto" NOT NULL,
    "extensao" "Extensao" NOT NULL,
    "duduacao" "Duracao" NOT NULL,
    "intensidade" "Intensidade" NOT NULL,
    "probabilidade" "Probabilidade" NOT NULL,
    "significancia" TEXT,
    "duracaoRisco" TEXT,
    "descricaoMedidas" TEXT NOT NULL,
    "respresponsavelonsible" TEXT,
    "prazo" TIMESTAMP(3) NOT NULL,
    "referenciaDocumentoControl" TEXT,
    "legislacaoMocambicanaAplicavel" TEXT,
    "observacoes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "identificacao_avaliacao_riscos_impactos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "controle_requisitos_legais" (
    "id" TEXT NOT NULL,
    "numnumero" TEXT NOT NULL,
    "tituloDocumento" TEXT NOT NULL,
    "descricao" TIMESTAMP(3) NOT NULL,
    "revocacoesAlteracoes" TEXT,
    "requisitoConformidade" TEXT,
    "dataControle" TIMESTAMP(3) NOT NULL,
    "observation" TEXT,
    "ficheiroDaLei" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "controle_requisitos_legais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoa_do_contacto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "assinatura" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "pessoa_do_contacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsavel_pelo_preenchimento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "assinatura" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "responsavel_pelo_preenchimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsavel_pela_verificacao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "assinatura" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "responsavel_pela_verificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biodiversidade_recursos_naturais" (
    "id" TEXT NOT NULL,
    "reference" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "biodiversidade_recursos_naturais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subprojecto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "referenciaDoContracto" TEXT,
    "nomeEmpreiteiro" TEXT,
    "custoEstimado" DECIMAL(15,2),
    "localizacao" TEXT NOT NULL,
    "coordenadasGeograficas" TEXT,
    "tipoSubprojecto" TEXT NOT NULL,
    "areaAproximada" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "subprojecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identificacao_riscos_ambientais_sociais_subprojecto" (
    "id" TEXT NOT NULL,
    "biodiversidadeRecursosNaturaisId" TEXT NOT NULL,
    "resposta" "TipoResposta" NOT NULL,
    "comentario" TEXT,
    "normaAmbientalSocial" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "identificacao_riscos_ambientais_sociais_subprojecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "triagem_ambiental_social" (
    "id" TEXT NOT NULL,
    "responsavelPeloPreenchimentoId" TEXT NOT NULL,
    "responsavelPelaVerificacaoId" TEXT NOT NULL,
    "subprojectoId" TEXT NOT NULL,
    "consultaEngajamento" TEXT,
    "accoesRecomendadas" TEXT,
    "resultadoTriagemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "triagem_ambiental_social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultation_and_engagement" (
    "id" TEXT NOT NULL,
    "subprojectoId" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "consultation_and_engagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resultado_triagem" (
    "id" TEXT NOT NULL,
    "subprojectoId" TEXT NOT NULL,
    "categoriaRisco" VARCHAR(15) NOT NULL,
    "descricao" TEXT NOT NULL,
    "instrumentosASeremDesenvolvidos" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "resultado_triagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ficha_informacao_ambiental_preliminar" (
    "id" TEXT NOT NULL,
    "nomeActividade" TEXT NOT NULL,
    "tipoActividade" "TipoActividade" NOT NULL,
    "proponentes" TEXT,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT,
    "fax" TEXT,
    "telemovel" TEXT,
    "email" TEXT NOT NULL,
    "bairroActividade" TEXT NOT NULL,
    "vilaActividade" TEXT NOT NULL,
    "cidadeActividade" TEXT NOT NULL,
    "localidadeActividade" TEXT,
    "distritoActividade" TEXT,
    "provinciaActividade" "Provincias" NOT NULL,
    "coordenadasGeograficas" TEXT,
    "meioInsercao" "MeioInsercao" NOT NULL,
    "enquadramentoOrcamentoTerritorial" "EnquadramentoOrcamentoTerritorial" NOT NULL,
    "descricaoActividade" TEXT,
    "actividadesAssociadas" TEXT,
    "descricaoTecnologiaConstrucaoOperacao" TEXT,
    "actividadesComplementaresPrincipais" TEXT,
    "tipoQuantidadeOrigemMaoDeObra" TEXT,
    "tipoQuantidadeOrigemProvenienciaMateriasPrimas" TEXT,
    "quimicosUtilizados" TEXT,
    "tipoOrigemConsumoAguaEnergia" TEXT,
    "origemCombustiveisLubrificantes" TEXT,
    "outrosRecursosNecessarios" TEXT,
    "posseDeTerra" TEXT,
    "alternativasLocalizacaoActividade" TEXT,
    "descricaoBreveSituacaoAmbientalReferenciaLocalRegional" TEXT,
    "caracteristicasFisicasLocalActividade" "CaracteristicasFisicaslocalImplantacaoActividades",
    "ecosistemasPredominantes" "Ecossistemaspredominantes",
    "zonaLocalizacao" "LocationZone",
    "tipoVegetacaoPredominante" "TypeOfPredominantVegetation",
    "usoSolo" "LandUse",
    "infraestruturaExistenteAreaActividade" TEXT,
    "informacaoComplementarAtravesMaps" TEXT,
    "valorTotalInvestimento" DECIMAL(15,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ficha_informacao_ambiental_preliminar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "triagem_ambiental_social_identificacao_riscos" (
    "triagemAmbientalSocialId" TEXT NOT NULL,
    "identificacaoRiscosId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "triagem_ambiental_social_identificacao_riscos_pkey" PRIMARY KEY ("triagemAmbientalSocialId","identificacaoRiscosId")
);

-- CreateIndex
CREATE INDEX "factor_ambiental_impactado_tenantId_idx" ON "factor_ambiental_impactado"("tenantId");

-- CreateIndex
CREATE INDEX "riscos_impactos_tenantId_idx" ON "riscos_impactos"("tenantId");

-- CreateIndex
CREATE INDEX "identificacao_avaliacao_riscos_impactos_tenantId_projectId__idx" ON "identificacao_avaliacao_riscos_impactos"("tenantId", "projectId", "riscosImpactosId", "factorAmbientalImpactadoId");

-- CreateIndex
CREATE INDEX "controle_requisitos_legais_tenantId_projectId_idx" ON "controle_requisitos_legais"("tenantId", "projectId");

-- CreateIndex
CREATE INDEX "pessoa_do_contacto_tenantId_idx" ON "pessoa_do_contacto"("tenantId");

-- CreateIndex
CREATE INDEX "responsavel_pelo_preenchimento_tenantId_idx" ON "responsavel_pelo_preenchimento"("tenantId");

-- CreateIndex
CREATE INDEX "responsavel_pela_verificacao_tenantId_idx" ON "responsavel_pela_verificacao"("tenantId");

-- CreateIndex
CREATE INDEX "biodiversidade_recursos_naturais_tenantId_idx" ON "biodiversidade_recursos_naturais"("tenantId");

-- CreateIndex
CREATE INDEX "subprojecto_tenantId_idx" ON "subprojecto"("tenantId");

-- CreateIndex
CREATE INDEX "identificacao_riscos_ambientais_sociais_subprojecto_tenantI_idx" ON "identificacao_riscos_ambientais_sociais_subprojecto"("tenantId", "biodiversidadeRecursosNaturaisId");

-- CreateIndex
CREATE INDEX "triagem_ambiental_social_tenantId_projectId_subprojectoId_r_idx" ON "triagem_ambiental_social"("tenantId", "projectId", "subprojectoId", "responsavelPeloPreenchimentoId", "responsavelPelaVerificacaoId", "resultadoTriagemId");

-- CreateIndex
CREATE INDEX "consultation_and_engagement_tenantId_projectId_subprojectoI_idx" ON "consultation_and_engagement"("tenantId", "projectId", "subprojectoId");

-- CreateIndex
CREATE INDEX "resultado_triagem_tenantId_subprojectoId_idx" ON "resultado_triagem"("tenantId", "subprojectoId");

-- CreateIndex
CREATE INDEX "ficha_informacao_ambiental_preliminar_tenantId_projectId_idx" ON "ficha_informacao_ambiental_preliminar"("tenantId", "projectId");

-- AddForeignKey
ALTER TABLE "factor_ambiental_impactado" ADD CONSTRAINT "factor_ambiental_impactado_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riscos_impactos" ADD CONSTRAINT "riscos_impactos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identificacao_avaliacao_riscos_impactos" ADD CONSTRAINT "identificacao_avaliacao_riscos_impactos_riscosImpactosId_fkey" FOREIGN KEY ("riscosImpactosId") REFERENCES "riscos_impactos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identificacao_avaliacao_riscos_impactos" ADD CONSTRAINT "identificacao_avaliacao_riscos_impactos_factorAmbientalImp_fkey" FOREIGN KEY ("factorAmbientalImpactadoId") REFERENCES "factor_ambiental_impactado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identificacao_avaliacao_riscos_impactos" ADD CONSTRAINT "identificacao_avaliacao_riscos_impactos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identificacao_avaliacao_riscos_impactos" ADD CONSTRAINT "identificacao_avaliacao_riscos_impactos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "controle_requisitos_legais" ADD CONSTRAINT "controle_requisitos_legais_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "controle_requisitos_legais" ADD CONSTRAINT "controle_requisitos_legais_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa_do_contacto" ADD CONSTRAINT "pessoa_do_contacto_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsavel_pelo_preenchimento" ADD CONSTRAINT "responsavel_pelo_preenchimento_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsavel_pela_verificacao" ADD CONSTRAINT "responsavel_pela_verificacao_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biodiversidade_recursos_naturais" ADD CONSTRAINT "biodiversidade_recursos_naturais_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subprojecto" ADD CONSTRAINT "subprojecto_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identificacao_riscos_ambientais_sociais_subprojecto" ADD CONSTRAINT "identificacao_riscos_ambientais_sociais_subprojecto_biodiv_fkey" FOREIGN KEY ("biodiversidadeRecursosNaturaisId") REFERENCES "biodiversidade_recursos_naturais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identificacao_riscos_ambientais_sociais_subprojecto" ADD CONSTRAINT "identificacao_riscos_ambientais_sociais_subprojecto_tenant_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social" ADD CONSTRAINT "triagem_ambiental_social_responsavelPeloPreenchimentoId_fkey" FOREIGN KEY ("responsavelPeloPreenchimentoId") REFERENCES "responsavel_pelo_preenchimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social" ADD CONSTRAINT "triagem_ambiental_social_responsavelPelaVerificacaoId_fkey" FOREIGN KEY ("responsavelPelaVerificacaoId") REFERENCES "responsavel_pela_verificacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social" ADD CONSTRAINT "triagem_ambiental_social_subprojectoId_fkey" FOREIGN KEY ("subprojectoId") REFERENCES "subprojecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social" ADD CONSTRAINT "triagem_ambiental_social_resultadoTriagemId_fkey" FOREIGN KEY ("resultadoTriagemId") REFERENCES "resultado_triagem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social" ADD CONSTRAINT "triagem_ambiental_social_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social" ADD CONSTRAINT "triagem_ambiental_social_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_and_engagement" ADD CONSTRAINT "consultation_and_engagement_subprojectoId_fkey" FOREIGN KEY ("subprojectoId") REFERENCES "subprojecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_and_engagement" ADD CONSTRAINT "consultation_and_engagement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_and_engagement" ADD CONSTRAINT "consultation_and_engagement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado_triagem" ADD CONSTRAINT "resultado_triagem_subprojectoId_fkey" FOREIGN KEY ("subprojectoId") REFERENCES "subprojecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado_triagem" ADD CONSTRAINT "resultado_triagem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado_triagem" ADD CONSTRAINT "resultado_triagem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ficha_informacao_ambiental_preliminar" ADD CONSTRAINT "ficha_informacao_ambiental_preliminar_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ficha_informacao_ambiental_preliminar" ADD CONSTRAINT "ficha_informacao_ambiental_preliminar_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social_identificacao_riscos" ADD CONSTRAINT "triagem_ambiental_social_identificacao_riscos_triagemAmbie_fkey" FOREIGN KEY ("triagemAmbientalSocialId") REFERENCES "triagem_ambiental_social"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social_identificacao_riscos" ADD CONSTRAINT "triagem_ambiental_social_identificacao_riscos_identificaca_fkey" FOREIGN KEY ("identificacaoRiscosId") REFERENCES "identificacao_riscos_ambientais_sociais_subprojecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
