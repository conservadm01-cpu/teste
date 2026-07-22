import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  primaryButtonClass,
  tableWrapperClass,
  tdClass,
  thClass,
} from "@/components/ui";
import { dateBR } from "@/lib/format";

const ETAPA_LABELS: Record<string, string> = {
  AGUARDANDO: "Aguardando",
  CORTE: "Corte",
  COSTURA: "Costura",
  ACABAMENTO: "Acabamento",
  CONCLUIDO: "Concluído",
};

const ETAPA_COLORS: Record<string, string> = {
  AGUARDANDO: "text-slate-600",
  CORTE: "text-amber-600",
  COSTURA: "text-amber-600",
  ACABAMENTO: "text-amber-600",
  CONCLUIDO: "text-green-600",
};

export default async function ProducaoPage() {
  const ordens = await prisma.ordemProducao.findMany({
    orderBy: { dataInicio: "desc" },
    include: { produto: true, pedido: { include: { cliente: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Produção</h1>
          <p className="text-sm text-slate-500">
            {ordens.length} ordem(ns) de produção.
          </p>
        </div>
        <Link href="/producao/novo" className={primaryButtonClass}>
          Nova ordem de produção
        </Link>
      </div>

      <div className={tableWrapperClass}>
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-slate-200">
            <tr>
              <th className={thClass}>Início</th>
              <th className={thClass}>Produto</th>
              <th className={thClass}>Quantidade</th>
              <th className={thClass}>Pedido</th>
              <th className={thClass}>Etapa</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ordens.map((ordem) => (
              <tr key={ordem.id}>
                <td className={tdClass}>{dateBR(ordem.dataInicio)}</td>
                <td className={tdClass}>{ordem.produto.nome}</td>
                <td className={tdClass}>{ordem.quantidade}</td>
                <td className={tdClass}>
                  {ordem.pedido ? ordem.pedido.cliente.nome : "-"}
                </td>
                <td className={tdClass}>
                  <span
                    className={`font-medium ${ETAPA_COLORS[ordem.etapa]}`}
                  >
                    {ETAPA_LABELS[ordem.etapa]}
                  </span>
                </td>
                <td className={`${tdClass} text-right`}>
                  <Link
                    href={`/producao/${ordem.id}`}
                    className="font-medium text-slate-600 hover:text-slate-900"
                  >
                    Ver detalhes
                  </Link>
                </td>
              </tr>
            ))}
            {ordens.length === 0 && (
              <tr>
                <td className={tdClass} colSpan={6}>
                  Nenhuma ordem de produção registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
