import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { IWorkoutsRepository } from '../../repositories/IWorkoutsRepository';
import { Workout, ObjetivoTreino } from './Workout';

const createWorkoutSchema = z.object({
  nome: z.string().min(3),
  descricao: z.string().min(3),
  objetivo: z.nativeEnum(ObjetivoTreino),
  frequencia_semanal: z.number().int().min(1),
  criado_por_id: z.string().uuid(),
});

interface IRequest {
  nome: string;
  descricao: string;
  objetivo: ObjetivoTreino;
  frequencia_semanal: number;
  criado_por_id: string;
}

export class CreateWorkoutUseCase {
  constructor(private workoutsRepository: IWorkoutsRepository) {}

  async execute(data: IRequest): Promise<Workout> {
    const parsed = createWorkoutSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
    }
    const now = new Date();
    const workout: Workout = {
      id: uuidv4(),
      ...parsed.data,
      ativo: true,
      created_at: now,
      updated_at: now,
    };
    await this.workoutsRepository.create(workout);
    return workout;
  }
}
