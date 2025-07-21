# API de Progresso Físico

## Endpoints

### Listar progresso de um aluno

**GET** `/progresso-fisico/:aluno_id`

- Retorna todos os registros de progresso físico do aluno.
- Permissão: INSTRUTOR (qualquer aluno) e ALUNO (apenas seus próprios registros)

**Exemplo de resposta:**

```json
[
  {
    "id": "uuid",
    "aluno_id": "uuid-aluno",
    "data": "2024-07-21",
    "peso": 80.5,
    "altura": 1.8,
    "percentual_gordura": 15.2,
    "circunferencia_peito": 100,
    "circunferencia_cintura": 80,
    "circunferencia_quadril": 95,
    "circunferencia_braco": 35,
    "circunferencia_coxa": 55,
    "observacoes": "Ótima evolução.",
    "registrado_por_id": "uuid-instrutor",
    "created_at": "2024-07-21T10:00:00.000Z",
    "updated_at": "2024-07-21T10:00:00.000Z"
  }
]
```

### Criar novo registro de progresso

**POST** `/progresso-fisico`

- Cria um novo registro de progresso físico para um aluno.
- Permissão: INSTRUTOR

**Body:**

```json
{
  "aluno_id": "uuid-aluno",
  "data": "2024-07-21",
  "peso": 80.5,
  "altura": 1.8,
  "percentual_gordura": 15.2,
  "circunferencia_peito": 100,
  "circunferencia_cintura": 80,
  "circunferencia_quadril": 95,
  "circunferencia_braco": 35,
  "circunferencia_coxa": 55,
  "observacoes": "Ótima evolução."
}
```

### Atualizar registro de progresso

**PUT** `/progresso-fisico/:id`

- Atualiza um registro existente.
- Permissão: INSTRUTOR

### Remover registro (soft delete)

**DELETE** `/progresso-fisico/:id`

- Marca o registro como deletado.
- Permissão: INSTRUTOR

### Detalhar registro

**GET** `/progresso-fisico/:id`

- Retorna os detalhes de um registro de progresso físico.
- Permissão: INSTRUTOR (qualquer aluno) e ALUNO (apenas seus próprios registros)

## Regras de Permissão

- Apenas INSTRUTOR pode criar, editar e deletar registros.
- ALUNO pode apenas visualizar seus próprios registros.

## Erros Comuns

- 400: Dados inválidos
- 401: Não autenticado
- 403: Permissão insuficiente
- 404: Registro não encontrado
