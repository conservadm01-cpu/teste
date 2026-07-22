"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { EtapaProducao } from "@prisma/client";

const ETAPA_ORDER: EtapaProducao[] = [
  "AGUARDANDO",
  "CORTE",
  "COSTURA",
  "ACABAMENTO",
  "CONCLUIDO",
];

export async function createOrdemProducao(formData: FormData) {
  const produtoId = String(formData.get("produtoId") || "");
  const pedidoId = String(formData.get("pedidoId") || "") || null;
  const quantidade = Number(formData.get("quantidade") || 0);
  const dataPrevistaRaw = String(formData.get("dataPrevista") || "");

  if (!produtoId) throw new Error("Selecione um produto");
  if (quantidade <= 0) throw new Error("Quantidade deve ser maior que zero");

  const ordem = await prisma.ordemProducao.create({
    data: {
      produtoId,
      pedidoId,
      quantidade,
      dataPrevista: dataPrevistaRaw ? new Date(dataPrevistaRaw) : null,
    },
  });

  revalidatePath("/producao");
  redirect(`/producao/${ordem.id}`);
}

export async function avancarEtapaAction(id: string) {
  const ordem = await prisma.ordemProducao.findUniqueOrThrow({
    where: { id },
  });

  const currentIndex = ETAPA_ORDER.indexOf(ordem.etapa);
  const nextEtapa = ETAPA_ORDER[currentIndex + 1];
  if (!nextEtapa) return;

  await prisma.$transaction(async (tx) => {
    await tx.ordemProducao.update({
      where: { id },
      data: {
        etapa: nextEtapa,
        dataConclusao: nextEtapa === "CONCLUIDO" ? new Date() : undefined,
      },
    });

    if (nextEtapa === "CORTE") {
      const fichaItens = await tx.fichaProducaoItem.findMany({
        where: { produtoId: ordem.produtoId },
        include: { materiaPrima: true },
      });

      for (const item of fichaItens) {
        const necessario = item.quantidade * ordem.quantidade;
        if (item.materiaPrima.estoqueAtual < necessario) {
          throw new Error(
            `Estoque insuficiente de "${item.materiaPrima.nome}" para iniciar o corte. Necessário: ${necessario} ${item.materiaPrima.unidade}, disponível: ${item.materiaPrima.estoqueAtual}.`
          );
        }
      }

      for (const item of fichaItens) {
        const necessario = item.quantidade * ordem.quantidade;
        await tx.materiaPrima.update({
          where: { id: item.materiaPrimaId },
          data: { estoqueAtual: { decrement: necessario } },
        });
        await tx.movimentoEstoque.create({
          data: {
            tipo: "SAIDA",
            itemTipo: "MATERIA_PRIMA",
            materiaPrimaId: item.materiaPrimaId,
            quantidade: necessario,
            motivo: "Consumo automático — início do corte (OS)",
          },
        });
      }
    }

    if (nextEtapa === "CONCLUIDO") {
      await tx.produto.update({
        where: { id: ordem.produtoId },
        data: { estoqueAtual: { increment: ordem.quantidade } },
      });
      await tx.movimentoEstoque.create({
        data: {
          tipo: "ENTRADA",
          itemTipo: "PRODUTO",
          produtoId: ordem.produtoId,
          quantidade: ordem.quantidade,
          motivo: `Conclusão da ordem de produção`,
        },
      });
    }
  });

  revalidatePath("/producao");
  revalidatePath(`/producao/${id}`);
  revalidatePath("/estoque");
}

export async function deleteOrdemProducao(id: string) {
  const ordem = await prisma.ordemProducao.findUniqueOrThrow({
    where: { id },
  });
  if (ordem.etapa !== "AGUARDANDO") {
    throw new Error(
      "Não é possível excluir uma ordem que já iniciou produção (estoque já foi movimentado)."
    );
  }
  await prisma.ordemProducao.delete({ where: { id } });
  revalidatePath("/producao");
  redirect("/producao");
}
