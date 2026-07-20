import { prisma } from "@/lib/prisma";

function currency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function DashboardPage() {
  const [
    totalClientes,
    leadsAtivos,
    pedidosAbertos,
    ordensEmAndamento,
    materiaPrimas,
    produtos,
    contasPagarPendentes,
    contasReceberPendentes,
  ] = await Promise.all([
    prisma.cliente.count(),
    prisma.lead.count({ where: { estagio: { notIn: ["FECHADO", "PERDIDO"] } } }),
    prisma.pedido.count({ where: { status: { in: ["ABERTO", "EM_PRODUCAO"] } } }),
    prisma.ordemProducao.count({ where: { etapa: { not: "CONCLUIDO" } } }),
    prisma.materiaPrima.findMany(),
    prisma.produto.findMany(),
    prisma.contaPagar.aggregate({
      where: { status: "PENDENTE" },
      _sum: { valor: true },
      _count: true,
    }),
    prisma.contaReceber.aggregate({
      where: { status: "PENDENTE" },
      _sum: { valor: true },
      _count: true,
    }),
  ]);

  const estoqueBaixoCount =
    materiaPrimas.filter((m) => m.estoqueAtual <= m.estoqueMinimo).length +
    produtos.filter((p) => p.estoqueAtual <= p.estoqueMinimo).length;

  const cards = [
    { label: "Clientes cadastrados", value: totalClientes },
    { label: "Leads ativos no funil", value: leadsAtivos },
    { label: "Pedidos em aberto", value: pedidosAbertos },
    { label: "Ordens de produção ativas", value: ordensEmAndamento },
    {
      label: "Itens com estoque baixo",
      value: estoqueBaixoCount,
    },
    {
      label: "A pagar (pendente)",
      value: currency(contasPagarPendentes._sum.valor ?? 0),
      sub: `${contasPagarPendentes._count} conta(s)`,
    },
    {
      label: "A receber (pendente)",
      value: currency(contasReceberPendentes._sum.valor ?? 0),
      sub: `${contasReceberPendentes._count} conta(s)`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Painel</h1>
        <p className="text-sm text-slate-500">Visão geral da operação.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {card.value}
            </p>
            {"sub" in card && card.sub && (
              <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
