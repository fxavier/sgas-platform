-- CreateEnum
CREATE TYPE "Eficacia" AS ENUM ('Eficaz', 'Nao_Eficaz');

-- CreateTable
CREATE TABLE "areas_treinamento" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "areas_treinamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caixa_ferramentas" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "caixa_ferramentas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funcao" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "funcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matriz_treinamento" (
    "id" UUID NOT NULL,
    "data" DATE,
    "funcaoId" UUID NOT NULL,
    "areaTreinamentoId" UUID NOT NULL,
    "caixaFerramentasId" UUID NOT NULL,
    "totais_palestras" INTEGER NOT NULL,
    "total_horas" INTEGER NOT NULL,
    "total_caixa_ferramentas" INTEGER NOT NULL,
    "total_pessoas_informadas_caixa_ferramentas" INTEGER NOT NULL,
    "eficacia" "Eficacia" NOT NULL,
    "accoes_treinamento_nao_eficaz" TEXT,
    "aprovado_por" VARCHAR(100) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "matriz_treinamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "areas_treinamento_tenantId_idx" ON "areas_treinamento"("tenantId");

-- CreateIndex
CREATE INDEX "caixa_ferramentas_tenantId_idx" ON "caixa_ferramentas"("tenantId");

-- CreateIndex
CREATE INDEX "funcao_tenantId_idx" ON "funcao"("tenantId");

-- CreateIndex
CREATE INDEX "matriz_treinamento_tenantId_projectId_funcaoId_areaTreiname_idx" ON "matriz_treinamento"("tenantId", "projectId", "funcaoId", "areaTreinamentoId", "caixaFerramentasId");

-- AddForeignKey
ALTER TABLE "areas_treinamento" ADD CONSTRAINT "areas_treinamento_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caixa_ferramentas" ADD CONSTRAINT "caixa_ferramentas_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcao" ADD CONSTRAINT "funcao_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriz_treinamento" ADD CONSTRAINT "matriz_treinamento_funcaoId_fkey" FOREIGN KEY ("funcaoId") REFERENCES "funcao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriz_treinamento" ADD CONSTRAINT "matriz_treinamento_areaTreinamentoId_fkey" FOREIGN KEY ("areaTreinamentoId") REFERENCES "areas_treinamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriz_treinamento" ADD CONSTRAINT "matriz_treinamento_caixaFerramentasId_fkey" FOREIGN KEY ("caixaFerramentasId") REFERENCES "caixa_ferramentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriz_treinamento" ADD CONSTRAINT "matriz_treinamento_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriz_treinamento" ADD CONSTRAINT "matriz_treinamento_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
