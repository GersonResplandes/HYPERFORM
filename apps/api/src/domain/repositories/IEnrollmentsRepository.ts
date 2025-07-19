import { Enrollment } from '../entities/Enrollment';

export interface IEnrollmentsRepository {
  create(enrollment: Enrollment): Promise<Enrollment>;
  findById(id: string, user_id: string): Promise<Enrollment | null>;
  listByUser(
    user_id: string,
    page: number,
    limit: number
  ): Promise<Enrollment[]>;
  countByUser(user_id: string): Promise<number>;
  update(enrollment: Enrollment): Promise<Enrollment>;
  softDelete(id: string): Promise<void>;
  findActiveByStudentId(
    student_id: string,
    startDate?: Date
  ): Promise<Enrollment | null>;
}
