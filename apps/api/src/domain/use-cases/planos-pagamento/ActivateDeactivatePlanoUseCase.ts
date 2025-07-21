import { IPlanosPagamentoRepository } from '../../repositories/IPlanosPagamentoRepository';

export class ActivateDeactivatePlanoUseCase {
  constructor(private planosRepo: IPlanosPagamentoRepository) {}

  async execute(id: string, ativar: boolean): Promise<void> {
    if (ativar) {
      await this.planosRepo.activate(id);
    } else {
      await this.planosRepo.deactivate(id);
    }
  }
}
