import { z } from 'zod';
import { IWorkoutsRepository } from './IWorkoutsRepository';
import { Workout, ObjetivoTreino } from './Workout';

const updateWorkoutSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(3).optional(),
  descricao: z.string().min(3).optional(),
  objetivo: z.nativeEnum(ObjetivoTreino).optional(),
  frequencia_semanal: z.number().int().min(1).optional(),
});

interface IRequest {
  id: string;
  nome?: string;
  descricao?: string;
  objetivo?: ObjetivoTreino;
  frequencia_semanal?: number;
}

export class UpdateWorkoutUseCase {
  constructor(private workoutsRepository: IWorkoutsRepository) {}

  async execute(data: IRequest): Promise<Workout> {
    const parsed = updateWorkoutSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
    }
    const workout = await this.workoutsRepository.findById(parsed.data.id);
    if (!workout) {
      throw new Error('Treino não encontrado');
    }
    const updated: Workout = {
      ...workout,
      ...parsed.data,
      updated_at: new Date(),
    };
    await this.workoutsRepository.update(updated);
    return updated;
  }
}
