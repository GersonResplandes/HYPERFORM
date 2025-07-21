import { CheckIn } from './CheckIn';

export interface ListCheckInsParams {
  student_id: string;
  page: number;
  limit: number;
  date?: string; // YYYY-MM-DD
}

export interface ListCheckInsResult {
  checkIns: Array<{
    checkInId: string;
    createdAt: string;
    studentId: string;
  }>;
  total: number;
  page: number;
  limit: number;
}

export interface ICheckInsRepository {
  create(checkIn: CheckIn): Promise<CheckIn>;
  findByStudentAndDate(student_id: string, date: Date): Promise<CheckIn | null>;
  listByStudent(params: ListCheckInsParams): Promise<ListCheckInsResult>;
}
