import { NotificacaoPagamento } from '../entities/NotificacaoPagamento';

export interface INotificacoesPagamentoRepository {
  create(data: NotificacaoPagamento): Promise<NotificacaoPagamento>;
  findAll(): Promise<NotificacaoPagamento[]>;
  findByPagamentoId(pagamento_id: string): Promise<NotificacaoPagamento[]>;
}
