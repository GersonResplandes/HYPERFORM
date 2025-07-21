export enum StatusPagamento {
  PENDENTE = 'PENDENTE',
  PAGO = 'PAGO',
  ATRASADO = 'ATRASADO',
}

export enum FormaPagamento {
  DINHEIRO = 'DINHEIRO',
  CARTAO = 'CARTAO',
  PIX = 'PIX',
  OUTRO = 'OUTRO',
}

export interface Payment {
  id: string;
  aluno_id: string;
  valor: number;
  descricao: string;
  vencimento: Date;
  status: StatusPagamento;
  forma_pagamento: FormaPagamento;
  data_pagamento?: Date;
  registrado_por_id: string;
  observacoes?: string;
  criado_em: Date;
  atualizado_em: Date;
  deletado_em?: Date;
}
