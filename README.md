# Sistema Integrado — Confecção

Sistema de gestão para empresa de confecção, com os módulos:

- **CRM**: funil de leads (novo, contato, negociação, fechado, perdido).
- **Orçamentos**: criados a partir de um lead (cria o cliente automaticamente); aprovação gera um pedido.
- **Vendas**: cadastro de clientes e pedidos, com itens adicionados incrementalmente.
- **Estoque**: matérias-primas, produtos acabados, movimentações (entrada/saída) e **ficha técnica** por produto (composição de matérias-primas + instruções de confecção, com página imprimível).
- **Produção**: ordens de produção com etapas (corte, costura, acabamento) — o corte consome automaticamente as matérias-primas da ficha técnica, e a conclusão atualiza o estoque do produto.
- **Financeiro**: contas a pagar e a receber, com fluxo de caixa projetado. Faturar um pedido gera uma conta a receber automaticamente.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Prisma](https://www.prisma.io) + PostgreSQL
- [NextAuth](https://authjs.dev) (Credentials) para login com e-mail/senha
- Tailwind CSS

## Como rodar localmente

Requer um banco PostgreSQL rodando (local ou na nuvem).

```bash
npm install
npx prisma migrate dev   # cria as tabelas
npm run seed              # cria o usuário admin inicial
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Usuário admin padrão criado pelo seed:

- E-mail: `admin@confeccao.com`
- Senha: `admin123`

Personalize com as variáveis de ambiente `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` antes de rodar `npm run seed`.

## Variáveis de ambiente

Veja `.env`:

- `DATABASE_URL`: string de conexão do PostgreSQL.
- `AUTH_SECRET`: chave usada pelo NextAuth para assinar sessões. Gere uma nova em produção com `openssl rand -base64 32`.

## Publicar em produção (ex: Vercel)

1. Importe este repositório na [Vercel](https://vercel.com).
2. Adicione um banco Postgres (aba **Storage** do projeto na Vercel, ou qualquer provedor como Neon/Supabase) — isso configura `DATABASE_URL` automaticamente.
3. Defina a variável de ambiente `AUTH_SECRET` (gere com `openssl rand -base64 32`).
4. Faça o deploy. O build já roda `prisma migrate deploy` automaticamente antes do `next build`, então as tabelas são criadas sozinhas.
5. Acesse `/setup` uma única vez para criar o primeiro usuário administrador (a rota fica indisponível assim que o primeiro usuário existir).
