import { prisma } from "@/lib/prisma";
import { currency } from "@/lib/format";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export default async function DashboardPage() {
  const now = new Date();
  const inicioMes = startOfMonth(now);
  const inicioHoje = startOfDay(now);
  const inicioAmanha = addDays(inicioHoje, 1);

  const [
    totalClientes,
    leadsAtivos,
    pedidosAbertos,
    ordensEmAndamento,
    materiaPrimas,
    produtos,
    contasPagarPendentes,
    contasReceberPendentes,
    pedidosFaturadosMes,
    vendasHoje,
    vendasPorProduto,
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
    prisma.pedido.findMany({
      where: { status: "FATURADO", data: { gte: inicioMes } },
      include: { itens: true },
    }),
    prisma.pedido.count({
      where: { data: { gte: inicioHoje, lt: inicioAmanha } },
    }),
    prisma.itemPedido.groupBy({
      by: ["produtoId"],
      where: { pedido: { data: { gte: inicioMes } } },
      _sum: { quantidade: true },
      orderBy: { _sum: { quantidade: "desc" } },
      take: 5,
    }),
  ]);

  const estoqueBaixoCount =
    materiaPrimas.filter((m) => m.estoqueAtual <= m.estoqueMinimo).length +
    produtos.filter((p) => p.estoqueAtual <= p.estoqueMinimo).length;

  const faturamentoMes = pedidosFaturadosMes.reduce(
    (acc, pedido) =>
      acc +
      pedido.itens.reduce(
        (soma, item) => soma + item.quantidade * item.precoUnitario,
        0
      ),
    0
  );

  const produtosMap = new Map(produtos.map((p) => [p.id, p]));
  const maisVendidos = vendasPorProduto
    .map((linha) => ({
      produto: produtosMap.get(linha.produtoId),
      quantidade: linha._sum.quantidade ?? 0,
    }))
    .filter((linha) => linha.produto);
  const maiorQuantidade = Math.max(1, ...maisVendidos.map((l) => l.quantidade));

  const cards = [
    { label: "Faturamento do mês", value: currency(faturamentoMes) },
    { label: "Vendas hoje", value: vendasHoje },
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

  const operacao = [
    { label: "Clientes cadastrados", value: totalClientes },
    { label: "Leads ativos no funil", value: leadsAtivos },
    { label: "Pedidos em aberto", value: pedidosAbertos },
    { label: "Ordens de produção ativas", value: ordensEmAndamento },
    { label: "Itens com estoque baixo", value: estoqueBaixoCount },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Painel</h1>
        <p className="text-sm text-slate-500">Visão geral da operação.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-500">
            Produtos mais vendidos (mês)
          </h2>
          {maisVendidos.length === 0 ? (
            <p className="text-sm text-slate-400">
              Nenhuma venda registrada este mês ainda.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {maisVendidos.map((linha) => (
                <li key={linha.produto!.id} className="flex flex-col gap-1">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {linha.produto!.nome}
                    </span>
                    <span className="text-slate-500">
                      {linha.quantidade} un.
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-slate-100">
                    <div
                      className="h-4 rounded-full"
                      style={{
                        width: `${(linha.quantidade / maiorQuantidade) * 100}%`,
                        backgroundColor: "#2a78d6",
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-500">
            Operação
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {operacao.map((item) => (
              <div key={item.label}>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
