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
  ABERTO: "Aberto",
  EM_PRODUCAO: "Em produção",
  FATURADO: "Faturado",
  CANCELADO: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  ABERTO: "text-slate-600",
  EM_PRODUCAO: "text-amber-600",
  FATURADO: "text-green-600",
  CANCELADO: "text-red-600",
};

export default async function PedidosPage() {
  const pedidos = await prisma.pedido.findMany({
    orderBy: { data: "desc" },
    include: { cliente: true, itens: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Pedidos</h1>
          <p className="text-sm text-slate-500">
            {pedidos.length} pedido(s) registrado(s).
          </p>
        </div>
        <Link href="/pedidos/novo" className={primaryButtonClass}>
          Novo pedido
        </Link>
      </div>

      <div className={tableWrapperClass}>
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-slate-200">
            <tr>
              <th className={thClass}>Data</th>
              <th className={thClass}>Cliente</th>
              <th className={thClass}>Itens</th>
              <th className={thClass}>Total</th>
              <th className={thClass}>Status</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pedidos.map((pedido) => {
              const total = pedido.itens.reduce(
                (acc, item) => acc + item.quantidade * item.precoUnitario,
                0
              );
              return (
                <tr key={pedido.id}>
                  <td className={tdClass}>{dateBR(pedido.data)}</td>
                  <td className={tdClass}>{pedido.cliente.nome}</td>
                  <td className={tdClass}>{pedido.itens.length}</td>
                  <td className={tdClass}>{currency(total)}</td>
                  <td className={tdClass}>
                    <span
                      className={`font-medium ${STATUS_COLORS[pedido.status]}`}
                    >
                      {STATUS_LABELS[pedido.status]}
                    </span>
                  </td>
                  <td className={`${tdClass} text-right`}>
                    <Link
                      href={`/pedidos/${pedido.id}`}
                      className="font-medium text-slate-600 hover:text-slate-900"
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              );
            })}
            {pedidos.length === 0 && (
              <tr>
                <td className={tdClass} colSpan={6}>
                  Nenhum pedido registrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
