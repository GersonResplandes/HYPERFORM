import { CheckIn } from '../entities/CheckIn';

export interface ICheckInsRepository {
  create(checkIn: CheckIn): Promise<CheckIn>;
  findByStudentAndDate(student_id: string, date: Date): Promise<CheckIn | null>;
}
