import { z } from 'zod';
import { IPhysicalProgressRepository } from '../../repositories/IPhysicalProgressRepository';
import { PhysicalProgress } from '../../entities/PhysicalProgress';

const updateSchema = z.object({
  id: z.string().uuid(),
  peso: z.number().positive().optional(),
  altura: z.number().positive().optional(),
  percentual_gordura: z.number().positive().optional(),
  // Add other measurements here
});

interface IRequest {
  id: string;
  peso?: number;
  altura?: number;
  percentual_gordura?: number;
  // Add other measurements here
}

export class UpdatePhysicalProgressUseCase {
  constructor(private repo: IPhysicalProgressRepository) {}

  async execute(data: IRequest): Promise<PhysicalProgress> {
    const parsed = updateSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
    }
    const record = await this.repo.findById(parsed.data.id);
    if (!record) {
      throw new Error('Registro de progresso não encontrado');
    }
    const updated: PhysicalProgress = {
      ...record,
      ...parsed.data,
      atualizado_em: new Date(),
    };
    await this.repo.update(updated);
    return updated;
  }
}
