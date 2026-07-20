import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduto, deleteProduto } from "../../actions";
import { ProdutoForm } from "../../produto-form";
import { dangerButtonClass } from "@/components/ui";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const produto = await prisma.produto.findUnique({ where: { id } });

  if (!produto) notFound();

  const updateWithId = updateProduto.bind(null, id);
  const deleteWithId = deleteProduto.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Editar produto
      </h1>
      <ProdutoForm produto={produto} action={updateWithId} />

      <form action={deleteWithId} className="max-w-lg border-t border-slate-200 pt-4">
        <button type="submit" className={dangerButtonClass}>
          Excluir produto
        </button>
      </form>
    </div>
  );
}
