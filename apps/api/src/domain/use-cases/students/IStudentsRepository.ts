import { Student } from './Student';

export interface ListStudentsFilters {
  userId: string;
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  orderBy?: 'name' | 'email' | 'created_at';
  orderDir?: 'asc' | 'desc';
}

export interface ListStudentsResult {
  data: Array<Pick<Student, 'id' | 'name' | 'email' | 'created_at'>>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface IStudentsRepository {
  create(student: Student): Promise<Student>;
  findById(id: string, userId: string): Promise<Student | null>;
  findByEmail(email: string, userId: string): Promise<Student | null>;
  listByUser(userId: string): Promise<Student[]>;
  listByUserPaginated(
    userId: string,
    page: number,
    limit: number,
    name?: string
  ): Promise<Student[]>;
  countByUser(userId: string, name?: string): Promise<number>;
  update(student: Student): Promise<Student>;
  softDelete(id: string, userId: string): Promise<void>;
}
