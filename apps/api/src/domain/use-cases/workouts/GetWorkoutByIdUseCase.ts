import { IWorkoutsRepository } from './IWorkoutsRepository';
import { Workout } from './Workout';

export class GetWorkoutByIdUseCase {
  constructor(private workoutsRepository: IWorkoutsRepository) {}

  async execute(id: string): Promise<Workout | null> {
    return this.workoutsRepository.findById(id);
  }
}
