import { injectable, inject } from 'tsyringe';
import { IPlansRepository } from '../../repositories/IPlansRepository';
import { Plan } from './Plan';
import { z } from 'zod';
import { AppError } from '../../errors/AppError';

const createPlanSchema = z.object({
  title: z.string().min(3, 'Título do plano deve ter pelo menos 3 caracteres'),
  description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  duration: z.number().int().positive('Duração deve ser positiva'),
  price: z.number().positive('Preço deve ser positivo'),
  user_id: z.string().uuid(),
});

interface CreatePlanDTO {
  title: string;
  description: string;
  duration: number;
  price: number;
  user_id: string;
}

@injectable()
export class CreatePlanUseCase {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository
  ) {}

  async execute(data: CreatePlanDTO): Promise<Plan> {
    const parsed = createPlanSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.issues.map((i) => i.message).join(', '),
        400
      );
    }
    const exists = await this.plansRepository.findByName(data.title);
    if (exists) {
      throw new AppError('Já existe um plano com esse título', 400);
    }
    const now = new Date();
    const plan: Plan = {
      id: '',
      title: data.title,
      description: data.description,
      duration: data.duration,
      price: data.price,
      user_id: data.user_id,
      created_at: now,
      updated_at: now,
    };
    return this.plansRepository.create(plan);
  }
}
