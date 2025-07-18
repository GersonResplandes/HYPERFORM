import { Attendance } from '../entities/Attendance';

export interface IAttendancesRepository {
  create(attendance: Attendance): Promise<Attendance>;
  findById(id: string): Promise<Attendance | null>;
  findByStudentAndDate(
    student_id: string,
    check_in_date: Date
  ): Promise<Attendance | null>;
  listByStudent(
    student_id: string,
    page: number,
    limit: number
  ): Promise<Attendance[]>;
  listByStudentAndDate(student_id: string, date: Date): Promise<Attendance[]>;
}
