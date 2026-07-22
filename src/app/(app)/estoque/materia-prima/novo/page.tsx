import { createMateriaPrima } from "../../actions";
import { MateriaPrimaForm } from "../../materia-prima-form";

export default function NovaMateriaPrimaPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Nova matéria-prima
      </h1>
      <MateriaPrimaForm action={createMateriaPrima} />
    </div>
  );
}
