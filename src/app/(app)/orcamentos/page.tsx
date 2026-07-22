import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  primaryButtonClass,
  tableWrapperClass,
  tdClass,
  thClass,
} from "@/components/ui";
import { currency, dateBR } from "@/lib/format";

const STATUS_LABELS: Record<string, string> = {
  RASCUNHO: "Rascunho",
  ENVIADO: "Enviado",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
};

const STATUS_COLORS: Record<string, string> = {
  RASCUNHO: "text-slate-600",
  ENVIADO: "text-amber-600",
  APROVADO: "text-green-600",
  REJEITADO: "text-red-600",
};

export default async function OrcamentosPage() {
  const orcamentos = await prisma.orcamento.findMany({
    orderBy: { createdAt: "desc" },
    include: { cliente: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Orçamentos
          </h1>
          <p className="text-sm text-slate-500">
            {orcamentos.length} orçamento(s) registrado(s).
          </p>
        </div>
        <Link href="/orcamentos/novo" className={primaryButtonClass}>
          Novo orçamento
        </Link>
      </div>

      <div className={tableWrapperClass}>
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-slate-200">
            <tr>
              <th className={thClass}>Data</th>
              <th className={thClass}>Cliente</th>
              <th className={thClass}>Descrição</th>
              <th className={thClass}>Valor estimado</th>
              <th className={thClass}>Status</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orcamentos.map((orc) => (
              <tr key={orc.id}>
                <td className={tdClass}>{dateBR(orc.createdAt)}</td>
                <td className={tdClass}>{orc.cliente.nome}</td>
                <td className={tdClass}>{orc.descricao}</td>
                <td className={tdClass}>{currency(orc.valorEstimado)}</td>
                <td className={tdClass}>
                  <span className={`font-medium ${STATUS_COLORS[orc.status]}`}>
                    {STATUS_LABELS[orc.status]}
                  </span>
                </td>
                <td className={`${tdClass} text-right`}>
                  <Link
                    href={`/orcamentos/${orc.id}`}
                    className="font-medium text-slate-600 hover:text-slate-900"
                  >
                    Ver detalhes
                  </Link>
                </td>
              </tr>
            ))}
            {orcamentos.length === 0 && (
              <tr>
                <td className={tdClass} colSpan={6}>
                  Nenhum orçamento registrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
