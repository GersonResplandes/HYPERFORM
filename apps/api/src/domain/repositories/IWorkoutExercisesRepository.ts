import { WorkoutExercise } from '../use-cases/workouts/WorkoutExercise';

export interface IWorkoutExercisesRepository {
  addExerciseToWorkout(data: WorkoutExercise): Promise<WorkoutExercise>;
  removeExerciseFromWorkout(id: string): Promise<void>;
  listByWorkout(workout_id: string): Promise<WorkoutExercise[]>;
  update(workoutExercise: WorkoutExercise): Promise<WorkoutExercise>;
}
