# API de Treinos de Aluno

## Endpoints

### Listar Treinos de um Aluno

**GET** `/students/:studentId/workouts`

- Retorna todos os treinos ativos vinculados ao aluno.
- Permissão: ALUNO (visualiza seus próprios treinos)

### Vincular Treino ao Aluno

**POST** `/students/:studentId/workouts`

- Vincula um treino ao aluno.
- Permissão: INSTRUTOR

**Body:**

```json
{
  "workout_id": "uuid-do-treino"
}
```

### Desvincular Treino do Aluno

**DELETE** `/students/:studentId/workouts/:id`

- Desvincula o treino do aluno.
- Permissão: INSTRUTOR

## Regras de Permissão

- Apenas INSTRUTOR pode vincular/desvincular treinos de alunos.
- ALUNO pode apenas visualizar seus próprios treinos.

## Erros Comuns

- 400: Dados inválidos
- 401: Não autenticado
- 403: Permissão insuficiente
- 404: Associação não encontrada
