"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { changeEstagioLead } from "./actions";
import type { EstagioLead, Lead } from "@prisma/client";

const ESTAGIOS: { value: EstagioLead; label: string }[] = [
  { value: "NOVO", label: "Novo" },
  { value: "CONTATO", label: "Em contato" },
  { value: "NEGOCIACAO", label: "Negociação" },
  { value: "FECHADO", label: "Fechado" },
  { value: "PERDIDO", label: "Perdido" },
];

export function KanbanBoard({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<EstagioLead | null>(null);
  const [, startTransition] = useTransition();

  function handleDrop(estagio: EstagioLead) {
    setOverColumn(null);
    const id = dragId;
    setDragId(null);
    if (!id) return;

    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.estagio === estagio) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, estagio } : l))
    );
    startTransition(() => {
      changeEstagioLead(id, estagio);
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {ESTAGIOS.map((estagio) => {
        const leadsDoEstagio = leads.filter(
          (lead) => lead.estagio === estagio.value
        );
        const isOver = overColumn === estagio.value;

        return (
          <div
            key={estagio.value}
            onDragOver={(e) => {
              e.preventDefault();
              if (overColumn !== estagio.value) setOverColumn(estagio.value);
            }}
            onDragLeave={() =>
              setOverColumn((current) =>
                current === estagio.value ? null : current
              )
            }
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(estagio.value);
            }}
            className={`flex min-w-[220px] flex-col gap-3 rounded-lg p-2 transition-colors ${
              isOver ? "bg-blue-50 ring-2 ring-blue-200" : ""
            }`}
          >
            <h2 className="text-sm font-semibold text-slate-500">
              {estagio.label} ({leadsDoEstagio.length})
            </h2>
            <div className="flex min-h-16 flex-col gap-2">
              {leadsDoEstagio.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => {
                    setDragId(lead.id);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverColumn(null);
                  }}
                  className={`cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing ${
                    dragId === lead.id ? "opacity-40" : ""
                  }`}
                >
                  <Link
                    href={`/crm/${lead.id}`}
                    draggable={false}
                    className="text-sm font-medium text-slate-900 hover:underline"
                  >
                    {lead.nome}
                  </Link>
                  {lead.empresa && (
                    <p className="text-xs text-slate-500">{lead.empresa}</p>
                  )}
                </div>
              ))}
              {leadsDoEstagio.length === 0 && (
                <p className="text-xs text-slate-400">
                  {isOver ? "Solte aqui" : "Nenhum lead."}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
