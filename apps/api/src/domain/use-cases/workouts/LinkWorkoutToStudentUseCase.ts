import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { IWorkoutStudentsRepository } from '../../repositories/IWorkoutStudentsRepository';
import { WorkoutStudent } from './WorkoutStudent';

const linkWorkoutToStudentSchema = z.object({
  workout_id: z.string().uuid(),
  student_id: z.string().uuid(),
});

interface IRequest {
  workout_id: string;
  student_id: string;
}

export class LinkWorkoutToStudentUseCase {
  constructor(private workoutStudentsRepository: IWorkoutStudentsRepository) {}

  async execute(data: IRequest): Promise<WorkoutStudent> {
    const parsed = linkWorkoutToStudentSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
    }
    const now = new Date();
    const workoutStudent: WorkoutStudent = {
      id: uuidv4(),
      ...parsed.data,
      ativo: true,
      vinculado_em: now,
      created_at: now,
      updated_at: now,
    };
    await this.workoutStudentsRepository.linkWorkoutToStudent(workoutStudent);
    return workoutStudent;
  }
}
