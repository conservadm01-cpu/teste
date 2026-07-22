import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { avancarEtapaAction, deleteOrdemProducao } from "../actions";
import { cardClass, dangerButtonClass, primaryButtonClass } from "@/components/ui";
import { dateBR } from "@/lib/format";

const ETAPAS = [
  { value: "AGUARDANDO", label: "Aguardando" },
  { value: "CORTE", label: "Corte" },
  { value: "COSTURA", label: "Costura" },
  { value: "ACABAMENTO", label: "Acabamento" },
  { value: "CONCLUIDO", label: "Concluído" },
];

export default async function OrdemProducaoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ordem = await prisma.ordemProducao.findUnique({
    where: { id },
    include: {
      produto: { include: { fichaItens: { include: { materiaPrima: true } } } },
      pedido: { include: { cliente: true } },
    },
  });

  if (!ordem) notFound();

  const currentIndex = ETAPAS.findIndex((e) => e.value === ordem.etapa);
  const avancarWithId = avancarEtapaAction.bind(null, id);
  const deleteWithId = deleteOrdemProducao.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Ordem de produção — {ordem.produto.nome}
        </h1>
        <p className="text-sm text-slate-500">
          Iniciada em {dateBR(ordem.dataInicio)}
          {ordem.pedido && (
            <>
              {" "}
              — pedido de{" "}
              <Link
                href={`/pedidos/${ordem.pedido.id}`}
                className="text-slate-600 underline hover:text-slate-900"
              >
                {ordem.pedido.cliente.nome}
              </Link>
            </>
          )}
        </p>
      </div>

      <div className={cardClass}>
        <p className="text-sm text-slate-500">Quantidade</p>
        <p className="text-lg font-semibold text-slate-900">
          {ordem.quantidade}
        </p>
      </div>

      {ordem.etapa === "AGUARDANDO" && ordem.produto.fichaItens.length > 0 && (
        <div className={cardClass}>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">
            Matéria-prima que será consumida no corte
          </h2>
          <ul className="flex flex-col gap-1 text-sm text-slate-700">
            {ordem.produto.fichaItens.map((item) => (
              <li key={item.id}>
                {item.materiaPrima.nome}:{" "}
                {item.quantidade * ordem.quantidade} {item.materiaPrima.unidade}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={cardClass}>
        <h2 className="mb-4 text-sm font-semibold text-slate-500">
          Etapas de produção
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {ETAPAS.map((etapa, i) => (
            <div key={etapa.value} className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  i <= currentIndex
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {etapa.label}
              </span>
              {i < ETAPAS.length - 1 && (
                <span className="text-slate-300">→</span>
              )}
            </div>
          ))}
        </div>

        {ordem.etapa !== "CONCLUIDO" && (
          <form action={avancarWithId} className="mt-4">
            <button type="submit" className={primaryButtonClass}>
              Avançar para {ETAPAS[currentIndex + 1].label}
            </button>
          </form>
        )}

        {ordem.etapa === "CONCLUIDO" && (
          <p className="mt-4 text-sm text-green-600">
            Ordem concluída em {ordem.dataConclusao && dateBR(ordem.dataConclusao)}.
            Estoque de produto atualizado automaticamente.
          </p>
        )}
      </div>

      {ordem.etapa === "AGUARDANDO" && (
        <form action={deleteWithId} className="max-w-sm border-t border-slate-200 pt-4">
          <button type="submit" className={dangerButtonClass}>
            Excluir ordem de produção
          </button>
        </form>
      )}
    </div>
  );
}
