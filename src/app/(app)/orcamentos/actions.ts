"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseOrcamento(formData: FormData) {
  const clienteId = String(formData.get("clienteId") || "");
  const descricao = String(formData.get("descricao") || "").trim();
  const valorEstimado = Number(formData.get("valorEstimado") || 0);
  const validadeRaw = String(formData.get("validade") || "");

  if (!clienteId) throw new Error("Selecione um cliente");
  if (!descricao) throw new Error("Descrição é obrigatória");
  if (valorEstimado <= 0) throw new Error("Valor estimado deve ser maior que zero");

  return {
    clienteId,
    descricao,
    valorEstimado,
    validade: validadeRaw ? new Date(validadeRaw) : null,
  };
}

export async function createOrcamento(formData: FormData) {
  const data = parseOrcamento(formData);
  const orcamento = await prisma.orcamento.create({ data });
  revalidatePath("/orcamentos");
  redirect(`/orcamentos/${orcamento.id}`);
}

export async function updateOrcamento(id: string, formData: FormData) {
  const data = parseOrcamento(formData);
  await prisma.orcamento.update({ where: { id }, data });
  revalidatePath("/orcamentos");
  revalidatePath(`/orcamentos/${id}`);
  redirect(`/orcamentos/${id}`);
}

export async function marcarOrcamentoEnviado(id: string) {
  await prisma.orcamento.update({
    where: { id },
    data: { status: "ENVIADO" },
  });
  revalidatePath(`/orcamentos/${id}`);
}

export async function rejeitarOrcamento(id: string) {
  const orcamento = await prisma.orcamento.findUniqueOrThrow({
    where: { id },
  });

  await prisma.$transaction(async (tx) => {
    await tx.orcamento.update({
      where: { id },
      data: { status: "REJEITADO" },
    });
    if (orcamento.leadId) {
      await tx.lead.update({
        where: { id: orcamento.leadId },
        data: { estagio: "PERDIDO" },
      });
    }
  });

  revalidatePath(`/orcamentos/${id}`);
  revalidatePath("/crm");
}

export async function aprovarOrcamento(id: string) {
  const orcamento = await prisma.orcamento.findUniqueOrThrow({
    where: { id },
    include: { pedido: true },
  });

  if (orcamento.pedido) return;

  const pedido = await prisma.$transaction(async (tx) => {
    const pedido = await tx.pedido.create({
      data: {
        clienteId: orcamento.clienteId,
        orcamentoId: orcamento.id,
      },
    });

    await tx.orcamento.update({
      where: { id },
      data: { status: "APROVADO" },
    });

    if (orcamento.leadId) {
      await tx.lead.update({
        where: { id: orcamento.leadId },
        data: { estagio: "FECHADO" },
      });
    }

    return pedido;
  });

  revalidatePath(`/orcamentos/${id}`);
  revalidatePath("/orcamentos");
  revalidatePath("/pedidos");
  revalidatePath("/crm");
  redirect(`/pedidos/${pedido.id}`);
}

export async function deleteOrcamento(id: string) {
  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    include: { pedido: true },
  });
  if (orcamento?.pedido) {
    throw new Error(
      "Não é possível excluir um orçamento que já gerou um pedido."
    );
  }
  await prisma.orcamento.delete({ where: { id } });
  revalidatePath("/orcamentos");
  redirect("/orcamentos");
}
