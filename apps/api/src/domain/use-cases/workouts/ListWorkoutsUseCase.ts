import { IWorkoutsRepository } from './IWorkoutsRepository';
import { Workout } from './Workout';

export class ListWorkoutsUseCase {
  constructor(private workoutsRepository: IWorkoutsRepository) {}

  async execute(): Promise<Workout[]> {
    return this.workoutsRepository.findAll();
  }
}
