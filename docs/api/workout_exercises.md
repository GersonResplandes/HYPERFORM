# API de Exercícios em Treino

## Endpoints

### Listar Exercícios de um Treino

**GET** `/workouts/:workoutId/exercises`

- Retorna todos os exercícios associados a um treino.
- Permissão: INSTRUTOR e ALUNO

### Adicionar Exercício ao Treino

**POST** `/workouts/:workoutId/exercises`

- Adiciona um exercício ao treino.
- Permissão: INSTRUTOR

**Body:**

```json
{
  "exercise_id": "uuid-do-exercicio",
  "ordem": 1,
  "series": 3,
  "repeticoes": "3x12",
  "carga": "20kg",
  "observacoes": "Executar com atenção."
}
```

### Remover Exercício do Treino

**DELETE** `/workouts/:workoutId/exercises/:id`

- Remove o exercício do treino.
- Permissão: INSTRUTOR

## Regras de Permissão

- Apenas INSTRUTOR pode adicionar/remover exercícios em treinos.
- ALUNO pode apenas visualizar.

## Erros Comuns

- 400: Dados inválidos
- 401: Não autenticado
- 403: Permissão insuficiente
- 404: Associação não encontrada
