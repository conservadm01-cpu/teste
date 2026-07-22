import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { primaryButtonClass } from "@/components/ui";
import { EstagioSelect } from "./estagio-select";
import type { EstagioLead } from "@prisma/client";

const ESTAGIOS: { value: EstagioLead; label: string }[] = [
  { value: "NOVO", label: "Novo" },
  { value: "CONTATO", label: "Em contato" },
  { value: "NEGOCIACAO", label: "Negociação" },
  { value: "FECHADO", label: "Fechado" },
  { value: "PERDIDO", label: "Perdido" },
];

export default async function CrmPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">CRM</h1>
          <p className="text-sm text-slate-500">
            {leads.length} lead(s) no funil de vendas.
          </p>
        </div>
        <Link href="/crm/novo" className={primaryButtonClass}>
          Novo lead
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ESTAGIOS.map((estagio) => {
          const leadsDoEstagio = leads.filter(
            (lead) => lead.estagio === estagio.value
          );
          return (
            <div key={estagio.value} className="flex min-w-[220px] flex-col gap-3">
              <h2 className="text-sm font-semibold text-slate-500">
                {estagio.label} ({leadsDoEstagio.length})
              </h2>
              <div className="flex flex-col gap-2">
                {leadsDoEstagio.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <Link
                      href={`/crm/${lead.id}`}
                      className="text-sm font-medium text-slate-900 hover:underline"
                    >
                      {lead.nome}
                    </Link>
                    {lead.empresa && (
                      <p className="text-xs text-slate-500">{lead.empresa}</p>
                    )}
                    {estagio.value !== "FECHADO" &&
                      estagio.value !== "PERDIDO" && (
                        <div className="mt-2">
                          <EstagioSelect
                            leadId={lead.id}
                            estagioAtual={lead.estagio}
                          />
                        </div>
                      )}
                  </div>
                ))}
                {leadsDoEstagio.length === 0 && (
                  <p className="text-xs text-slate-400">Nenhum lead.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
