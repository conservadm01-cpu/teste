"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateInstrucoes(produtoId: string, formData: FormData) {
  const instrucoes = String(formData.get("instrucoes") || "").trim() || null;
  await prisma.produto.update({
    where: { id: produtoId },
    data: { instrucoes },
  });
  revalidatePath(`/estoque/produtos/${produtoId}/ficha`);
}

export async function addFichaItem(produtoId: string, formData: FormData) {
  const materiaPrimaId = String(formData.get("materiaPrimaId") || "");
  const quantidade = Number(formData.get("quantidade") || 0);

  if (!materiaPrimaId) throw new Error("Selecione uma matéria-prima");
  if (quantidade <= 0) throw new Error("Quantidade deve ser maior que zero");

  await prisma.fichaProducaoItem.upsert({
    where: {
      produtoId_materiaPrimaId: { produtoId, materiaPrimaId },
    },
    update: { quantidade },
    create: { produtoId, materiaPrimaId, quantidade },
  });

  revalidatePath(`/estoque/produtos/${produtoId}/ficha`);
}

export async function removeFichaItem(produtoId: string, itemId: string) {
  await prisma.fichaProducaoItem.delete({ where: { id: itemId } });
  revalidatePath(`/estoque/produtos/${produtoId}/ficha`);
}
