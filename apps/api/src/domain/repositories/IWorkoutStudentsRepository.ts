import { WorkoutStudent } from './WorkoutStudent';

export interface IWorkoutStudentsRepository {
  linkWorkoutToStudent(data: WorkoutStudent): Promise<WorkoutStudent>;
  unlinkWorkoutFromStudent(id: string): Promise<void>;
  listWorkoutsByStudent(student_id: string): Promise<WorkoutStudent[]>;
}
