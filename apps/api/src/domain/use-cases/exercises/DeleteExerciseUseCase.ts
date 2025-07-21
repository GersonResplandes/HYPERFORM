import { IExercisesRepository } from '../../repositories/IExercisesRepository';

export class DeleteExerciseUseCase {
  constructor(private exercisesRepository: IExercisesRepository) {}

  async execute(id: string): Promise<void> {
    const exercise = await this.exercisesRepository.findById(id);
    if (!exercise) {
      throw new Error('Exercício não encontrado');
    }
    await this.exercisesRepository.softDelete(id);
  }
}
