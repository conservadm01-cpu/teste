import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  cardClass,
  primaryButtonClass,
  tableWrapperClass,
  tdClass,
  thClass,
} from "@/components/ui";
import { currency, dateBR } from "@/lib/format";
import {
  marcarContaPagarPaga,
  marcarContaReceberRecebida,
  deleteContaPagar,
  deleteContaReceber,
} from "./actions";

export default async function FinanceiroPage() {
  const [contasPagar, contasReceber] = await Promise.all([
    prisma.contaPagar.findMany({ orderBy: { vencimento: "asc" } }),
    prisma.contaReceber.findMany({ orderBy: { vencimento: "asc" } }),
  ]);

  const totalPagarPendente = contasPagar
    .filter((c) => c.status === "PENDENTE")
    .reduce((acc, c) => acc + c.valor, 0);
  const totalReceberPendente = contasReceber
    .filter((c) => c.status === "PENDENTE")
    .reduce((acc, c) => acc + c.valor, 0);
  const saldoProjetado = totalReceberPendente - totalPagarPendente;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Financeiro</h1>
        <p className="text-sm text-slate-500">
          Contas a pagar, a receber e fluxo de caixa.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={cardClass}>
          <p className="text-sm text-slate-500">A pagar (pendente)</p>
          <p className="mt-1 text-xl font-semibold text-red-600">
            {currency(totalPagarPendente)}
          </p>
        </div>
        <div className={cardClass}>
          <p className="text-sm text-slate-500">A receber (pendente)</p>
          <p className="mt-1 text-xl font-semibold text-green-600">
            {currency(totalReceberPendente)}
          </p>
        </div>
        <div className={cardClass}>
          <p className="text-sm text-slate-500">Saldo projetado</p>
          <p
            className={`mt-1 text-xl font-semibold ${
              saldoProjetado >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {currency(saldoProjetado)}
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Contas a pagar
          </h2>
          <Link href="/financeiro/pagar/novo" className={primaryButtonClass}>
            Nova conta a pagar
          </Link>
        </div>
        <div className={tableWrapperClass}>
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-slate-200">
              <tr>
                <th className={thClass}>Descrição</th>
                <th className={thClass}>Fornecedor</th>
                <th className={thClass}>Vencimento</th>
                <th className={thClass}>Valor</th>
                <th className={thClass}>Status</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contasPagar.map((conta) => (
                <tr key={conta.id}>
                  <td className={tdClass}>{conta.descricao}</td>
                  <td className={tdClass}>{conta.fornecedor || "-"}</td>
                  <td className={tdClass}>{dateBR(conta.vencimento)}</td>
                  <td className={tdClass}>{currency(conta.valor)}</td>
                  <td className={tdClass}>
                    <span
                      className={
                        conta.status === "PAGO"
                          ? "font-medium text-green-600"
                          : "font-medium text-amber-600"
                      }
                    >
                      {conta.status === "PAGO" ? "Pago" : "Pendente"}
                    </span>
                  </td>
                  <td className={`${tdClass} text-right`}>
                    <div className="flex justify-end gap-3">
                      {conta.status === "PENDENTE" && (
                        <form
                          action={marcarContaPagarPaga.bind(null, conta.id)}
                        >
                          <button
                            type="submit"
                            className="font-medium text-slate-600 hover:text-slate-900"
                          >
                            Marcar como pago
                          </button>
                        </form>
                      )}
                      <form action={deleteContaPagar.bind(null, conta.id)}>
                        <button
                          type="submit"
                          className="font-medium text-red-500 hover:text-red-700"
                        >
                          Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {contasPagar.length === 0 && (
                <tr>
                  <td className={tdClass} colSpan={6}>
                    Nenhuma conta a pagar registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Contas a receber
          </h2>
          <Link href="/financeiro/receber/novo" className={primaryButtonClass}>
            Nova conta a receber
          </Link>
        </div>
        <div className={tableWrapperClass}>
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-slate-200">
              <tr>
                <th className={thClass}>Descrição</th>
                <th className={thClass}>Cliente</th>
                <th className={thClass}>Vencimento</th>
                <th className={thClass}>Valor</th>
                <th className={thClass}>Status</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contasReceber.map((conta) => (
                <tr key={conta.id}>
                  <td className={tdClass}>{conta.descricao}</td>
                  <td className={tdClass}>{conta.cliente || "-"}</td>
                  <td className={tdClass}>{dateBR(conta.vencimento)}</td>
                  <td className={tdClass}>{currency(conta.valor)}</td>
                  <td className={tdClass}>
                    <span
                      className={
                        conta.status === "PAGO"
                          ? "font-medium text-green-600"
                          : "font-medium text-amber-600"
                      }
                    >
                      {conta.status === "PAGO" ? "Recebido" : "Pendente"}
                    </span>
                  </td>
                  <td className={`${tdClass} text-right`}>
                    <div className="flex justify-end gap-3">
                      {conta.status === "PENDENTE" && (
                        <form
                          action={marcarContaReceberRecebida.bind(
                            null,
                            conta.id
                          )}
                        >
                          <button
                            type="submit"
                            className="font-medium text-slate-600 hover:text-slate-900"
                          >
                            Marcar como recebido
                          </button>
                        </form>
                      )}
                      <form action={deleteContaReceber.bind(null, conta.id)}>
                        <button
                          type="submit"
                          className="font-medium text-red-500 hover:text-red-700"
                        >
                          Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {contasReceber.length === 0 && (
                <tr>
                  <td className={tdClass} colSpan={6}>
                    Nenhuma conta a receber registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
