import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currency, dateBR } from "@/lib/format";

const STATUS_LABELS: Record<string, string> = {
  RASCUNHO: "Rascunho",
  ENVIADO: "Enviado",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
};

export default async function OrcamentoImprimirPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    include: { cliente: true },
  });

  if (!orcamento) notFound();

  return (
    <div className="mx-auto max-w-2xl p-8 print:p-4">
      <header className="mb-6 flex items-start justify-between border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Conserv Confecções
          </h1>
          <p className="text-sm text-slate-500">Orçamento comercial</p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p>Emitido em {dateBR(orcamento.createdAt)}</p>
          <p>Nº {orcamento.id.slice(-8).toUpperCase()}</p>
          <p>Status: {STATUS_LABELS[orcamento.status]}</p>
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Cliente
        </h2>
        <p className="text-lg font-medium text-slate-900">
          {orcamento.cliente.nome}
        </p>
        {orcamento.cliente.documento && (
          <p className="text-sm text-slate-600">
            Documento: {orcamento.cliente.documento}
          </p>
        )}
        {orcamento.cliente.telefone && (
          <p className="text-sm text-slate-600">
            Telefone: {orcamento.cliente.telefone}
          </p>
        )}
        {orcamento.cliente.email && (
          <p className="text-sm text-slate-600">
            E-mail: {orcamento.cliente.email}
          </p>
        )}
        {orcamento.cliente.endereco && (
          <p className="text-sm text-slate-600">
            Endereço: {orcamento.cliente.endereco}
          </p>
        )}
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Descrição
        </h2>
        <p className="whitespace-pre-wrap text-sm text-slate-700">
          {orcamento.descricao}
        </p>
      </section>

      <section className="mb-6 rounded-md border border-slate-200 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Valor estimado
          </span>
          <span className="text-2xl font-bold text-slate-900">
            {currency(orcamento.valorEstimado)}
          </span>
        </div>
        {orcamento.validade && (
          <p className="mt-2 text-sm text-slate-500">
            Válido até {dateBR(orcamento.validade)}
          </p>
        )}
      </section>

      <footer className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-400">
        Documento gerado por Conserv Confecções.
      </footer>
    </div>
  );
}
