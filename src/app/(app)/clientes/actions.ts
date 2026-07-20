"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseCliente(formData: FormData) {
  const nome = String(formData.get("nome") || "").trim();
  const documento = String(formData.get("documento") || "").trim() || null;
  const telefone = String(formData.get("telefone") || "").trim() || null;
  const email = String(formData.get("email") || "").trim() || null;
  const endereco = String(formData.get("endereco") || "").trim() || null;

  if (!nome) throw new Error("Nome é obrigatório");

  return { nome, documento, telefone, email, endereco };
}

export async function createCliente(formData: FormData) {
  const data = parseCliente(formData);
  await prisma.cliente.create({ data });
  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function updateCliente(id: string, formData: FormData) {
  const data = parseCliente(formData);
  await prisma.cliente.update({ where: { id }, data });
  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function deleteCliente(id: string) {
  const pedidosCount = await prisma.pedido.count({ where: { clienteId: id } });
  if (pedidosCount > 0) {
    throw new Error(
      "Não é possível excluir este cliente pois existem pedidos vinculados a ele."
    );
  }
  await prisma.cliente.delete({ where: { id } });
  revalidatePath("/clientes");
  redirect("/clientes");
}
