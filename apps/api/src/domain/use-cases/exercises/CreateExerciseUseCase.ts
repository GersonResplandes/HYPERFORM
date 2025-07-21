import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { IExercisesRepository } from '../exercises/IExercisesRepository';
import { Exercise, GrupoMuscular } from './Exercise';

const createExerciseSchema = z.object({
  nome: z.string().min(3),
  descricao: z.string().min(3),
  grupo_muscular: z.nativeEnum(GrupoMuscular),
  video_url: z.string().url().optional(),
  observacoes: z.string().optional(),
});

interface IRequest {
  nome: string;
  descricao: string;
  grupo_muscular: GrupoMuscular;
  video_url?: string;
  observacoes?: string;
}

export class CreateExerciseUseCase {
  constructor(private exercisesRepository: IExercisesRepository) {}

  async execute(data: IRequest): Promise<Exercise> {
    const parsed = createExerciseSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
    }
    const now = new Date();
    const exercise: Exercise = {
      id: uuidv4(),
      ...parsed.data,
      ativo: true,
      created_at: now,
      updated_at: now,
    };
    await this.exercisesRepository.create(exercise);
    return exercise;
  }
}
