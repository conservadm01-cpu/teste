import { prisma } from "@/lib/prisma";
import { createMovimento } from "../../actions";
import { MovimentoForm } from "./movimento-form";

export default async function NovaMovimentacaoPage() {
  const [materiasPrimas, produtos] = await Promise.all([
    prisma.materiaPrima.findMany({
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    prisma.produto.findMany({
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Nova movimentação de estoque
      </h1>
      <MovimentoForm
        materiasPrimas={materiasPrimas}
        produtos={produtos}
        action={createMovimento}
      />
    </div>
  );
}
