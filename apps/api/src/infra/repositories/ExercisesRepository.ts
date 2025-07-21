import { Exercise } from '../../domain/use-cases/exercises/Exercise';
import { IExercisesRepository } from '../../domain/repositories/IExercisesRepository';
import { DatabaseConnection } from '../database/connection';

export class ExercisesRepository implements IExercisesRepository {
  private get knex() {
    return DatabaseConnection.getInstance().getConnection();
  }

  async create(exercise: Exercise): Promise<Exercise> {
    await this.knex('exercises').insert(exercise);
    return exercise;
  }

  async findById(id: string): Promise<Exercise | null> {
    const data = await this.knex('exercises').where({ id }).first();
    return data ? (data as Exercise) : null;
  }

  async findAll(): Promise<Exercise[]> {
    return this.knex('exercises').where({ ativo: true });
  }

  async update(exercise: Exercise): Promise<Exercise> {
    await this.knex('exercises')
      .where({ id: exercise.id })
      .update({
        ...exercise,
        updated_at: new Date(),
      });
    return exercise;
  }

  async softDelete(id: string): Promise<void> {
    await this.knex('exercises')
      .where({ id })
      .update({ ativo: false, updated_at: new Date() });
  }
}
