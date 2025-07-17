import { injectable, inject } from 'tsyringe';
import { IPlansRepository } from '../repositories/IPlansRepository';
import { Plan } from '../entities/Plan';
import { z } from 'zod';
import { AppError } from '../errors/AppError';

const createPlanSchema = z.object({
  name: z.string().min(3, 'Nome do plano deve ter pelo menos 3 caracteres'),
  duration: z.number().int().positive('Duração deve ser positiva'),
  price: z.number().positive('Preço deve ser positivo'),
});

interface CreatePlanDTO {
  name: string;
  duration: number;
  price: number;
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
    const exists = await this.plansRepository.findByName(data.name);
    if (exists) {
      throw new AppError('Já existe um plano com esse nome', 400);
    }
    const plan: Plan = {
      id: '',
      name: data.name,
      duration: data.duration,
      price: data.price,
      created_at: new Date(),
      deleted_at: null,
    };
    return this.plansRepository.create(plan);
  }
}
