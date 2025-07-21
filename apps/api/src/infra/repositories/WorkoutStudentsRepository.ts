import { WorkoutStudent } from '../../domain/use-cases/workouts/WorkoutStudent';
import { IWorkoutStudentsRepository } from '../../domain/use-cases/workouts/IWorkoutStudentsRepository';
import { DatabaseConnection } from '../database/connection';

export class WorkoutStudentsRepository implements IWorkoutStudentsRepository {
  private get knex() {
    return DatabaseConnection.getInstance().getConnection();
  }

  async linkWorkoutToStudent(data: WorkoutStudent): Promise<WorkoutStudent> {
    await this.knex('workout_students').insert(data);
    return data;
  }

  async unlinkWorkoutFromStudent(id: string): Promise<void> {
    await this.knex('workout_students').where({ id }).update({
      ativo: false,
      desvinculado_em: new Date(),
      updated_at: new Date(),
    });
  }

  async listWorkoutsByStudent(student_id: string): Promise<WorkoutStudent[]> {
    return this.knex('workout_students').where({ student_id, ativo: true });
  }
}
