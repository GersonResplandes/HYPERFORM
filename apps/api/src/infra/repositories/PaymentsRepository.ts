import {
  IPaymentsRepository,
  PaymentFilters,
} from '../../domain/repositories/IPaymentsRepository';
import { Payment, StatusPagamento } from '../../domain/entities/Payment';
import { DatabaseConnection } from '../database/connection';

export class PaymentsRepository implements IPaymentsRepository {
  private get knex() {
    return DatabaseConnection.getInstance().getConnection();
  }

  async create(data: Payment): Promise<Payment> {
    await this.knex('payments').insert(data);
    return data;
  }

  async update(data: Payment): Promise<Payment> {
    await this.knex('payments')
      .where({ id: data.id })
      .update({
        ...data,
        atualizado_em: new Date(),
      });
    return data;
  }

  async updateStatus(
    id: string,
    status: StatusPagamento,
    data_pagamento?: Date
  ): Promise<void> {
    await this.knex('payments')
      .where({ id })
      .update({
        status,
        data_pagamento: data_pagamento ?? null,
        atualizado_em: new Date(),
      });
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.knex('payments')
      .where({ id })
      .whereNull('deletado_em')
      .first();
    if (!payment) return null;
    // Atualiza status para ATRASADO se vencido e não pago
    if (
      payment.status === StatusPagamento.PENDENTE &&
      payment.vencimento < new Date() &&
      !payment.data_pagamento
    ) {
      payment.status = StatusPagamento.ATRASADO;
    }
    return payment as Payment;
  }

  async findAll(filters: PaymentFilters = {}): Promise<Payment[]> {
    let query = this.knex('payments').whereNull('deletado_em');
    if (filters.aluno_id) {
      query = query.andWhere('aluno_id', filters.aluno_id);
    }
    if (filters.status) {
      query = query.andWhere('status', filters.status);
    }
    if (filters.vencimento_inicio) {
      query = query.andWhere('vencimento', '>=', filters.vencimento_inicio);
    }
    if (filters.vencimento_fim) {
      query = query.andWhere('vencimento', '<=', filters.vencimento_fim);
    }
    const results = await query.orderBy('vencimento', 'desc');
    // Atualiza status para ATRASADO se vencido e não pago
    return results.map((payment: any) => {
      if (
        payment.status === StatusPagamento.PENDENTE &&
        payment.vencimento < new Date() &&
        !payment.data_pagamento
      ) {
        payment.status = StatusPagamento.ATRASADO;
      }
      return payment as Payment;
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.knex('payments')
      .where({ id })
      .update({ deletado_em: new Date() });
  }
}
