# Sistema Integrado — Confecção

Sistema de gestão para empresa de confecção, com os módulos:

- **Vendas**: cadastro de clientes e pedidos com itens.
- **Estoque**: matérias-primas, produtos acabados e movimentações (entrada/saída).
- **Produção**: ordens de produção com etapas (corte, costura, acabamento) — ao concluir, o estoque do produto é atualizado automaticamente.
- **Financeiro**: contas a pagar e a receber, com fluxo de caixa projetado. Ao faturar um pedido, uma conta a receber é gerada automaticamente.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Prisma](https://www.prisma.io) + SQLite
- [NextAuth](https://authjs.dev) (Credentials) para login com e-mail/senha
- Tailwind CSS

## Como rodar localmente

```bash
npm install
npx prisma migrate dev   # cria o banco e aplica as migrations
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

- `DATABASE_URL`: string de conexão do banco (SQLite por padrão).
- `AUTH_SECRET`: chave usada pelo NextAuth para assinar sessões. Gere uma nova em produção com `openssl rand -base64 32`.
