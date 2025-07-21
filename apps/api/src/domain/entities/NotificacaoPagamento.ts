export enum TipoNotificacao {
  LEMBRETE_3_DIAS = 'LEMBRETE_3_DIAS',
  LEMBRETE_VENCIMENTO = 'LEMBRETE_VENCIMENTO',
}

export interface NotificacaoPagamento {
  id: string;
  pagamento_id: string;
  tipo_notificacao: TipoNotificacao;
  data_envio: Date;
}
