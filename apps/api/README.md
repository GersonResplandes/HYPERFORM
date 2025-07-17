# API HYPERFORM

API REST para o sistema HYPERFORM com autenticação JWT e banco de dados MySQL.

## 🚀 Tecnologias

- **Node.js** com TypeScript
- **Express.js** para o servidor
- **JWT** para autenticação
- **MySQL** com Knex.js
- **bcryptjs** para hash de senhas
- **tsyringe** para injeção de dependência
- **Jest** para testes

## 📋 Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- npm ou yarn

## 🛠️ Instalação

1. **Instalar dependências:**

```bash
npm install
```

2. **Configurar variáveis de ambiente:**

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Servidor
PORT=3001
NODE_ENV=development

# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=hyperform_dev

# Configurações JWT
JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRES_IN=7d

# Configurações de CORS
CORS_ORIGIN=http://localhost:3000
```

3. **Criar banco de dados:**

```sql
CREATE DATABASE hyperform_dev;
CREATE DATABASE hyperform_test;
```

4. **Executar migrações:**

```bash
npm run migrate
```

## 🏃‍♂️ Executando

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## 📊 Endpoints

### Autenticação

- `POST /users` - Criar usuário
- `POST /users/sessions` - Login
- `GET /users/me` - Perfil do usuário (protegido)

### Health Check

- `GET /health` - Status da API

## 🏗️ Estrutura do Projeto

```
src/
├── app/                 # Camada de aplicação
│   ├── controllers/     # Controllers
│   ├── middlewares/     # Middlewares
│   ├── routes/          # Rotas
│   └── dtos/           # Data Transfer Objects
├── domain/             # Camada de domínio
│   ├── entities/       # Entidades
│   ├── use-cases/      # Casos de uso
│   ├── repositories/   # Interfaces dos repositórios
│   ├── providers/      # Interfaces dos providers
│   └── errors/         # Erros personalizados
├── infra/              # Camada de infraestrutura
│   ├── database/       # Configuração do banco
│   ├── repositories/   # Implementação dos repositórios
│   └── providers/      # Implementação dos providers
└── shared/             # Código compartilhado
    └── container/      # Container de DI
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Compila o projeto
- `npm start` - Executa em produção
- `npm test` - Executa testes
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Executa testes com cobertura
- `npm run lint` - Executa ESLint
- `npm run lint:fix` - Corrige problemas do ESLint
- `npm run format` - Formata código com Prettier
- `npm run migrate` - Executa migrações
- `npm run migrate:make` - Cria nova migração
- `npm run seed` - Executa seeds

## 📝 Documentação

Consulte a documentação completa da API em [`docs/api/auth.md`](../../docs/api/auth.md).

## 🔒 Segurança

- Senhas são hasheadas com bcryptjs
- Tokens JWT com expiração configurável
- Validação de dados de entrada
- Middleware de autenticação para rotas protegidas

## 🧠 Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**:

- **Separação de responsabilidades** entre camadas
- **Inversão de dependência** com interfaces
- **Injeção de dependência** com tsyringe
- **Testabilidade** com mocks e stubs
- **Código limpo** e modular

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.
