import { IWorkoutExercisesRepository } from './IWorkoutExercisesRepository';
import { WorkoutExercise } from './WorkoutExercise';

export class ListWorkoutExercisesUseCase {
  constructor(
    private workoutExercisesRepository: IWorkoutExercisesRepository
  ) {}

  async execute(workout_id: string): Promise<WorkoutExercise[]> {
    return this.workoutExercisesRepository.listByWorkout(workout_id);
  }
}
