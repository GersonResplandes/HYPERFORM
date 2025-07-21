import { IExercisesRepository } from './IExercisesRepository';
import { Exercise } from './Exercise';

export class GetExerciseByIdUseCase {
  constructor(private exercisesRepository: IExercisesRepository) {}

  async execute(id: string): Promise<Exercise | null> {
    return this.exercisesRepository.findById(id);
  }
}
