import {
  IPaymentsRepository,
  PaymentFilters,
} from '../../repositories/IPaymentsRepository';
import { Payment } from '../../entities/Payment';

export class ListPaymentsUseCase {
  constructor(private repo: IPaymentsRepository) {}

  async execute(filters: PaymentFilters = {}): Promise<Payment[]> {
    return this.repo.findAll(filters);
  }
}
