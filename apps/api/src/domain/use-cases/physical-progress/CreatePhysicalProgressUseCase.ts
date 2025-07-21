import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { IPhysicalProgressRepository } from '../../repositories/IPhysicalProgressRepository';
import { PhysicalProgress } from '../../entities/PhysicalProgress';

const createSchema = z.object({
  aluno_id: z.string().uuid(),
  data: z.coerce.date(),
  peso: z.number().positive(),
  altura: z.number().positive(),
  percentual_gordura: z.number().positive().optional(),
  // Add other measurements here
  registrado_por_id: z.string().uuid(),
});

interface IRequest {
  aluno_id: string;
  data: Date;
  peso: number;
  altura: number;
  percentual_gordura?: number;
  // Add other measurements here
  registrado_por_id: string;
}

export class CreatePhysicalProgressUseCase {
  constructor(private repo: IPhysicalProgressRepository) {}

  async execute(data: IRequest): Promise<PhysicalProgress> {
    const parsed = createSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
    }
    const now = new Date();
    const progress: PhysicalProgress = {
      id: uuidv4(),
      ...parsed.data,
      data_avaliacao: now,
      criado_em: now,
      atualizado_em: now,
    };
    await this.repo.create(progress);
    return progress;
  }
}
