import { Workout } from '../../domain/use-cases/workouts/Workout';
import { IWorkoutsRepository } from '../../domain/use-cases/workouts/IWorkoutsRepository';
import { DatabaseConnection } from '../database/connection';

export class WorkoutsRepository implements IWorkoutsRepository {
  private get knex() {
    return DatabaseConnection.getInstance().getConnection();
  }

  async create(workout: Workout): Promise<Workout> {
    await this.knex('workouts').insert(workout);
    return workout;
  }

  async findById(id: string): Promise<Workout | null> {
    const data = await this.knex('workouts').where({ id }).first();
    return data ? (data as Workout) : null;
  }

  async findAll(): Promise<Workout[]> {
    return this.knex('workouts').where({ ativo: true });
  }

  async update(workout: Workout): Promise<Workout> {
    await this.knex('workouts')
      .where({ id: workout.id })
      .update({
        ...workout,
        updated_at: new Date(),
      });
    return workout;
  }

  async softDelete(id: string): Promise<void> {
    await this.knex('workouts')
      .where({ id })
      .update({ ativo: false, updated_at: new Date() });
  }
}
