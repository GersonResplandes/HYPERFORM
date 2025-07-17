# API de Alunos (Students) - HYPERFORM

Esta documentação descreve os endpoints para gerenciamento de alunos vinculados ao usuário autenticado.

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

### 1. Criar Aluno

**POST** `/students`

#### Request Body

```json
{
  "name": "Maria Souza",
  "email": "maria@email.com",
  "phone": "11999999999",
  "birth_date": "2000-05-10",
  "gender": "FEMALE",
  "notes": "Observação opcional"
}
```

#### Response (201 Created)

```json
{
  "id": "uuid",
  "name": "Maria Souza",
  "email": "maria@email.com",
  "phone": "11999999999",
  "birth_date": "2000-05-10T00:00:00.000Z",
  "gender": "FEMALE",
  "notes": "Observação opcional",
  "created_at": "2024-07-16T10:00:00.000Z",
  "updated_at": "2024-07-16T10:00:00.000Z",
  "deleted_at": null,
  "user_id": "uuid-do-usuario"
}
```

#### Erros Possíveis

- 400: Dados inválidos, e-mail duplicado
- 401: Não autenticado

---

### 2. Listar Alunos

**GET** `/students`

#### Response (200 OK)

```json
[
  {
    "id": "uuid",
    "name": "Maria Souza",
    "email": "maria@email.com",
    "phone": "11999999999",
    "birth_date": "2000-05-10T00:00:00.000Z",
    "gender": "FEMALE",
    "notes": "Observação opcional",
    "created_at": "2024-07-16T10:00:00.000Z",
    "updated_at": "2024-07-16T10:00:00.000Z",
    "deleted_at": null,
    "user_id": "uuid-do-usuario"
  }
]
```

#### Observações

- Retorna apenas alunos do usuário autenticado
- Alunos deletados (soft delete) não aparecem

---

### 3. Detalhes de um Aluno

**GET** `/students/:id`

#### Response (200 OK)

```json
{
  "id": "uuid",
  "name": "Maria Souza",
  "email": "maria@email.com",
  "phone": "11999999999",
  "birth_date": "2000-05-10T00:00:00.000Z",
  "gender": "FEMALE",
  "notes": "Observação opcional",
  "created_at": "2024-07-16T10:00:00.000Z",
  "updated_at": "2024-07-16T10:00:00.000Z",
  "deleted_at": null,
  "user_id": "uuid-do-usuario"
}
```

#### Erros Possíveis

- 404: Aluno não encontrado ou não pertence ao usuário
- 401: Não autenticado

---

### 4. Atualizar Aluno

**PUT** `/students/:id`

#### Request Body

```json
{
  "name": "Maria Souza Atualizada",
  "email": "maria@email.com",
  "phone": "11999999999",
  "birth_date": "2000-05-10",
  "gender": "FEMALE",
  "notes": "Nova observação"
}
```

#### Response (200 OK)

```json
{
  "id": "uuid",
  "name": "Maria Souza Atualizada",
  "email": "maria@email.com",
  "phone": "11999999999",
  "birth_date": "2000-05-10T00:00:00.000Z",
  "gender": "FEMALE",
  "notes": "Nova observação",
  "created_at": "2024-07-16T10:00:00.000Z",
  "updated_at": "2024-07-16T12:00:00.000Z",
  "deleted_at": null,
  "user_id": "uuid-do-usuario"
}
```

#### Erros Possíveis

- 400: Dados inválidos, e-mail duplicado
- 404: Aluno não encontrado
- 401: Não autenticado

---

### 5. Remover Aluno (Soft Delete)

**DELETE** `/students/:id`

#### Response (204 No Content)

#### Erros Possíveis

- 404: Aluno não encontrado
- 401: Não autenticado

---

## Regras de Validação

- Nome: mínimo 3 caracteres
- E-mail: válido e único por usuário
- Telefone: formato BR (ex: 11999999999)
- Data de nascimento: válida
- Gênero: 'MALE', 'FEMALE', 'OTHER'

## Regras de Autorização

- Apenas o usuário autenticado pode acessar/alterar/excluir seus próprios alunos
- Alunos deletados não aparecem nas listagens

## Códigos de Status HTTP

- 200: Sucesso
- 201: Criado
- 204: Removido com sucesso
- 400: Erro de validação
- 401: Não autenticado
- 404: Não encontrado
- 500: Erro interno
