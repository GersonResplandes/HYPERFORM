import { IPlanosPagamentoRepository } from '../../repositories/IPlanosPagamentoRepository';
import { PlanoPagamento } from '../../entities/PlanoPagamento';

export class ListPlanosPagamentoUseCase {
  constructor(private planosRepo: IPlanosPagamentoRepository) {}

  async execute(): Promise<PlanoPagamento[]> {
    return this.planosRepo.findAll();
  }
}
