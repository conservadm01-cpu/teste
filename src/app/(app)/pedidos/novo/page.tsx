import { prisma } from "@/lib/prisma";
import { createPedido } from "../actions";
import { PedidoForm } from "./pedido-form";

export default async function NovoPedidoPage() {
  const [clientes, produtos] = await Promise.all([
    prisma.cliente.findMany({
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    prisma.produto.findMany({
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, precoVenda: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Novo pedido</h1>
      {clientes.length === 0 || produtos.length === 0 ? (
        <p className="max-w-lg rounded-md bg-amber-50 p-4 text-sm text-amber-800">
          Cadastre ao menos um cliente e um produto antes de criar um pedido.
        </p>
      ) : (
        <PedidoForm clientes={clientes} produtos={produtos} action={createPedido} />
      )}
    </div>
  );
}
