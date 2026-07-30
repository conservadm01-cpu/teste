import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { primaryButtonClass } from "@/components/ui";
import { KanbanBoard } from "./kanban-board";

export default async function CrmPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">CRM</h1>
          <p className="text-sm text-slate-500">
            {leads.length} lead(s) no funil de vendas. Arraste os cartões
            entre as colunas para mudar o estágio.
          </p>
        </div>
        <Link href="/crm/novo" className={primaryButtonClass}>
          Novo lead
        </Link>
      </div>

      <KanbanBoard leads={leads} />
    </div>
  );
}
