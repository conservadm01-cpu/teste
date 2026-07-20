-- AlterTable
ALTER TABLE "Produto" ADD COLUMN "instrucoes" TEXT;

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "empresa" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "origem" TEXT,
    "estagio" TEXT NOT NULL DEFAULT 'NOVO',
    "observacoes" TEXT,
    "clienteId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lead_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FichaProducaoItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "produtoId" TEXT NOT NULL,
    "materiaPrimaId" TEXT NOT NULL,
    "quantidade" REAL NOT NULL,
    CONSTRAINT "FichaProducaoItem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FichaProducaoItem_materiaPrimaId_fkey" FOREIGN KEY ("materiaPrimaId") REFERENCES "MateriaPrima" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_clienteId_key" ON "Lead"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "FichaProducaoItem_produtoId_materiaPrimaId_key" ON "FichaProducaoItem"("produtoId", "materiaPrimaId");
