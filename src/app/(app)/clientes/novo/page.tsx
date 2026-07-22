import { createCliente } from "../actions";
import { ClienteForm } from "../cliente-form";

export default function NovoClientePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Novo cliente</h1>
      <ClienteForm action={createCliente} />
    </div>
  );
}
