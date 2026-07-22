import { createLead } from "../actions";
import { LeadForm } from "../lead-form";

export default function NovoLeadPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Novo lead</h1>
      <LeadForm action={createLead} />
    </div>
  );
}
