# API de Autenticação - HYPERFORM

Esta documentação descreve os endpoints disponíveis para autenticação de usuários na API do HYPERFORM.

## Base URL

```
http://localhost:3001
```

## Endpoints

### 1. Criar Usuário

**POST** `/users`

Cria um novo usuário no sistema.

#### Request Body

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "123456"
}
```

#### Response (201 Created)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

#### Erros Possíveis

- **400 Bad Request**: Email já existe
- **400 Bad Request**: Dados inválidos (nome muito curto, email inválido, senha muito curta)

### 2. Autenticar Usuário

**POST** `/users/sessions`

Realiza o login do usuário e retorna um token JWT.

#### Request Body

```json
{
  "email": "joao@example.com",
  "password": "123456"
}
```

#### Response (200 OK)

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Erros Possíveis

- **401 Unauthorized**: Email ou senha incorretos

### 3. Obter Perfil do Usuário

**GET** `/users/me`

Retorna os dados do usuário autenticado.

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

#### Erros Possíveis

- **401 Unauthorized**: Token não fornecido ou inválido
- **404 Not Found**: Usuário não encontrado

## Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header `Authorization`:

```
Authorization: Bearer <seu_token_jwt>
```

### Estrutura do Token

O token JWT contém as seguintes informações:

- `sub`: ID do usuário
- `email`: Email do usuário
- `exp`: Data de expiração (padrão: 7 dias)

## Exemplos de Uso

### Fluxo Completo de Autenticação

1. **Criar usuário:**

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456"
  }'
```

2. **Fazer login:**

```bash
curl -X POST http://localhost:3001/users/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'
```

3. **Acessar perfil (com token):**

```bash
curl -X GET http://localhost:3001/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Erro de validação
- **401**: Não autorizado
- **404**: Não encontrado
- **500**: Erro interno do servidor

## Validações

### Usuário

- **Nome**: Mínimo 2 caracteres
- **Email**: Formato válido de email
- **Senha**: Mínimo 6 caracteres

### Autenticação

- Token JWT válido e não expirado
- Formato correto do header Authorization
