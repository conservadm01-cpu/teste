"use client";

import { useMemo, useState } from "react";
import { inputClass, labelClass, primaryButtonClass } from "@/components/ui";

type Item = { id: string; nome: string };

export function MovimentoForm({
  materiasPrimas,
  produtos,
  action,
}: {
  materiasPrimas: Item[];
  produtos: Item[];
  action: (formData: FormData) => void;
}) {
  const [itemTipo, setItemTipo] = useState<"MATERIA_PRIMA" | "PRODUTO">(
    "MATERIA_PRIMA"
  );

  const options = useMemo(
    () => (itemTipo === "MATERIA_PRIMA" ? materiasPrimas : produtos),
    [itemTipo, materiasPrimas, produtos]
  );

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="tipo" className={labelClass}>
          Tipo de movimento
        </label>
        <select id="tipo" name="tipo" className={inputClass} defaultValue="ENTRADA">
          <option value="ENTRADA">Entrada</option>
          <option value="SAIDA">Saída</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="itemTipo" className={labelClass}>
          Categoria do item
        </label>
        <select
          id="itemTipo"
          name="itemTipo"
          className={inputClass}
          value={itemTipo}
          onChange={(e) =>
            setItemTipo(e.target.value as "MATERIA_PRIMA" | "PRODUTO")
          }
        >
          <option value="MATERIA_PRIMA">Matéria-prima</option>
          <option value="PRODUTO">Produto</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="itemId" className={labelClass}>
          Item
        </label>
        <select id="itemId" name="itemId" required className={inputClass}>
          <option value="">Selecione...</option>
          {options.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="quantidade" className={labelClass}>
          Quantidade
        </label>
        <input
          id="quantidade"
          name="quantidade"
          type="number"
          step="any"
          min="0.01"
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="motivo" className={labelClass}>
          Motivo / observação
        </label>
        <input id="motivo" name="motivo" className={inputClass} />
      </div>

      <button type="submit" className={`${primaryButtonClass} mt-2 self-start`}>
        Registrar movimentação
      </button>
    </form>
  );
}
