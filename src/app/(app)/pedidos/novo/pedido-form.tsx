"use client";

import { useState } from "react";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/ui";

type Cliente = { id: string; nome: string };
type Produto = { id: string; nome: string; precoVenda: number };

type Row = { key: number; produtoId: string; quantidade: string; precoUnitario: string };

let nextKey = 1;

export function PedidoForm({
  clientes,
  produtos,
  action,
}: {
  clientes: Cliente[];
  produtos: Produto[];
  action: (formData: FormData) => void;
}) {
  const [rows, setRows] = useState<Row[]>([
    { key: nextKey++, produtoId: "", quantidade: "1", precoUnitario: "0" },
  ]);

  function addRow() {
    setRows((r) => [
      ...r,
      { key: nextKey++, produtoId: "", quantidade: "1", precoUnitario: "0" },
    ]);
  }

  function removeRow(key: number) {
    setRows((r) => (r.length > 1 ? r.filter((row) => row.key !== key) : r));
  }

  function updateRow(key: number, patch: Partial<Row>) {
    setRows((r) => r.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function handleProdutoChange(key: number, produtoId: string) {
    const produto = produtos.find((p) => p.id === produtoId);
    updateRow(key, {
      produtoId,
      precoUnitario: produto ? String(produto.precoVenda) : "0",
    });
  }

  const total = rows.reduce(
    (acc, row) => acc + Number(row.quantidade || 0) * Number(row.precoUnitario || 0),
    0
  );

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="clienteId" className={labelClass}>
          Cliente *
        </label>
        <select id="clienteId" name="clienteId" required className={inputClass}>
          <option value="">Selecione...</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3">
        <label className={labelClass}>Itens do pedido *</label>
        {rows.map((row) => (
          <div key={row.key} className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <select
                name="produtoId"
                required
                value={row.produtoId}
                onChange={(e) => handleProdutoChange(row.key, e.target.value)}
                className={inputClass}
              >
                <option value="">Produto...</option>
                {produtos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-24 flex-col gap-1">
              <input
                name="quantidade"
                type="number"
                min="0.01"
                step="any"
                required
                value={row.quantidade}
                onChange={(e) => updateRow(row.key, { quantidade: e.target.value })}
                className={inputClass}
                placeholder="Qtd"
              />
            </div>
            <div className="flex w-32 flex-col gap-1">
              <input
                name="precoUnitario"
                type="number"
                min="0"
                step="0.01"
                required
                value={row.precoUnitario}
                onChange={(e) =>
                  updateRow(row.key, { precoUnitario: e.target.value })
                }
                className={inputClass}
                placeholder="Preço unit."
              />
            </div>
            <button
              type="button"
              onClick={() => removeRow(row.key)}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addRow}
          className={`${secondaryButtonClass} self-start`}
        >
          + Adicionar item
        </button>
      </div>

      <p className="text-sm font-medium text-slate-700">
        Total: {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </p>

      <button type="submit" className={`${primaryButtonClass} self-start`}>
        Criar pedido
      </button>
    </form>
  );
}
