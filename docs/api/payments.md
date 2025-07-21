# API de Pagamentos

## Endpoints

### Listar Pagamentos

**GET** `/pagamentos`

- Retorna uma lista de pagamentos com base em filtros.
- Permissão: INSTRUTOR/ADMIN (todos), ALUNO (apenas os seus, via `/pagamentos/meus`).

**Query Params (Filtros):**

- `aluno_id` (string): UUID do aluno.
- `status` (string): `PENDENTE`, `PAGO`, `ATRASADO`.
- `vencimento_inicio` (date): `YYYY-MM-DD`.
- `vencimento_fim` (date): `YYYY-MM-DD`.

**Exemplo de resposta:**

```json
[
  {
    "id": "uuid",
    "aluno_id": "uuid-aluno",
    "valor": 150.0,
    "descricao": "Mensalidade Agosto/2025",
    "vencimento": "2025-08-10",
    "status": "PAGO",
    "forma_pagamento": "PIX",
    "data_pagamento": "2025-08-09",
    "registrado_por_id": "uuid-instrutor",
    "observacoes": "Pagamento adiantado.",
    "criado_em": "2025-07-15T10:00:00.000Z",
    "atualizado_em": "2025-08-09T11:00:00.000Z"
  }
]
```

### Detalhar Pagamento

**GET** `/pagamentos/:id`

- Retorna os detalhes de um pagamento específico.
- Permissão: INSTRUTOR/ADMIN.

### Criar Novo Pagamento

**POST** `/pagamentos`

- Cria um novo lançamento financeiro.
- Permissão: INSTRUTOR/ADMIN.

**Body:**

```json
{
  "aluno_id": "uuid-aluno",
  "valor": 150.0,
  "descricao": "Mensalidade Setembro/2025",
  "vencimento": "2025-09-10",
  "forma_pagamento": "CARTAO",
  "observacoes": "Pode ser pago no balcão."
}
```

### Atualizar Pagamento

**PUT** `/pagamentos/:id`

- Atualiza os dados de um pagamento.
- Permissão: INSTRUTOR/ADMIN.

### Atualizar Status do Pagamento

**PATCH** `/pagamentos/:id/status`

- Atualiza apenas o status e a data de pagamento.
- Permissão: INSTRUTOR/ADMIN.

**Body:**

```json
{
  "status": "PAGO",
  "data_pagamento": "2025-09-08"
}
```

### Remover Pagamento (Soft Delete)

**DELETE** `/pagamentos/:id`

- Marca o pagamento como deletado.
- Permissão: INSTRUTOR/ADMIN.

---

## Planos de Pagamento

### Listar Planos

**GET** `/planos-pagamento`

- Lista todos os planos de pagamento.
- Permissão: INSTRUTOR/ADMIN

### Criar Plano

**POST** `/planos-pagamento`

- Cria um novo plano de pagamento recorrente para um aluno.
- Permissão: INSTRUTOR/ADMIN

### Atualizar Plano

**PUT** `/planos-pagamento/:id`

- Atualiza dados do plano.
- Permissão: INSTRUTOR/ADMIN

### Ativar/Desativar Plano

**PATCH** `/planos-pagamento/:id/ativar` ou `/planos-pagamento/:id/desativar`

- Ativa ou desativa o plano.
- Permissão: INSTRUTOR/ADMIN

---

## Processamento Manual (Cron Job)

### Processar Dia

**POST** `/pagamentos/processar-dia`

- Executa manualmente a lógica agendada de geração de cobranças e notificações.
- Permissão: INSTRUTOR/ADMIN

---

## Notificações de Pagamento

### Listar Notificações

**GET** `/notificacoes-pagamento`

- Lista todos os logs de notificações enviadas (mock).
- Permissão: INSTRUTOR/ADMIN

---

## Regras de Permissão

- **ADMIN/INSTRUTOR**: Acesso total (CRUD).
- **ALUNO**: Apenas leitura dos seus próprios pagamentos através do endpoint `/pagamentos/meus`.

## Erros Comuns

- 400: Dados inválidos (ex: valor negativo, status desconhecido).
- 401: Não autenticado.
- 403: Permissão insuficiente.
- 404: Pagamento não encontrado.
