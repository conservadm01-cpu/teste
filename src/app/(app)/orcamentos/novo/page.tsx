import { prisma } from "@/lib/prisma";
import { createOrcamento } from "../actions";
import { OrcamentoForm } from "../orcamento-form";

export default async function NovoOrcamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ clienteId?: string }>;
}) {
  const { clienteId } = await searchParams;

  const clientes = await prisma.cliente.findMany({
    orderBy: { nome: "asc" },
    select: { id: true, nome: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Novo orçamento</h1>
      {clientes.length === 0 ? (
        <p className="max-w-lg rounded-md bg-amber-50 p-4 text-sm text-amber-800">
          Cadastre ao menos um cliente antes de criar um orçamento.
        </p>
      ) : (
        <OrcamentoForm
          clientes={clientes}
          action={createOrcamento}
          defaultClienteId={clienteId}
        />
      )}
    </div>
  );
}
