import { WorkoutExercise } from '../../domain/use-cases/workouts/WorkoutExercise';
import { IWorkoutExercisesRepository } from '../../domain/repositories/IWorkoutExercisesRepository';
import { DatabaseConnection } from '../database/connection';

export class WorkoutExercisesRepository implements IWorkoutExercisesRepository {
  private get knex() {
    return DatabaseConnection.getInstance().getConnection();
  }

  async addExerciseToWorkout(data: WorkoutExercise): Promise<WorkoutExercise> {
    await this.knex('workout_exercises').insert(data);
    return data;
  }

  async removeExerciseFromWorkout(id: string): Promise<void> {
    await this.knex('workout_exercises').where({ id }).del();
  }

  async listByWorkout(workout_id: string): Promise<WorkoutExercise[]> {
    return this.knex('workout_exercises').where({ workout_id });
  }

  async update(workoutExercise: WorkoutExercise): Promise<WorkoutExercise> {
    await this.knex('workout_exercises')
      .where({ id: workoutExercise.id })
      .update({
        ...workoutExercise,
        updated_at: new Date(),
      });
    return workoutExercise;
  }
}
