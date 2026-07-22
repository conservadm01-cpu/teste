"use client";

import { useTransition } from "react";
import { changeEstagioLead } from "./actions";
import type { EstagioLead } from "@prisma/client";

const ESTAGIOS: { value: EstagioLead; label: string }[] = [
  { value: "NOVO", label: "Novo" },
  { value: "CONTATO", label: "Em contato" },
  { value: "NEGOCIACAO", label: "Negociação" },
  { value: "FECHADO", label: "Fechado" },
  { value: "PERDIDO", label: "Perdido" },
];

export function EstagioSelect({
  leadId,
  estagioAtual,
}: {
  leadId: string;
  estagioAtual: EstagioLead;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value=""
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as EstagioLead;
        startTransition(() => {
          changeEstagioLead(leadId, next);
        });
      }}
      className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 disabled:opacity-50"
    >
      <option value="" disabled>
        Mover para...
      </option>
      {ESTAGIOS.filter((e) => e.value !== estagioAtual).map((e) => (
        <option key={e.value} value={e.value}>
          {e.label}
        </option>
      ))}
    </select>
  );
}
