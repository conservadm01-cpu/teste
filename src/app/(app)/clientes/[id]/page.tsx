import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCliente, deleteCliente } from "../actions";
import { ClienteForm } from "../cliente-form";
import { dangerButtonClass } from "@/components/ui";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await prisma.cliente.findUnique({ where: { id } });

  if (!cliente) notFound();

  const updateWithId = updateCliente.bind(null, id);
  const deleteWithId = deleteCliente.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Editar cliente
      </h1>
      <ClienteForm cliente={cliente} action={updateWithId} />

      <form action={deleteWithId} className="max-w-lg border-t border-slate-200 pt-4">
        <button type="submit" className={dangerButtonClass}>
          Excluir cliente
        </button>
      </form>
    </div>
  );
}
