import { injectable, inject } from 'tsyringe';
import { IPlansRepository } from '../repositories/IPlansRepository';
import { Plan } from '../entities/Plan';
import { AppError } from '../errors/AppError';

@injectable()
export class GetPlanByIdUseCase {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository
  ) {}

  async execute(id: string, user_id: string): Promise<Plan> {
    const plan = await this.plansRepository.findById(id, user_id);
    if (!plan) {
      throw new AppError('Plano não encontrado', 404);
    }
    return plan;
  }
}
