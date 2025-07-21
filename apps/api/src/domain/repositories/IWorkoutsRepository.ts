import { Workout } from './Workout';

export interface IWorkoutsRepository {
  create(workout: Workout): Promise<Workout>;
  findById(id: string): Promise<Workout | null>;
  findAll(): Promise<Workout[]>;
  update(workout: Workout): Promise<Workout>;
  softDelete(id: string): Promise<void>;
}
