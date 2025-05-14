-- CreateEnum
CREATE TYPE "EstadoDocumento" AS ENUM ('REVISAO', 'EM_USO', 'ABSOLETO');

-- CreateTable
CREATE TABLE "politicas" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRevisao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "nomeDocumento" TEXT NOT NULL,
    "ficheiro" TEXT NOT NULL,
    "estadoDocumento" "EstadoDocumento" NOT NULL,
    "periodoRetencao" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "politicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manuais" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRevisao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "nomeDocumento" TEXT NOT NULL,
    "ficheiro" TEXT NOT NULL,
    "estadoDocumento" "EstadoDocumento" NOT NULL,
    "periodoRetencao" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "manuais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedimentos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRevisao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "nomeDocumento" TEXT NOT NULL,
    "ficheiro" TEXT NOT NULL,
    "estadoDocumento" "EstadoDocumento" NOT NULL,
    "periodoRetencao" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "procedimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formularios" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRevisao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "nomeDocumento" TEXT NOT NULL,
    "ficheiro" TEXT NOT NULL,
    "estadoDocumento" "EstadoDocumento" NOT NULL,
    "periodoRetencao" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "formularios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modelos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRevisao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "nomeDocumento" TEXT NOT NULL,
    "ficheiro" TEXT NOT NULL,
    "estadoDocumento" "EstadoDocumento" NOT NULL,
    "periodoRetencao" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "modelos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "politicas_tenantId_idx" ON "politicas"("tenantId");

-- CreateIndex
CREATE INDEX "manuais_tenantId_idx" ON "manuais"("tenantId");

-- CreateIndex
CREATE INDEX "procedimentos_tenantId_idx" ON "procedimentos"("tenantId");

-- CreateIndex
CREATE INDEX "formularios_tenantId_idx" ON "formularios"("tenantId");

-- CreateIndex
CREATE INDEX "modelos_tenantId_idx" ON "modelos"("tenantId");

-- AddForeignKey
ALTER TABLE "politicas" ADD CONSTRAINT "politicas_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "politicas" ADD CONSTRAINT "politicas_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manuais" ADD CONSTRAINT "manuais_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manuais" ADD CONSTRAINT "manuais_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimentos" ADD CONSTRAINT "procedimentos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimentos" ADD CONSTRAINT "procedimentos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios" ADD CONSTRAINT "formularios_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios" ADD CONSTRAINT "formularios_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modelos" ADD CONSTRAINT "modelos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modelos" ADD CONSTRAINT "modelos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
