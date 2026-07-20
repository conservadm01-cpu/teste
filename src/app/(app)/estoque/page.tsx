import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  primaryButtonClass,
  secondaryButtonClass,
  tableWrapperClass,
  tdClass,
  thClass,
} from "@/components/ui";
import { currency } from "@/lib/format";

export default async function EstoquePage() {
  const [materiasPrimas, produtos] = await Promise.all([
    prisma.materiaPrima.findMany({ orderBy: { nome: "asc" } }),
    prisma.produto.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Estoque</h1>
          <p className="text-sm text-slate-500">
            Matérias-primas, produtos e movimentações.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/estoque/movimentos" className={secondaryButtonClass}>
            Movimentações
          </Link>
          <Link
            href="/estoque/movimentos/nova"
            className={primaryButtonClass}
          >
            Nova movimentação
          </Link>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Matérias-primas
          </h2>
          <Link
            href="/estoque/materia-prima/novo"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            + Adicionar matéria-prima
          </Link>
        </div>
        <div className={tableWrapperClass}>
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-slate-200">
              <tr>
                <th className={thClass}>Nome</th>
                <th className={thClass}>Tipo</th>
                <th className={thClass}>Unidade</th>
                <th className={thClass}>Estoque atual</th>
                <th className={thClass}>Estoque mínimo</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materiasPrimas.map((item) => {
                const baixo = item.estoqueAtual <= item.estoqueMinimo;
                return (
                  <tr key={item.id} className={baixo ? "bg-red-50" : ""}>
                    <td className={tdClass}>{item.nome}</td>
                    <td className={tdClass}>{item.tipo}</td>
                    <td className={tdClass}>{item.unidade}</td>
                    <td className={`${tdClass} ${baixo ? "font-semibold text-red-600" : ""}`}>
                      {item.estoqueAtual}
                    </td>
                    <td className={tdClass}>{item.estoqueMinimo}</td>
                    <td className={`${tdClass} text-right`}>
                      <Link
                        href={`/estoque/materia-prima/${item.id}`}
                        className="font-medium text-slate-600 hover:text-slate-900"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {materiasPrimas.length === 0 && (
                <tr>
                  <td className={tdClass} colSpan={6}>
                    Nenhuma matéria-prima cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Produtos</h2>
          <Link
            href="/estoque/produtos/novo"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            + Adicionar produto
          </Link>
        </div>
        <div className={tableWrapperClass}>
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-slate-200">
              <tr>
                <th className={thClass}>Nome</th>
                <th className={thClass}>SKU</th>
                <th className={thClass}>Preço de venda</th>
                <th className={thClass}>Estoque atual</th>
                <th className={thClass}>Estoque mínimo</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {produtos.map((produto) => {
                const baixo = produto.estoqueAtual <= produto.estoqueMinimo;
                return (
                  <tr key={produto.id} className={baixo ? "bg-red-50" : ""}>
                    <td className={tdClass}>{produto.nome}</td>
                    <td className={tdClass}>{produto.sku}</td>
                    <td className={tdClass}>{currency(produto.precoVenda)}</td>
                    <td className={`${tdClass} ${baixo ? "font-semibold text-red-600" : ""}`}>
                      {produto.estoqueAtual}
                    </td>
                    <td className={tdClass}>{produto.estoqueMinimo}</td>
                    <td className={`${tdClass} text-right`}>
                      <Link
                        href={`/estoque/produtos/${produto.id}`}
                        className="font-medium text-slate-600 hover:text-slate-900"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {produtos.length === 0 && (
                <tr>
                  <td className={tdClass} colSpan={6}>
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
