import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dateBR } from "@/lib/format";

export default async function FichaImprimirPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const produto = await prisma.produto.findUnique({
    where: { id },
    include: { fichaItens: { include: { materiaPrima: true } } },
  });

  if (!produto) notFound();

  return (
    <div className="mx-auto max-w-2xl p-8 print:p-4">
      <header className="mb-6 border-b border-slate-300 pb-4">
        <h1 className="text-xl font-bold text-slate-900">
          Ficha de Produção
        </h1>
        <p className="text-sm text-slate-500">
          Emitida em {dateBR(new Date())}
        </p>
      </header>

      <section className="mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Produto
        </h2>
        <p className="text-lg font-medium text-slate-900">{produto.nome}</p>
        <p className="text-sm text-slate-600">
          SKU: {produto.sku}
          {produto.categoria && ` — Categoria: ${produto.categoria}`}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Composição (por unidade)
        </h2>
        {produto.fichaItens.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum item cadastrado.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-300 text-left">
                <th className="py-1 pr-4">Matéria-prima</th>
                <th className="py-1">Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {produto.fichaItens.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-1 pr-4">{item.materiaPrima.nome}</td>
                  <td className="py-1">
                    {item.quantidade} {item.materiaPrima.unidade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Instruções de confecção
        </h2>
        <p className="whitespace-pre-wrap text-sm text-slate-700">
          {produto.instrucoes || "Nenhuma instrução cadastrada."}
        </p>
      </section>
    </div>
  );
}
