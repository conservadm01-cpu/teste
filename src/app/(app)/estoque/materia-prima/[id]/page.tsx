import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateMateriaPrima, deleteMateriaPrima } from "../../actions";
import { MateriaPrimaForm } from "../../materia-prima-form";
import { dangerButtonClass } from "@/components/ui";

export default async function EditarMateriaPrimaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.materiaPrima.findUnique({ where: { id } });

  if (!item) notFound();

  const updateWithId = updateMateriaPrima.bind(null, id);
  const deleteWithId = deleteMateriaPrima.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Editar matéria-prima
      </h1>
      <MateriaPrimaForm item={item} action={updateWithId} />

      <form action={deleteWithId} className="max-w-lg border-t border-slate-200 pt-4">
        <button type="submit" className={dangerButtonClass}>
          Excluir matéria-prima
        </button>
      </form>
    </div>
  );
}
