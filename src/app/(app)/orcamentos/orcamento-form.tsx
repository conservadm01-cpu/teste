import { inputClass, labelClass, primaryButtonClass } from "@/components/ui";
import type { Orcamento } from "@prisma/client";

type Cliente = { id: string; nome: string };

function toDateInputValue(date: Date | null) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function OrcamentoForm({
  orcamento,
  clientes,
  defaultClienteId,
  action,
}: {
  orcamento?: Orcamento;
  clientes: Cliente[];
  defaultClienteId?: string;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="clienteId" className={labelClass}>
          Cliente *
        </label>
        <select
          id="clienteId"
          name="clienteId"
          required
          defaultValue={orcamento?.clienteId ?? defaultClienteId ?? ""}
          className={inputClass}
        >
          <option value="">Selecione...</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="descricao" className={labelClass}>
          Descrição *
        </label>
        <textarea
          id="descricao"
          name="descricao"
          required
          rows={3}
          defaultValue={orcamento?.descricao}
          className={inputClass}
          placeholder="Ex: 100 camisetas personalizadas, entrega em 30 dias"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="valorEstimado" className={labelClass}>
          Valor estimado (R$) *
        </label>
        <input
          id="valorEstimado"
          name="valorEstimado"
          type="number"
          step="0.01"
          min="0.01"
          required
          defaultValue={orcamento?.valorEstimado}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="validade" className={labelClass}>
          Válido até
        </label>
        <input
          id="validade"
          name="validade"
          type="date"
          defaultValue={toDateInputValue(orcamento?.validade ?? null)}
          className={inputClass}
        />
      </div>

      <button type="submit" className={`${primaryButtonClass} mt-2 self-start`}>
        Salvar
      </button>
    </form>
  );
}
