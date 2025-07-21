import { Payment, StatusPagamento, FormaPagamento } from '../entities/Payment';

export interface PaymentFilters {
  aluno_id?: string;
  status?: StatusPagamento;
  vencimento_inicio?: Date;
  vencimento_fim?: Date;
}

export interface IPaymentsRepository {
  create(data: Payment): Promise<Payment>;
  update(data: Payment): Promise<Payment>;
  updateStatus(
    id: string,
    status: StatusPagamento,
    data_pagamento?: Date
  ): Promise<void>;
  findById(id: string): Promise<Payment | null>;
  findAll(filters?: PaymentFilters): Promise<Payment[]>;
  softDelete(id: string): Promise<void>;
}
