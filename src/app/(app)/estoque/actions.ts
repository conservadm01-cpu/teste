"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { UnidadeMedida } from "@prisma/client";

function parseMateriaPrima(formData: FormData) {
  const nome = String(formData.get("nome") || "").trim();
  const tipo = String(formData.get("tipo") || "").trim();
  const unidade = String(formData.get("unidade") || "UNIDADE") as UnidadeMedida;
  const estoqueAtual = Number(formData.get("estoqueAtual") || 0);
  const estoqueMinimo = Number(formData.get("estoqueMinimo") || 0);

  if (!nome) throw new Error("Nome é obrigatório");

  return { nome, tipo, unidade, estoqueAtual, estoqueMinimo };
}

export async function createMateriaPrima(formData: FormData) {
  const data = parseMateriaPrima(formData);
  await prisma.materiaPrima.create({ data });
  revalidatePath("/estoque");
  redirect("/estoque");
}

export async function updateMateriaPrima(id: string, formData: FormData) {
  const data = parseMateriaPrima(formData);
  await prisma.materiaPrima.update({ where: { id }, data });
  revalidatePath("/estoque");
  redirect("/estoque");
}

export async function deleteMateriaPrima(id: string) {
  await prisma.materiaPrima.delete({ where: { id } });
  revalidatePath("/estoque");
  redirect("/estoque");
}

function parseProduto(formData: FormData) {
  const nome = String(formData.get("nome") || "").trim();
  const sku = String(formData.get("sku") || "").trim();
  const categoria = String(formData.get("categoria") || "").trim() || null;
  const precoVenda = Number(formData.get("precoVenda") || 0);
  const estoqueAtual = Number(formData.get("estoqueAtual") || 0);
  const estoqueMinimo = Number(formData.get("estoqueMinimo") || 0);

  if (!nome) throw new Error("Nome é obrigatório");
  if (!sku) throw new Error("SKU é obrigatório");

  return { nome, sku, categoria, precoVenda, estoqueAtual, estoqueMinimo };
}

export async function createProduto(formData: FormData) {
  const data = parseProduto(formData);
  await prisma.produto.create({ data });
  revalidatePath("/estoque");
  redirect("/estoque");
}

export async function updateProduto(id: string, formData: FormData) {
  const data = parseProduto(formData);
  await prisma.produto.update({ where: { id }, data });
  revalidatePath("/estoque");
  redirect("/estoque");
}

export async function deleteProduto(id: string) {
  await prisma.produto.delete({ where: { id } });
  revalidatePath("/estoque");
  redirect("/estoque");
}

export async function createMovimento(formData: FormData) {
  const itemTipo = String(formData.get("itemTipo")) as
    | "MATERIA_PRIMA"
    | "PRODUTO";
  const tipo = String(formData.get("tipo")) as "ENTRADA" | "SAIDA";
  const itemId = String(formData.get("itemId") || "");
  const quantidade = Number(formData.get("quantidade") || 0);
  const motivo = String(formData.get("motivo") || "").trim() || null;

  if (!itemId) throw new Error("Selecione um item");
  if (quantidade <= 0) throw new Error("Quantidade deve ser maior que zero");

  const delta = tipo === "ENTRADA" ? quantidade : -quantidade;

  await prisma.$transaction(async (tx) => {
    if (itemTipo === "MATERIA_PRIMA") {
      const item = await tx.materiaPrima.findUniqueOrThrow({
        where: { id: itemId },
      });
      const novoEstoque = item.estoqueAtual + delta;
      if (novoEstoque < 0) throw new Error("Estoque insuficiente");

      await tx.materiaPrima.update({
        where: { id: itemId },
        data: { estoqueAtual: novoEstoque },
      });
      await tx.movimentoEstoque.create({
        data: {
          tipo,
          itemTipo,
          materiaPrimaId: itemId,
          quantidade,
          motivo,
        },
      });
    } else {
      const item = await tx.produto.findUniqueOrThrow({
        where: { id: itemId },
      });
      const novoEstoque = item.estoqueAtual + delta;
      if (novoEstoque < 0) throw new Error("Estoque insuficiente");

      await tx.produto.update({
        where: { id: itemId },
        data: { estoqueAtual: novoEstoque },
      });
      await tx.movimentoEstoque.create({
        data: {
          tipo,
          itemTipo,
          produtoId: itemId,
          quantidade,
          motivo,
        },
      });
    }
  });

  revalidatePath("/estoque");
  revalidatePath("/estoque/movimentos");
  redirect("/estoque/movimentos");
}
