import { IPaymentsRepository } from '../../repositories/IPaymentsRepository';

export class DeletePaymentUseCase {
  constructor(private repo: IPaymentsRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
