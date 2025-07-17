import { injectable, inject } from 'tsyringe';
import { IPlansRepository } from '../repositories/IPlansRepository';
import { Plan } from '../entities/Plan';

@injectable()
export class ListPlansUseCase {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository
  ) {}

  async execute(): Promise<Plan[]> {
    return this.plansRepository.list();
  }
}
