import { prisma } from "@/lib/prisma";
import { createOrdemProducao } from "../actions";
import { inputClass, labelClass, primaryButtonClass } from "@/components/ui";

export default async function NovaOrdemProducaoPage({
  searchParams,
}: {
  searchParams: Promise<{ pedidoId?: string }>;
}) {
  const { pedidoId } = await searchParams;

  const [produtos, pedido] = await Promise.all([
    prisma.produto.findMany({ orderBy: { nome: "asc" } }),
    pedidoId
      ? prisma.pedido.findUnique({
          where: { id: pedidoId },
          include: { cliente: true, itens: true },
        })
      : null,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Nova ordem de produção
      </h1>

      {pedido && (
        <p className="max-w-lg rounded-md bg-slate-100 p-3 text-sm text-slate-600">
          Vinculada ao pedido de <strong>{pedido.cliente.nome}</strong>
        </p>
      )}

      {produtos.length === 0 ? (
        <p className="max-w-lg rounded-md bg-amber-50 p-4 text-sm text-amber-800">
          Cadastre ao menos um produto antes de criar uma ordem de produção.
        </p>
      ) : (
        <form action={createOrdemProducao} className="flex max-w-lg flex-col gap-4">
          {pedido && <input type="hidden" name="pedidoId" value={pedido.id} />}

          <div className="flex flex-col gap-1">
            <label htmlFor="produtoId" className={labelClass}>
              Produto *
            </label>
            <select
              id="produtoId"
              name="produtoId"
              required
              defaultValue={
                pedido && pedido.itens.length === 1
                  ? pedido.itens[0].produtoId
                  : ""
              }
              className={inputClass}
            >
              <option value="">Selecione...</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="quantidade" className={labelClass}>
              Quantidade *
            </label>
            <input
              id="quantidade"
              name="quantidade"
              type="number"
              min="0.01"
              step="any"
              required
              defaultValue={
                pedido && pedido.itens.length === 1
                  ? pedido.itens[0].quantidade
                  : undefined
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="dataPrevista" className={labelClass}>
              Data prevista de conclusão
            </label>
            <input
              id="dataPrevista"
              name="dataPrevista"
              type="date"
              className={inputClass}
            />
          </div>

          <button type="submit" className={`${primaryButtonClass} mt-2 self-start`}>
            Criar ordem de produção
          </button>
        </form>
      )}
    </div>
  );
}
