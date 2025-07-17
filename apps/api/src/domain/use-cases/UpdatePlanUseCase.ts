import { injectable, inject } from 'tsyringe';
import { IPlansRepository } from '../repositories/IPlansRepository';
import { Plan } from '../entities/Plan';
import { z } from 'zod';
import { AppError } from '../errors/AppError';

const updatePlanSchema = z.object({
  name: z.string().min(3, 'Nome do plano deve ter pelo menos 3 caracteres'),
  duration: z.number().int().positive('Duração deve ser positiva'),
  price: z.number().positive('Preço deve ser positivo'),
});

interface UpdatePlanDTO {
  id: string;
  name: string;
  duration: number;
  price: number;
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
    const plan = await this.plansRepository.findById(data.id);
    if (!plan) {
      throw new AppError('Plano não encontrado', 404);
    }
    const exists = await this.plansRepository.findByName(data.name);
    if (exists && exists.id !== data.id) {
      throw new AppError('Já existe um plano com esse nome', 400);
    }
    plan.name = data.name;
    plan.duration = data.duration;
    plan.price = data.price;
    return this.plansRepository.update(plan);
  }
}
