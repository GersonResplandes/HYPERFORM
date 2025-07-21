import { IWorkoutsRepository } from '../../repositories/IWorkoutsRepository';

export class DeleteWorkoutUseCase {
  constructor(private workoutsRepository: IWorkoutsRepository) {}

  async execute(id: string): Promise<void> {
    const workout = await this.workoutsRepository.findById(id);
    if (!workout) {
      throw new Error('Treino não encontrado');
    }
    await this.workoutsRepository.softDelete(id);
  }
}
