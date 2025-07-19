# API de Check-ins Diários - HYPERFORM

## Endpoint

### Registrar Check-in Diário

**POST** `/students/:id/check-in`

Registra um check-in diário para o aluno especificado, desde que ele possua matrícula ativa. Só é permitido um check-in por dia (UTC).

#### Autenticação

JWT obrigatório (header: `Authorization: Bearer <token>`)

#### Parâmetros de rota

- `id` (UUID): ID do aluno

#### Request Body

Não é necessário enviar body, apenas o token JWT.

#### Exemplo de requisição

```http
POST /students/123e4567-e89b-12d3-a456-426614174000/check-in
Authorization: Bearer <seu_token_jwt>
```

#### Respostas

- **201 Created**
  ```json
  {
    "message": "Check-in realizado com sucesso"
  }
  ```
- **403 Forbidden**
  ```json
  {
    "error": "Aluno não possui matrícula ativa"
  }
  ```
- **404 Not Found**
  ```json
  {
    "error": "Aluno não encontrado"
  }
  ```
- **409 Conflict**
  ```json
  {
    "error": "Check-in já realizado hoje"
  }
  ```
- **400 Bad Request**
  ```json
  {
    "error": "Mensagem de erro de validação"
  }
  ```

#### Regras de negócio

- Só é possível fazer check-in se o aluno tiver matrícula ativa na data atual.
- Só é permitido um check-in por dia (UTC).
- Apenas o usuário dono do aluno pode registrar o check-in.
