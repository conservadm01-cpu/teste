import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateInstrucoes, addFichaItem, removeFichaItem } from "./actions";
import {
  cardClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
  tableWrapperClass,
  tdClass,
  thClass,
} from "@/components/ui";

export default async function FichaProducaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [produto, materiasPrimas] = await Promise.all([
    prisma.produto.findUnique({
      where: { id },
      include: { fichaItens: { include: { materiaPrima: true } } },
    }),
    prisma.materiaPrima.findMany({ orderBy: { nome: "asc" } }),
  ]);

  if (!produto) notFound();

  const updateInstrucoesWithId = updateInstrucoes.bind(null, id);
  const addFichaItemWithId = addFichaItem.bind(null, id);
  const removeFichaItemWithId = removeFichaItem.bind(null, id);

  const materiasDisponiveis = materiasPrimas.filter(
    (m) => !produto.fichaItens.some((item) => item.materiaPrimaId === m.id)
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Ficha técnica — {produto.nome}
          </h1>
          <p className="text-sm text-slate-500">SKU {produto.sku}</p>
        </div>
        <Link
          href={`/estoque/produtos/${id}/ficha/imprimir`}
          target="_blank"
          className={secondaryButtonClass}
        >
          Imprimir / PDF
        </Link>
      </div>

      <section className={`${cardClass} flex flex-col gap-3`}>
        <h2 className="text-sm font-semibold text-slate-500">
          Composição (matéria-prima por unidade)
        </h2>

        <div className={tableWrapperClass}>
          <table className="w-full min-w-[480px]">
            <thead className="border-b border-slate-200">
              <tr>
                <th className={thClass}>Matéria-prima</th>
                <th className={thClass}>Qtd. por unidade</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {produto.fichaItens.map((item) => (
                <tr key={item.id}>
                  <td className={tdClass}>{item.materiaPrima.nome}</td>
                  <td className={tdClass}>
                    {item.quantidade} {item.materiaPrima.unidade}
                  </td>
                  <td className={`${tdClass} text-right`}>
                    <form action={removeFichaItemWithId.bind(null, item.id)}>
                      <button
                        type="submit"
                        className="font-medium text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {produto.fichaItens.length === 0 && (
                <tr>
                  <td className={tdClass} colSpan={3}>
                    Nenhum item na composição ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {materiasDisponiveis.length > 0 && (
          <form
            action={addFichaItemWithId}
            className="flex flex-wrap items-end gap-2"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="materiaPrimaId" className={labelClass}>
                Matéria-prima
              </label>
              <select
                id="materiaPrimaId"
                name="materiaPrimaId"
                required
                className={inputClass}
              >
                {materiasDisponiveis.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="quantidade" className={labelClass}>
                Qtd. por unidade
              </label>
              <input
                id="quantidade"
                name="quantidade"
                type="number"
                step="any"
                min="0.01"
                required
                className={`${inputClass} w-32`}
              />
            </div>
            <button type="submit" className={primaryButtonClass}>
              Adicionar
            </button>
          </form>
        )}
      </section>

      <section className={`${cardClass} flex flex-col gap-3`}>
        <h2 className="text-sm font-semibold text-slate-500">
          Instruções de confecção
        </h2>
        <form
          action={updateInstrucoesWithId}
          className="flex flex-col gap-3"
        >
          <textarea
            name="instrucoes"
            defaultValue={produto.instrucoes ?? ""}
            rows={6}
            className={inputClass}
            placeholder="Passo a passo de corte, costura, acabamento, variações de tamanho..."
          />
          <button type="submit" className={`${primaryButtonClass} self-start`}>
            Salvar instruções
          </button>
        </form>
      </section>
    </div>
  );
}
