import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  primaryButtonClass,
  tableWrapperClass,
  tdClass,
  thClass,
} from "@/components/ui";
import { dateBR } from "@/lib/format";

export default async function MovimentosPage() {
  const movimentos = await prisma.movimentoEstoque.findMany({
    orderBy: { data: "desc" },
    take: 100,
    include: { materiaPrima: true, produto: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Movimentações de estoque
          </h1>
          <p className="text-sm text-slate-500">
            Últimas {movimentos.length} movimentações.
          </p>
        </div>
        <Link href="/estoque/movimentos/nova" className={primaryButtonClass}>
          Nova movimentação
        </Link>
      </div>

      <div className={tableWrapperClass}>
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-slate-200">
            <tr>
              <th className={thClass}>Data</th>
              <th className={thClass}>Tipo</th>
              <th className={thClass}>Item</th>
              <th className={thClass}>Quantidade</th>
              <th className={thClass}>Motivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movimentos.map((mov) => (
              <tr key={mov.id}>
                <td className={tdClass}>{dateBR(mov.data)}</td>
                <td className={tdClass}>
                  <span
                    className={
                      mov.tipo === "ENTRADA"
                        ? "font-medium text-green-600"
                        : "font-medium text-red-600"
                    }
                  >
                    {mov.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                  </span>
                </td>
                <td className={tdClass}>
                  {mov.materiaPrima?.nome || mov.produto?.nome || "-"}
                </td>
                <td className={tdClass}>{mov.quantidade}</td>
                <td className={tdClass}>{mov.motivo || "-"}</td>
              </tr>
            ))}
            {movimentos.length === 0 && (
              <tr>
                <td className={tdClass} colSpan={5}>
                  Nenhuma movimentação registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
