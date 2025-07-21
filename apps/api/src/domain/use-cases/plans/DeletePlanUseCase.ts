import { inject, injectable } from 'tsyringe';
import { IPlansRepository } from './IPlansRepository';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

const deletePlanSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
});

interface DeletePlanDTO {
  id: string;
  user_id: string;
}

@injectable()
export class DeletePlanUseCase {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository
  ) {}

  async execute(data: DeletePlanDTO): Promise<void> {
    const parsed = deletePlanSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.issues.map((i) => i.message).join(', '),
        400
      );
    }
    const plan = await this.plansRepository.findById(data.id, data.user_id);
    if (!plan) {
      throw new AppError('Plano não encontrado', 404);
    }
    await this.plansRepository.softDelete(data.id);
  }
}
