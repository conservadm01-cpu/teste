"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createContaPagar(formData: FormData) {
  const descricao = String(formData.get("descricao") || "").trim();
  const fornecedor = String(formData.get("fornecedor") || "").trim() || null;
  const valor = Number(formData.get("valor") || 0);
  const vencimento = String(formData.get("vencimento") || "");

  if (!descricao) throw new Error("Descrição é obrigatória");
  if (valor <= 0) throw new Error("Valor deve ser maior que zero");
  if (!vencimento) throw new Error("Vencimento é obrigatório");

  await prisma.contaPagar.create({
    data: {
      descricao,
      fornecedor,
      valor,
      vencimento: new Date(vencimento),
    },
  });

  revalidatePath("/financeiro");
  redirect("/financeiro");
}

export async function createContaReceber(formData: FormData) {
  const descricao = String(formData.get("descricao") || "").trim();
  const cliente = String(formData.get("cliente") || "").trim() || null;
  const valor = Number(formData.get("valor") || 0);
  const vencimento = String(formData.get("vencimento") || "");

  if (!descricao) throw new Error("Descrição é obrigatória");
  if (valor <= 0) throw new Error("Valor deve ser maior que zero");
  if (!vencimento) throw new Error("Vencimento é obrigatório");

  await prisma.contaReceber.create({
    data: {
      descricao,
      cliente,
      valor,
      vencimento: new Date(vencimento),
    },
  });

  revalidatePath("/financeiro");
  redirect("/financeiro");
}

export async function marcarContaPagarPaga(id: string) {
  await prisma.contaPagar.update({
    where: { id },
    data: { status: "PAGO", dataPago: new Date() },
  });
  revalidatePath("/financeiro");
}

export async function marcarContaReceberRecebida(id: string) {
  await prisma.contaReceber.update({
    where: { id },
    data: { status: "PAGO", dataPago: new Date() },
  });
  revalidatePath("/financeiro");
}

export async function deleteContaPagar(id: string) {
  await prisma.contaPagar.delete({ where: { id } });
  revalidatePath("/financeiro");
}

export async function deleteContaReceber(id: string) {
  await prisma.contaReceber.delete({ where: { id } });
  revalidatePath("/financeiro");
}
