import { Exercise } from '../use-cases/exercises/Exercise';

export interface IExercisesRepository {
  create(exercise: Exercise): Promise<Exercise>;
  findById(id: string): Promise<Exercise | null>;
  findAll(): Promise<Exercise[]>;
  update(exercise: Exercise): Promise<Exercise>;
  softDelete(id: string): Promise<void>;
}
