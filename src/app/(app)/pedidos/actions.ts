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

  const pedido = await prisma.$transaction(async (tx) => {
    const pedido = await tx.pedido.create({
      data: {
        clienteId,
        itens: { create: itens },
      },
      include: { itens: true },
    });

    for (const item of pedido.itens) {
      await tx.ordemProducao.create({
        data: {
          pedidoId: pedido.id,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
        },
      });
    }

    return pedido;
  });

  revalidatePath("/pedidos");
  revalidatePath("/producao");
  redirect(`/pedidos/${pedido.id}`);
}

export async function adicionarItemPedido(pedidoId: string, formData: FormData) {
  const produtoId = String(formData.get("produtoId") || "");
  const quantidade = Number(formData.get("quantidade") || 0);
  const precoUnitario = Number(formData.get("precoUnitario") || 0);

  if (!produtoId) throw new Error("Selecione um produto");
  if (quantidade <= 0) throw new Error("Quantidade deve ser maior que zero");
  if (precoUnitario < 0) throw new Error("Preço inválido");

  await prisma.$transaction(async (tx) => {
    await tx.itemPedido.create({
      data: { pedidoId, produtoId, quantidade, precoUnitario },
    });
    await tx.ordemProducao.create({
      data: { pedidoId, produtoId, quantidade },
    });
  });

  revalidatePath(`/pedidos/${pedidoId}`);
  revalidatePath("/pedidos");
  revalidatePath("/producao");
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
  const ordens = await prisma.ordemProducao.findMany({
    where: { pedidoId: id },
  });
  const iniciadas = ordens.some((o) => o.etapa !== "AGUARDANDO");
  if (iniciadas) {
    throw new Error(
      "Não é possível excluir este pedido: alguma ordem de produção já iniciou (estoque já foi movimentado)."
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.ordemProducao.deleteMany({ where: { pedidoId: id } });
    await tx.pedido.delete({ where: { id } });
  });

  revalidatePath("/pedidos");
  revalidatePath("/producao");
  redirect("/pedidos");
}
