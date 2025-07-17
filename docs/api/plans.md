# API de Planos (Plans) - HYPERFORM

Esta documentação descreve os endpoints para gerenciamento de planos de assinatura da academia.

## Base URL

```
http://localhost:3001
```

## Autorização

Todas as rotas exigem autenticação JWT via header:

```
Authorization: Bearer <seu_token_jwt>
```

## Endpoints

### 1. Criar Plano

**POST** `/plans`

#### Request Body

```json
{
  "name": "Mensal",
  "duration": 30,
  "price": 99.9
}
```

#### Response (201 Created)

```json
{
  "id": "uuid",
  "name": "Mensal",
  "duration": 30,
  "price": 99.9,
  "created_at": "2024-07-17T10:00:00.000Z",
  "deleted_at": null
}
```

#### Erros Possíveis

- 400: Dados inválidos, nome duplicado
- 401: Não autenticado

---

### 2. Listar Planos

**GET** `/plans`

#### Response (200 OK)

```json
[
  {
    "id": "uuid",
    "name": "Mensal",
    "duration": 30,
    "price": 99.9,
    "created_at": "2024-07-17T10:00:00.000Z",
    "deleted_at": null
  }
]
```

---

### 3. Detalhes de um Plano

**GET** `/plans/:id`

#### Response (200 OK)

```json
{
  "id": "uuid",
  "name": "Mensal",
  "duration": 30,
  "price": 99.9,
  "created_at": "2024-07-17T10:00:00.000Z",
  "deleted_at": null
}
```

#### Erros Possíveis

- 404: Plano não encontrado
- 401: Não autenticado

---

### 4. Atualizar Plano

**PUT** `/plans/:id`

#### Request Body

```json
{
  "name": "Mensal Atualizado",
  "duration": 30,
  "price": 109.9
}
```

#### Response (200 OK)

```json
{
  "id": "uuid",
  "name": "Mensal Atualizado",
  "duration": 30,
  "price": 109.9,
  "created_at": "2024-07-17T10:00:00.000Z",
  "deleted_at": null
}
```

#### Erros Possíveis

- 400: Dados inválidos, nome duplicado
- 404: Plano não encontrado
- 401: Não autenticado

---

### 5. Remover Plano (Soft Delete)

**DELETE** `/plans/:id`

#### Response (204 No Content)

#### Erros Possíveis

- 404: Plano não encontrado
- 401: Não autenticado

---

## Regras de Validação

- Nome: mínimo 3 caracteres, único
- Duração: inteiro positivo (dias)
- Preço: positivo

## Códigos de Status HTTP

- 200: Sucesso
- 201: Criado
- 204: Removido com sucesso
- 400: Erro de validação
- 401: Não autenticado
- 404: Não encontrado
- 500: Erro interno
