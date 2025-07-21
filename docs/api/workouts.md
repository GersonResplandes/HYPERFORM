# API de Treinos

## Endpoints

### Listar Treinos

**GET** `/workouts`

- Retorna todos os treinos ativos.
- Permissão: INSTRUTOR e ALUNO

### Buscar Treino por ID

**GET** `/workouts/:id`

- Retorna um treino pelo ID.
- Permissão: INSTRUTOR e ALUNO

### Criar Treino

**POST** `/workouts`

- Cria um novo treino.
- Permissão: INSTRUTOR

**Body:**

```json
{
  "nome": "Treino A - Hipertrofia",
  "descricao": "Treino focado em hipertrofia.",
  "objetivo": "HIPERTROFIA",
  "frequencia_semanal": 3,
  "criado_por_id": "uuid-do-instrutor"
}
```

### Atualizar Treino

**PUT** `/workouts/:id`

- Atualiza um treino existente.
- Permissão: INSTRUTOR

### Remover Treino (soft delete)

**DELETE** `/workouts/:id`

- Marca o treino como inativo.
- Permissão: INSTRUTOR

## Regras de Permissão

- Apenas INSTRUTOR pode criar, editar e remover treinos.
- ALUNO pode apenas visualizar.

## Erros Comuns

- 400: Dados inválidos
- 401: Não autenticado
- 403: Permissão insuficiente
- 404: Treino não encontrado
