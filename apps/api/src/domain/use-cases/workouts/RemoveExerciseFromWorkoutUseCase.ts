import { IWorkoutExercisesRepository } from './IWorkoutExercisesRepository';

export class RemoveExerciseFromWorkoutUseCase {
  constructor(
    private workoutExercisesRepository: IWorkoutExercisesRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this.workoutExercisesRepository.removeExerciseFromWorkout(id);
  }
}
