import { inputClass, labelClass, primaryButtonClass } from "@/components/ui";
import type { MateriaPrima } from "@prisma/client";

const UNIDADES = ["METRO", "KG", "UNIDADE", "ROLO", "PACOTE"];

export function MateriaPrimaForm({
  item,
  action,
}: {
  item?: MateriaPrima;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="nome" className={labelClass}>
          Nome *
        </label>
        <input
          id="nome"
          name="nome"
          required
          defaultValue={item?.nome}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tipo" className={labelClass}>
          Tipo (ex: tecido, aviamento)
        </label>
        <input
          id="tipo"
          name="tipo"
          defaultValue={item?.tipo}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="unidade" className={labelClass}>
          Unidade de medida
        </label>
        <select
          id="unidade"
          name="unidade"
          defaultValue={item?.unidade ?? "UNIDADE"}
          className={inputClass}
        >
          {UNIDADES.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="estoqueAtual" className={labelClass}>
            Estoque atual
          </label>
          <input
            id="estoqueAtual"
            name="estoqueAtual"
            type="number"
            step="any"
            defaultValue={item?.estoqueAtual ?? 0}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="estoqueMinimo" className={labelClass}>
            Estoque mínimo
          </label>
          <input
            id="estoqueMinimo"
            name="estoqueMinimo"
            type="number"
            step="any"
            defaultValue={item?.estoqueMinimo ?? 0}
            className={inputClass}
          />
        </div>
      </div>

      <button type="submit" className={`${primaryButtonClass} mt-2 self-start`}>
        Salvar
      </button>
    </form>
  );
}
