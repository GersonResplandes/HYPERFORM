import { z } from 'zod';
import { IPaymentsRepository } from '../../repositories/IPaymentsRepository';
import {
  Payment,
  StatusPagamento,
  FormaPagamento,
} from '../../entities/Payment';

const updatePaymentSchema = z.object({
  id: z.string().uuid(),
  valor: z.coerce.number().positive(),
  descricao: z.string().min(1).max(100),
  vencimento: z.coerce.date(),
  status: z.nativeEnum(StatusPagamento),
  forma_pagamento: z.nativeEnum(FormaPagamento),
  data_pagamento: z.coerce.date().optional(),
  observacoes: z.string().max(1000).optional(),
});

export class UpdatePaymentUseCase {
  constructor(private repo: IPaymentsRepository) {}

  async execute(data: z.input<typeof updatePaymentSchema>): Promise<Payment> {
    const parsed = updatePaymentSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
    }
    const payment = await this.repo.findById(parsed.data.id);
    if (!payment) throw new Error('Pagamento não encontrado');
    const updated: Payment = {
      ...payment,
      ...parsed.data,
      atualizado_em: new Date(),
    };
    await this.repo.update(updated);
    return updated;
  }
}
