# API de Matrículas (Enrollments) - HYPERFORM

Esta documentação descreve os endpoints para gerenciamento de matrículas de alunos em planos.

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

### 1. Realizar Matrícula

**POST** `/enrollments`

#### Request Body

```json
{
  "student_id": "uuid-do-aluno",
  "plan_id": "uuid-do-plano",
  "start_date": "2024-08-01"
}
```

#### Response (201 Created)

```json
{
  "id": "uuid",
  "student_id": "uuid-do-aluno",
  "plan_id": "uuid-do-plano",
  "start_date": "2024-08-01T00:00:00.000Z",
  "end_date": "2024-08-31T00:00:00.000Z",
  "price": 99.9,
  "created_at": "2024-07-17T10:00:00.000Z",
  "deleted_at": null
}
```

#### Erros Possíveis

- 400: Dados inválidos, matrícula duplicada, plano/aluno inexistente
- 401: Não autenticado

---

### 2. Listar Matrículas

**GET** `/enrollments?page=1&limit=10`

#### Response (200 OK)

```json
{
  "enrollments": [
    {
      "id": "uuid",
      "student_id": "uuid-do-aluno",
      "plan_id": "uuid-do-plano",
      "start_date": "2024-08-01T00:00:00.000Z",
      "end_date": "2024-08-31T00:00:00.000Z",
      "price": 99.9,
      "created_at": "2024-07-17T10:00:00.000Z",
      "deleted_at": null
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### 3. Detalhes de uma Matrícula

**GET** `/enrollments/:id`

#### Response (200 OK)

```json
{
  "id": "uuid",
  "student_id": "uuid-do-aluno",
  "plan_id": "uuid-do-plano",
  "start_date": "2024-08-01T00:00:00.000Z",
  "end_date": "2024-08-31T00:00:00.000Z",
  "price": 99.9,
  "created_at": "2024-07-17T10:00:00.000Z",
  "deleted_at": null
}
```

#### Erros Possíveis

- 404: Matrícula não encontrada
- 401: Não autenticado

---

### 4. Cancelar Matrícula (Soft Delete)

**DELETE** `/enrollments/:id`

#### Response (204 No Content)

#### Erros Possíveis

- 404: Matrícula não encontrada
- 401: Não autenticado

---

## Regras de Validação

- student_id e plan_id: UUIDs válidos e existentes
- start_date: data válida
- Não permitir matrícula duplicada ativa para o mesmo aluno
- end_date é calculado automaticamente (start_date + duração do plano)
- price é fixado no momento da matrícula

## Códigos de Status HTTP

- 200: Sucesso
- 201: Criado
- 204: Removido com sucesso
- 400: Erro de validação
- 401: Não autenticado
- 404: Não encontrado
- 500: Erro interno
