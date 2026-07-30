import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  updateOrcamento,
  aprovarOrcamento,
  rejeitarOrcamento,
  deleteOrcamento,
  marcarOrcamentoEnviado,
} from "../actions";
import { OrcamentoForm } from "../orcamento-form";
import {
  cardClass,
  dangerButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/ui";
import { currency, dateBR } from "@/lib/format";

const STATUS_LABELS: Record<string, string> = {
  RASCUNHO: "Rascunho",
  ENVIADO: "Enviado",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
};

export default async function OrcamentoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [orcamento, clientes] = await Promise.all([
    prisma.orcamento.findUnique({
      where: { id },
      include: { cliente: true, pedido: true, lead: true },
    }),
    prisma.cliente.findMany({
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
  ]);

  if (!orcamento) notFound();

  const updateWithId = updateOrcamento.bind(null, id);
  const aprovarWithId = aprovarOrcamento.bind(null, id);
  const rejeitarWithId = rejeitarOrcamento.bind(null, id);
  const deleteWithId = deleteOrcamento.bind(null, id);
  const marcarEnviadoWithId = marcarOrcamentoEnviado.bind(null, id);

  const editavel = orcamento.status === "RASCUNHO" || orcamento.status === "ENVIADO";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Orçamento — {orcamento.cliente.nome}
          </h1>
          <p className="text-sm text-slate-500">
            {dateBR(orcamento.createdAt)} · Status:{" "}
            <span className="font-medium">
              {STATUS_LABELS[orcamento.status]}
            </span>
          </p>
          {orcamento.lead && (
            <p className="text-sm text-slate-500">
              Originado do lead{" "}
              <Link
                href={`/crm/${orcamento.lead.id}`}
                className="underline hover:text-slate-900"
              >
                {orcamento.lead.nome}
              </Link>
            </p>
          )}
        </div>
        <Link
          href={`/orcamentos/${id}/imprimir`}
          target="_blank"
          className={secondaryButtonClass}
        >
          Imprimir orçamento
        </Link>
      </div>

      {orcamento.pedido ? (
        <div className={cardClass}>
          <p className="text-sm text-slate-500">
            Este orçamento foi aprovado e gerou um pedido.
          </p>
          <Link
            href={`/pedidos/${orcamento.pedido.id}`}
            className="text-sm font-medium text-slate-900 underline"
          >
            Ver pedido
          </Link>
        </div>
      ) : (
        orcamento.status !== "REJEITADO" && (
          <div className={`${cardClass} flex flex-wrap gap-3`}>
            {orcamento.status === "RASCUNHO" && (
              <form action={marcarEnviadoWithId}>
                <button type="submit" className={secondaryButtonClass}>
                  Marcar como enviado
                </button>
              </form>
            )}
            <form action={aprovarWithId}>
              <button type="submit" className={primaryButtonClass}>
                Aprovar e gerar pedido
              </button>
            </form>
            <form action={rejeitarWithId}>
              <button type="submit" className={secondaryButtonClass}>
                Rejeitar
              </button>
            </form>
          </div>
        )
      )}

      {editavel && !orcamento.pedido ? (
        <OrcamentoForm
          orcamento={orcamento}
          clientes={clientes}
          action={updateWithId}
        />
      ) : (
        <div className={`${cardClass} max-w-lg`}>
          <p className="text-sm text-slate-500">Descrição</p>
          <p className="mb-3 text-sm text-slate-700">{orcamento.descricao}</p>
          <p className="text-sm text-slate-500">Valor estimado</p>
          <p className="text-sm text-slate-700">
            {currency(orcamento.valorEstimado)}
          </p>
        </div>
      )}

      {!orcamento.pedido && (
        <form action={deleteWithId} className="max-w-lg border-t border-slate-200 pt-4">
          <button type="submit" className={dangerButtonClass}>
            Excluir orçamento
          </button>
        </form>
      )}
    </div>
  );
}
