# Arquitetura do Sistema de Gestão da HYPERFORM

## Visão Geral

A HYPERFORM é uma plataforma digital para gestão de academias, studios e centros de performance físico-funcional. O sistema é modular, escalável e seguro, pensado para suportar desde operações locais até grandes redes com múltiplas unidades.

Utilizamos uma arquitetura **monorepo baseada em NPM workspaces**, permitindo alto reaproveitamento de código, consistência nas práticas de engenharia e facilidade de automação contínua.

### Objetivos Arquiteturais

- 🧩 Modularidade: separação clara entre domínio, interface, infraestrutura e configuração.
- 🔐 Segurança desde o design: validações, autenticação robusta e princípios de segurança na arquitetura.
- 📈 Escalabilidade horizontal: suportar múltiplos usuários, unidades e integrações externas.
- 📚 Documentação clara: onboarding rápido e previsibilidade para novos colaboradores.
- ⚙️ Extensibilidade: fácil acoplamento de novos módulos e serviços futuros (ex: pagamentos, biometria, relatórios).

---

## Tecnologias e Justificativas

| Tecnologia             | Justificativa                                                                  |
| ---------------------- | ------------------------------------------------------------------------------ |
| TypeScript             | Tipagem forte, segurança, melhor manutenção e produtividade.                   |
| Node.js + Express      | Backend leve, altamente customizável, com comunidade madura.                   |
| Next.js                | Suporte a SSR, SSG, rotas dinâmicas e ótima integração com TypeScript.         |
| MySQL                  | Banco relacional estável, com integridade transacional e alta compatibilidade. |
| NPM Workspaces         | Gerência simples de monorepo, sem sobrecarga de ferramentas.                   |
| ESLint, Prettier, etc. | Garantia de código limpo, padronizado e revisável.                             |

#### Bibliotecas e Ferramentas Complementares

- `Jest`: testes unitários
- `Playwright` ou `Cypress`: testes E2E (futuramente)
- `Husky`, `Lint-staged`, `Commitlint`: automação e consistência em commits
- `Docker`: padronização futura de ambientes (produção/dev)

---

## Diagrama de Arquitetura (C4 - Container Level)

```mermaid
flowchart LR
  subgraph Web["apps/web (Next.js)"]
    A[Usuário]-->|HTTP(S)|B[Next.js App]
  end
  subgraph API["apps/api (Express)"]
    B2[REST API]
  end
  subgraph DB["MySQL Database"]
    C[(MySQL)]
  end
  B-->|REST|B2
  B2-->|SQL|C
```

---

## Fluxo de Requisição

1. O usuário interage com a aplicação web (Next.js).
2. A interface realiza chamadas REST para a API.
3. A API processa dados, aplica regras de negócio e interage com o banco MySQL.
4. A resposta segue de volta para o frontend para renderização ou feedback.

---

## Estrutura de Monorepo

```txt
/apps
  ├── web        → Frontend em Next.js
  └── api        → Backend em Node.js + Express
/packages
  ├── ui         → Componentes visuais reutilizáveis
  └── config     → Regras compartilhadas (lint, tsconfig, etc)
```

---

## Versionamento e Convenções

- **Versionamento Semântico (SemVer)**
- **Commits padronizados** (`Conventional Commits`)
- **Branches:**
  - `main`: produção
  - `develop`: homologação
  - `feature/*`: novas features
  - `fix/*`: correções

- **Pull Requests obrigatórios**
- **CI/CD obrigatório para merges em `main`**
- **Code linting e testes automatizados antes do merge**

---

## Camadas e Responsabilidades

### Backend (`apps/api`)

- **Domain**: entidades, value objects, casos de uso e lógica de negócio pura.
- **App**: controllers, middlewares, orquestração de use cases.
- **Infra**: repositórios, integrações externas, persistência e autenticação.

### Frontend (`apps/web`)

- **Pages**: rotas/páginas do Next.js.
- **Components**: componentes reutilizáveis.
- **Services**: comunicação com a API.
- **Hooks**: lógica de estado, contexto e efeitos colaterais.

### Shared (`packages/`)

- **UI**: design system e componentes compartilhados.
- **Config**: configs de eslint, prettier, tsconfig, jest, etc.

---

## Estratégia de Testes

- **Unitários:** Jest (mínimo 80% cobertura)
- **Integração:** com foco em fluxos críticos
- **E2E:** com Playwright ou Cypress (futuro)
- **Estrutura de testes:**  
  `__tests__/` ao lado do código testado
- **Pipeline CI/CD:** testes devem rodar e passar antes do merge

---

## Segurança, Escalabilidade e Performance

### Segurança

- JWT como padrão de autenticação
- CORS restritivo e validado por ambiente
- Validação de input em todas as camadas de entrada
- Monitoramento de vulnerabilidades com ferramentas como Snyk ou `npm audit`

### Escalabilidade

- API Stateless, preparada para containers e balanceadores
- Banco preparado para replicação/leitura separada (read replicas)
- Modulos desacopláveis e deployment independente no futuro (ex: microsserviços)

### Performance

- SSG e SSR para páginas estáticas/críticas
- Uso de cache (Redis) para dados de leitura intensiva (futuro)
- Indexação e queries otimizadas no banco
- Observabilidade: futura integração com logs, métricas e tracing distribuído

---

## Boas Práticas Reforçadas

- Decisões arquiteturais documentadas e versionadas
- CI/CD com validações automáticas
- Docs atualizadas a cada modificação de contexto
- Dependências auditadas periodicamente
- Design guiado por domínio (DDD)

---

> **Este documento é vivo.** Será continuamente revisado e aprimorado conforme o produto evoluir.

**Autor:** GÉRSON RESPLANDES DE SÁ SOUSA
**Projeto:** HYPERFORM – Sistema de Gestão de Academias
