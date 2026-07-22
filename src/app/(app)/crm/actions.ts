"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { EstagioLead, Prisma } from "@prisma/client";

function parseLead(formData: FormData) {
  const nome = String(formData.get("nome") || "").trim();
  const empresa = String(formData.get("empresa") || "").trim() || null;
  const telefone = String(formData.get("telefone") || "").trim() || null;
  const email = String(formData.get("email") || "").trim() || null;
  const origem = String(formData.get("origem") || "").trim() || null;
  const observacoes =
    String(formData.get("observacoes") || "").trim() || null;

  if (!nome) throw new Error("Nome é obrigatório");

  return { nome, empresa, telefone, email, origem, observacoes };
}

export async function createLead(formData: FormData) {
  const data = parseLead(formData);
  await prisma.lead.create({ data });
  revalidatePath("/crm");
  redirect("/crm");
}

export async function updateLead(id: string, formData: FormData) {
  const data = parseLead(formData);
  await prisma.lead.update({ where: { id }, data });
  revalidatePath("/crm");
  redirect("/crm");
}

export async function changeEstagioLead(id: string, estagio: EstagioLead) {
  await prisma.lead.update({ where: { id }, data: { estagio } });
  revalidatePath("/crm");
}

async function garantirClienteDoLead(
  tx: Prisma.TransactionClient,
  leadId: string
) {
  const lead = await tx.lead.findUniqueOrThrow({ where: { id: leadId } });
  if (lead.clienteId) return lead.clienteId;

  const cliente = await tx.cliente.create({
    data: {
      nome: lead.empresa || lead.nome,
      telefone: lead.telefone,
      email: lead.email,
    },
  });

  await tx.lead.update({
    where: { id: leadId },
    data: {
      clienteId: cliente.id,
      estagio: lead.estagio === "NOVO" ? "NEGOCIACAO" : lead.estagio,
    },
  });

  return cliente.id;
}

export async function converterLeadEmCliente(id: string) {
  const clienteId = await prisma.$transaction((tx) =>
    garantirClienteDoLead(tx, id)
  );

  revalidatePath("/crm");
  revalidatePath("/clientes");
  redirect(`/clientes/${clienteId}`);
}

export async function criarOrcamentoDoLead(id: string) {
  const orcamento = await prisma.$transaction(async (tx) => {
    const lead = await tx.lead.findUniqueOrThrow({ where: { id } });
    const clienteId = await garantirClienteDoLead(tx, id);

    return tx.orcamento.create({
      data: {
        clienteId,
        leadId: id,
        descricao: `Orçamento para ${lead.nome}`,
        valorEstimado: 0,
      },
    });
  });

  revalidatePath("/crm");
  revalidatePath("/clientes");
  revalidatePath("/orcamentos");
  redirect(`/orcamentos/${orcamento.id}`);
}

export async function deleteLead(id: string) {
  const orcamentosCount = await prisma.orcamento.count({
    where: { leadId: id },
  });
  if (orcamentosCount > 0) {
    throw new Error(
      "Não é possível excluir este lead pois existem orçamentos vinculados a ele."
    );
  }
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/crm");
  redirect("/crm");
}
