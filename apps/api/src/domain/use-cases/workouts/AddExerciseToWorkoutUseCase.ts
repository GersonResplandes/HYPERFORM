import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { IWorkoutExercisesRepository } from '../../repositories/IWorkoutExercisesRepository';
import { WorkoutExercise } from './WorkoutExercise';

const addExerciseToWorkoutSchema = z.object({
  workout_id: z.string().uuid(),
  exercise_id: z.string().uuid(),
  ordem: z.number().int().min(1),
  series: z.number().int().min(1),
  repeticoes: z.string().min(1),
  carga: z.string().optional(),
  observacoes: z.string().optional(),
});

interface IRequest {
  workout_id: string;
  exercise_id: string;
  ordem: number;
  series: number;
  repeticoes: string;
  carga?: string;
  observacoes?: string;
}

export class AddExerciseToWorkoutUseCase {
  constructor(
    private workoutExercisesRepository: IWorkoutExercisesRepository
  ) {}

  async execute(data: IRequest): Promise<WorkoutExercise> {
    const parsed = addExerciseToWorkoutSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
    }
    const now = new Date();
    const workoutExercise: WorkoutExercise = {
      id: uuidv4(),
      ...parsed.data,
      created_at: now,
      updated_at: now,
    };
    await this.workoutExercisesRepository.addExerciseToWorkout(workoutExercise);
    return workoutExercise;
  }
}
