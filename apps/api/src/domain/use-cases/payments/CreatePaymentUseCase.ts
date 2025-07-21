import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { IPaymentsRepository } from '../../repositories/IPaymentsRepository';
import {
  Payment,
  StatusPagamento,
  FormaPagamento,
} from '../../entities/Payment';

const createPaymentSchema = z.object({
  aluno_id: z.string().uuid(),
  valor: z.coerce.number().positive(),
  descricao: z.string().min(1).max(100),
  vencimento: z.coerce.date(),
  status: z.nativeEnum(StatusPagamento).default(StatusPagamento.PENDENTE),
  forma_pagamento: z.nativeEnum(FormaPagamento),
  data_pagamento: z.coerce.date().optional(),
  registrado_por_id: z.string().uuid(),
  observacoes: z.string().max(1000).optional(),
});

export class CreatePaymentUseCase {
  constructor(private repo: IPaymentsRepository) {}

  async execute(data: z.input<typeof createPaymentSchema>): Promise<Payment> {
    const parsed = createPaymentSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
    }
    const now = new Date();
    const payment: Payment = {
      id: uuidv4(),
      ...parsed.data,
      criado_em: now,
      atualizado_em: now,
    };
    await this.repo.create(payment);
    return payment;
  }
}
