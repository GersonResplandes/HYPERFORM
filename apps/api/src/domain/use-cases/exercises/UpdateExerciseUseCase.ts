import { z } from 'zod';
import { IExercisesRepository } from '../../repositories/IExercisesRepository';
import { Exercise, GrupoMuscular } from './Exercise';

const updateExerciseSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(3).optional(),
  descricao: z.string().min(3).optional(),
  grupo_muscular: z.nativeEnum(GrupoMuscular).optional(),
  video_url: z.string().url().optional(),
  observacoes: z.string().optional(),
});

interface IRequest {
  id: string;
  nome?: string;
  descricao?: string;
  grupo_muscular?: GrupoMuscular;
  video_url?: string;
  observacoes?: string;
}

export class UpdateExerciseUseCase {
  constructor(private exercisesRepository: IExercisesRepository) {}

  async execute(data: IRequest): Promise<Exercise> {
    const parsed = updateExerciseSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
    }
    const exercise = await this.exercisesRepository.findById(parsed.data.id);
    if (!exercise) {
      throw new Error('Exercício não encontrado');
    }
    const updated: Exercise = {
      ...exercise,
      ...parsed.data,
      updated_at: new Date(),
    };
    await this.exercisesRepository.update(updated);
    return updated;
  }
}
