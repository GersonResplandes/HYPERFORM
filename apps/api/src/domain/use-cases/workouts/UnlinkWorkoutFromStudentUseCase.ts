import { IWorkoutStudentsRepository } from './IWorkoutStudentsRepository';

export class UnlinkWorkoutFromStudentUseCase {
  constructor(private workoutStudentsRepository: IWorkoutStudentsRepository) {}

  async execute(id: string): Promise<void> {
    await this.workoutStudentsRepository.unlinkWorkoutFromStudent(id);
  }
}
