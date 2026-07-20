import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { changeStatusAction, deletePedido } from "../actions";
import {
  cardClass,
  dangerButtonClass,
  inputClass,
  primaryButtonClass,
  tableWrapperClass,
  tdClass,
  thClass,
} from "@/components/ui";
import { currency, dateBR } from "@/lib/format";

const STATUS_OPTIONS = [
  { value: "ABERTO", label: "Aberto" },
  { value: "EM_PRODUCAO", label: "Em produção" },
  { value: "FATURADO", label: "Faturado" },
  { value: "CANCELADO", label: "Cancelado" },
];

export default async function PedidoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: {
      cliente: true,
      itens: { include: { produto: true } },
      ordens: true,
    },
  });

  if (!pedido) notFound();

  const total = pedido.itens.reduce(
    (acc, item) => acc + item.quantidade * item.precoUnitario,
    0
  );

  const changeStatusWithId = changeStatusAction.bind(null, id);
  const deleteWithId = deletePedido.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Pedido de {pedido.cliente.nome}
          </h1>
          <p className="text-sm text-slate-500">{dateBR(pedido.data)}</p>
        </div>
        <Link
          href={`/producao/novo?pedidoId=${pedido.id}`}
          className={primaryButtonClass}
        >
          Criar ordem de produção
        </Link>
      </div>

      <div className={cardClass}>
        <h2 className="mb-3 text-sm font-semibold text-slate-500">Cliente</h2>
        <p className="text-sm text-slate-700">{pedido.cliente.nome}</p>
        <p className="text-sm text-slate-500">{pedido.cliente.telefone}</p>
        <p className="text-sm text-slate-500">{pedido.cliente.email}</p>
      </div>

      <div className={tableWrapperClass}>
        <table className="w-full min-w-[560px]">
          <thead className="border-b border-slate-200">
            <tr>
              <th className={thClass}>Produto</th>
              <th className={thClass}>Quantidade</th>
              <th className={thClass}>Preço unit.</th>
              <th className={thClass}>Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pedido.itens.map((item) => (
              <tr key={item.id}>
                <td className={tdClass}>{item.produto.nome}</td>
                <td className={tdClass}>{item.quantidade}</td>
                <td className={tdClass}>{currency(item.precoUnitario)}</td>
                <td className={tdClass}>
                  {currency(item.quantidade * item.precoUnitario)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200">
              <td className={tdClass} colSpan={3}>
                <span className="font-semibold">Total</span>
              </td>
              <td className={`${tdClass} font-semibold`}>{currency(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {pedido.ordens.length > 0 && (
        <div className={cardClass}>
          <h2 className="mb-3 text-sm font-semibold text-slate-500">
            Ordens de produção vinculadas
          </h2>
          <ul className="flex flex-col gap-1">
            {pedido.ordens.map((ordem) => (
              <li key={ordem.id} className="text-sm">
                <Link
                  href={`/producao/${ordem.id}`}
                  className="text-slate-600 hover:text-slate-900"
                >
                  OS {ordem.id.slice(-6)} — {ordem.etapa}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={`${cardClass} max-w-sm`}>
        <h2 className="mb-3 text-sm font-semibold text-slate-500">Status</h2>
        <form action={changeStatusWithId} className="flex items-center gap-2">
          <select
            name="status"
            defaultValue={pedido.status}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button type="submit" className={primaryButtonClass}>
            Atualizar
          </button>
        </form>
      </div>

      <form action={deleteWithId} className="max-w-sm border-t border-slate-200 pt-4">
        <button type="submit" className={dangerButtonClass}>
          Excluir pedido
        </button>
      </form>
    </div>
  );
}
