# Sistema de Gestão de Academia

Monorepo estruturado com NPM Workspaces, seguindo Clean Architecture/DDD.

## Estrutura

- `apps/web`: Frontend Next.js + TypeScript
- `apps/api`: Backend Node.js + Express + TypeScript
- `packages/ui`: Componentes de UI compartilhados
- `packages/config`: Configurações compartilhadas (ESLint, Prettier, etc)

## Primeiros Passos

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Copie o arquivo `.env.example` para `.env` e ajuste as variáveis.
3. Para rodar o frontend:
   ```sh
   npm run dev --workspace=apps/web
   ```
4. Para rodar o backend:
   ```sh
   npm run dev --workspace=apps/api
   ```

## Scripts Úteis

- `npm run build --workspace=apps/web` – Build do frontend
- `npm run build --workspace=apps/api` – Build do backend
- `npm run lint` – Lint global

## Banco de Dados

- MySQL local
- Configure as variáveis no `.env`

## Convenções

- TypeScript em todo o projeto
- ESLint/Prettier compartilhados
- Commits validados por commitlint/husky

## Documentação

Veja mais detalhes em [`docs/arquitetura.md`](docs/arquitetura.md)
