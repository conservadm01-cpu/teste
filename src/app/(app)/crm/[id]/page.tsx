import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  updateLead,
  deleteLead,
  converterLeadEmCliente,
  criarOrcamentoDoLead,
} from "../actions";
import { LeadForm } from "../lead-form";
import {
  cardClass,
  dangerButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/ui";
import { currency, dateBR } from "@/lib/format";

export default async function EditarLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      cliente: true,
      orcamentos: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!lead) notFound();

  const updateWithId = updateLead.bind(null, id);
  const deleteWithId = deleteLead.bind(null, id);
  const converterWithId = converterLeadEmCliente.bind(null, id);
  const criarOrcamentoWithId = criarOrcamentoDoLead.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Editar lead</h1>

      <div className={`${cardClass} flex flex-wrap items-center gap-3`}>
        {lead.cliente ? (
          <Link
            href={`/clientes/${lead.cliente.id}`}
            className="text-sm font-medium text-slate-900 underline"
          >
            Ver cliente: {lead.cliente.nome}
          </Link>
        ) : (
          <form action={converterWithId}>
            <button type="submit" className={secondaryButtonClass}>
              Converter em cliente
            </button>
          </form>
        )}

        <form action={criarOrcamentoWithId}>
          <button type="submit" className={primaryButtonClass}>
            Criar orçamento
          </button>
        </form>
      </div>

      {lead.orcamentos.length > 0 && (
        <div className={`${cardClass} max-w-lg`}>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">
            Orçamentos deste lead
          </h2>
          <ul className="flex flex-col gap-1">
            {lead.orcamentos.map((orc) => (
              <li key={orc.id} className="text-sm">
                <Link
                  href={`/orcamentos/${orc.id}`}
                  className="text-slate-600 hover:text-slate-900"
                >
                  {dateBR(orc.createdAt)} — {currency(orc.valorEstimado)} —{" "}
                  {orc.status}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <LeadForm lead={lead} action={updateWithId} />

      <form action={deleteWithId} className="max-w-lg border-t border-slate-200 pt-4">
        <button type="submit" className={dangerButtonClass}>
          Excluir lead
        </button>
      </form>
    </div>
  );
}
