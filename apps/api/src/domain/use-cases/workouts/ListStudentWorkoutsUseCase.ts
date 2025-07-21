import { IWorkoutStudentsRepository } from '../../repositories/IWorkoutStudentsRepository';
import { WorkoutStudent } from './WorkoutStudent';

export class ListStudentWorkoutsUseCase {
  constructor(private workoutStudentsRepository: IWorkoutStudentsRepository) {}

  async execute(student_id: string): Promise<WorkoutStudent[]> {
    return this.workoutStudentsRepository.listWorkoutsByStudent(student_id);
  }
}
