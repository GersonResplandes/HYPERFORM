# API de Exercícios

## Endpoints

### Listar Exercícios

**GET** `/exercises`

- Retorna todos os exercícios ativos.
- Permissão: INSTRUTOR e ALUNO

**Exemplo de resposta:**

```json
[
  {
    "id": "uuid",
    "nome": "Supino reto com barra",
    "descricao": "Exercício para peitoral.",
    "grupo_muscular": "PEITO",
    "video_url": "https://...",
    "observacoes": "Mantenha a postura.",
    "ativo": true,
    "created_at": "2024-07-21T10:00:00.000Z",
    "updated_at": "2024-07-21T10:00:00.000Z"
  }
]
```

### Buscar Exercício por ID

**GET** `/exercises/:id`

- Retorna um exercício pelo ID.
- Permissão: INSTRUTOR e ALUNO

### Criar Exercício

**POST** `/exercises`

- Cria um novo exercício.
- Permissão: INSTRUTOR

**Body:**

```json
{
  "nome": "Supino reto com barra",
  "descricao": "Exercício para peitoral.",
  "grupo_muscular": "PEITO",
  "video_url": "https://...",
  "observacoes": "Mantenha a postura."
}
```

### Atualizar Exercício

**PUT** `/exercises/:id`

- Atualiza um exercício existente.
- Permissão: INSTRUTOR

### Remover Exercício (soft delete)

**DELETE** `/exercises/:id`

- Marca o exercício como inativo.
- Permissão: INSTRUTOR

## Regras de Permissão

- Apenas INSTRUTOR pode criar, editar e remover exercícios.
- ALUNO pode apenas visualizar.

## Erros Comuns

- 400: Dados inválidos
- 401: Não autenticado
- 403: Permissão insuficiente
- 404: Exercício não encontrado
