import { createContaPagar } from "../../actions";
import { inputClass, labelClass, primaryButtonClass } from "@/components/ui";

export default function NovaContaPagarPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Nova conta a pagar
      </h1>
      <form action={createContaPagar} className="flex max-w-lg flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="descricao" className={labelClass}>
            Descrição *
          </label>
          <input id="descricao" name="descricao" required className={inputClass} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fornecedor" className={labelClass}>
            Fornecedor
          </label>
          <input id="fornecedor" name="fornecedor" className={inputClass} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="valor" className={labelClass}>
            Valor (R$) *
          </label>
          <input
            id="valor"
            name="valor"
            type="number"
            step="0.01"
            min="0.01"
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="vencimento" className={labelClass}>
            Vencimento *
          </label>
          <input
            id="vencimento"
            name="vencimento"
            type="date"
            required
            className={inputClass}
          />
        </div>

        <button type="submit" className={`${primaryButtonClass} mt-2 self-start`}>
          Salvar
        </button>
      </form>
    </div>
  );
}
