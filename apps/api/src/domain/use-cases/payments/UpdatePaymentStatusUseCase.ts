import { z } from 'zod';
import { IPaymentsRepository } from '../../repositories/IPaymentsRepository';
import { StatusPagamento } from '../../entities/Payment';

const updateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(StatusPagamento),
  data_pagamento: z.coerce.date().optional(),
});

export class UpdatePaymentStatusUseCase {
  constructor(private repo: IPaymentsRepository) {}

  async execute(data: z.input<typeof updateStatusSchema>): Promise<void> {
    const parsed = updateStatusSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
    }
    await this.repo.updateStatus(
      parsed.data.id,
      parsed.data.status,
      parsed.data.data_pagamento
    );
  }
}
