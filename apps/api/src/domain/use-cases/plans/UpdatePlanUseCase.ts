import { inject, injectable } from 'tsyringe';
import { IPlansRepository } from '../../repositories/IPlansRepository';
import { Plan } from './Plan';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

const updatePlanSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  price: z.number().positive().optional(),
  duration: z.number().int().positive().optional(),
});

interface UpdatePlanDTO {
  id: string;
  user_id: string;
  title?: string;
  description?: string;
  price?: number;
  duration?: number;
}

@injectable()
export class UpdatePlanUseCase {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository
  ) {}

  async execute(data: UpdatePlanDTO): Promise<Plan> {
    const parsed = updatePlanSchema.safeParse(data);
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
    if (data.title) plan.title = data.title;
    if (data.description) plan.description = data.description;
    if (data.price) plan.price = data.price;
    if (data.duration) plan.duration = data.duration;
    plan.updated_at = new Date();
    return this.plansRepository.update(plan);
  }
}
