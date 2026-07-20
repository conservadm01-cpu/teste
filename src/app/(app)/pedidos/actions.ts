"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { StatusPedido } from "@prisma/client";

export async function createPedido(formData: FormData) {
  const clienteId = String(formData.get("clienteId") || "");
  if (!clienteId) throw new Error("Selecione um cliente");

  const produtoIds = formData.getAll("produtoId") as string[];
  const quantidades = formData.getAll("quantidade") as string[];
  const precos = formData.getAll("precoUnitario") as string[];

  const itens = produtoIds
    .map((produtoId, i) => ({
      produtoId,
      quantidade: Number(quantidades[i]),
      precoUnitario: Number(precos[i]),
    }))
    .filter((item) => item.produtoId && item.quantidade > 0);

  if (itens.length === 0) {
    throw new Error("Adicione ao menos um item ao pedido");
  }

  const pedido = await prisma.pedido.create({
    data: {
      clienteId,
      itens: { create: itens },
    },
  });

  revalidatePath("/pedidos");
  redirect(`/pedidos/${pedido.id}`);
}

export async function updateStatusPedido(id: string, status: StatusPedido) {
  const pedido = await prisma.pedido.findUniqueOrThrow({
    where: { id },
    include: { itens: true },
  });

  await prisma.pedido.update({ where: { id }, data: { status } });

  if (status === "FATURADO") {
    const existente = await prisma.contaReceber.findFirst({
      where: { descricao: `Pedido #${id}` },
    });
    if (!existente) {
      const total = pedido.itens.reduce(
        (acc, item) => acc + item.quantidade * item.precoUnitario,
        0
      );
      const vencimento = new Date();
      vencimento.setDate(vencimento.getDate() + 30);

      await prisma.contaReceber.create({
        data: {
          descricao: `Pedido #${id}`,
          valor: total,
          vencimento,
        },
      });
      revalidatePath("/financeiro");
    }
  }

  revalidatePath("/pedidos");
  revalidatePath(`/pedidos/${id}`);
}

export async function changeStatusAction(id: string, formData: FormData) {
  const status = String(formData.get("status")) as StatusPedido;
  await updateStatusPedido(id, status);
  redirect(`/pedidos/${id}`);
}

export async function deletePedido(id: string) {
  const ordensCount = await prisma.ordemProducao.count({
    where: { pedidoId: id },
  });
  if (ordensCount > 0) {
    throw new Error(
      "Não é possível excluir este pedido pois existem ordens de produção vinculadas."
    );
  }
  await prisma.pedido.delete({ where: { id } });
  revalidatePath("/pedidos");
  redirect("/pedidos");
}
