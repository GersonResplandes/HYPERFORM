export interface PlanoPagamento {
  id: string;
  aluno_id: string;
  descricao: string;
  valor: number;
  inicio: Date;
  dia_vencimento: number;
  ativo: boolean;
  criado_em: Date;
  atualizado_em: Date;
}
