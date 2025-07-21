import { IExercisesRepository } from '../../repositories/IExercisesRepository';
import { Exercise } from './Exercise';

export class ListExercisesUseCase {
  constructor(private exercisesRepository: IExercisesRepository) {}

  async execute(): Promise<Exercise[]> {
    return this.exercisesRepository.findAll();
  }
}
