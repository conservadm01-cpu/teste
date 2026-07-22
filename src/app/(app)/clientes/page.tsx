import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  primaryButtonClass,
  tableWrapperClass,
  tdClass,
  thClass,
} from "@/components/ui";

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { nome: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-500">
            {clientes.length} cliente(s) cadastrado(s).
          </p>
        </div>
        <Link href="/clientes/novo" className={primaryButtonClass}>
          Novo cliente
        </Link>
      </div>

      <div className={tableWrapperClass}>
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-slate-200">
            <tr>
              <th className={thClass}>Nome</th>
              <th className={thClass}>Documento</th>
              <th className={thClass}>Telefone</th>
              <th className={thClass}>E-mail</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td className={tdClass}>{cliente.nome}</td>
                <td className={tdClass}>{cliente.documento || "-"}</td>
                <td className={tdClass}>{cliente.telefone || "-"}</td>
                <td className={tdClass}>{cliente.email || "-"}</td>
                <td className={`${tdClass} text-right`}>
                  <Link
                    href={`/clientes/${cliente.id}`}
                    className="font-medium text-slate-600 hover:text-slate-900"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td className={tdClass} colSpan={5}>
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
