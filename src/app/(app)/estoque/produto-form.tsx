import { inputClass, labelClass, primaryButtonClass } from "@/components/ui";
import type { Produto } from "@prisma/client";

export function ProdutoForm({
  produto,
  action,
}: {
  produto?: Produto;
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
          defaultValue={produto?.nome}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="sku" className={labelClass}>
          SKU *
        </label>
        <input
          id="sku"
          name="sku"
          required
          defaultValue={produto?.sku}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="categoria" className={labelClass}>
          Categoria
        </label>
        <input
          id="categoria"
          name="categoria"
          defaultValue={produto?.categoria ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="precoVenda" className={labelClass}>
          Preço de venda (R$)
        </label>
        <input
          id="precoVenda"
          name="precoVenda"
          type="number"
          step="0.01"
          defaultValue={produto?.precoVenda ?? 0}
          className={inputClass}
        />
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
            defaultValue={produto?.estoqueAtual ?? 0}
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
            defaultValue={produto?.estoqueMinimo ?? 0}
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
