import { injectable, inject } from 'tsyringe';
import { IPlansRepository } from '../repositories/IPlansRepository';
import { AppError } from '../errors/AppError';

@injectable()
export class DeletePlanUseCase {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository
  ) {}

  async execute(id: string): Promise<void> {
    const plan = await this.plansRepository.findById(id);
    if (!plan) {
      throw new AppError('Plano não encontrado', 404);
    }
    await this.plansRepository.softDelete(id);
  }
}
