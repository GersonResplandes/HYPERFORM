import { INotificacoesPagamentoRepository } from '../../domain/repositories/INotificacoesPagamentoRepository';
import { NotificacaoPagamento } from '../../domain/entities/NotificacaoPagamento';
import { DatabaseConnection } from '../database/connection';

export class NotificacoesPagamentoRepository
  implements INotificacoesPagamentoRepository
{
  private get knex() {
    return DatabaseConnection.getInstance().getConnection();
  }

  async create(data: NotificacaoPagamento): Promise<NotificacaoPagamento> {
    await this.knex('notificacoes_pagamento').insert(data);
    return data;
  }

  async findAll(): Promise<NotificacaoPagamento[]> {
    return this.knex('notificacoes_pagamento').orderBy('data_envio', 'desc');
  }

  async findByPagamentoId(
    pagamento_id: string
  ): Promise<NotificacaoPagamento[]> {
    return this.knex('notificacoes_pagamento')
      .where({ pagamento_id })
      .orderBy('data_envio', 'desc');
  }
}
