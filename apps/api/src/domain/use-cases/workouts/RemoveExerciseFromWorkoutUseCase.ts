import { IWorkoutExercisesRepository } from '../../repositories/IWorkoutExercisesRepository';

export class RemoveExerciseFromWorkoutUseCase {
  constructor(
    private workoutExercisesRepository: IWorkoutExercisesRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this.workoutExercisesRepository.removeExerciseFromWorkout(id);
  }
}
