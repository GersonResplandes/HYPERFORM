import { Enrollment } from '../entities/Enrollment';

export interface IEnrollmentsRepository {
  create(enrollment: Enrollment): Promise<Enrollment>;
  findById(id: string): Promise<Enrollment | null>;
  list(page: number, limit: number): Promise<Enrollment[]>;
  count(): Promise<number>;
  update(enrollment: Enrollment): Promise<Enrollment>;
  softDelete(id: string): Promise<void>;
  findActiveByStudentId(student_id: string): Promise<Enrollment | null>;
}
