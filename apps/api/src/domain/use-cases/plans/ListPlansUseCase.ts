import { inject, injectable } from 'tsyringe';
import { IPlansRepository } from '../../repositories/IPlansRepository';
import { Plan } from './Plan';

@injectable()
export class ListPlansUseCase {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository
  ) {}

  async execute(user_id: string): Promise<Plan[]> {
    return this.plansRepository.listByUser(user_id);
  }
}
