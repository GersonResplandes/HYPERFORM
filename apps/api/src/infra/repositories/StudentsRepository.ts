import { Student } from '../../domain/entities/Student';
import { IStudentsRepository } from '../../domain/repositories/IStudentsRepository';
import { DatabaseConnection } from '../database/connection';

export class StudentsRepository implements IStudentsRepository {
  private get knex() {
    return DatabaseConnection.getInstance().getConnection();
  }

  async create(student: Student): Promise<Student> {
    await this.knex('students').insert({
      ...student,
      birth_date: student.birth_date,
      deleted_at: null,
    });
    return student;
  }

  async findById(id: string, userId: string): Promise<Student | null> {
    const data = await this.knex('students')
      .where({ id, user_id: userId })
      .whereNull('deleted_at')
      .first();
    return data ? (data as Student) : null;
  }

  async findByEmail(email: string, userId: string): Promise<Student | null> {
    const data = await this.knex('students')
      .where({ email, user_id: userId })
      .whereNull('deleted_at')
      .first();
    return data ? (data as Student) : null;
  }

  async listByUser(userId: string): Promise<Student[]> {
    return this.knex('students')
      .where({ user_id: userId })
      .andWhere('deleted_at', null);
  }

  async listByUserPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<Student[]> {
    const offset = (page - 1) * limit;
    return this.knex('students')
      .where({ user_id: userId })
      .andWhere('deleted_at', null)
      .limit(limit)
      .offset(offset);
  }

  async countByUser(userId: string): Promise<number> {
    const [{ count }] = await this.knex('students')
      .where({ user_id: userId })
      .whereNull('deleted_at')
      .count<{ count: string }[]>('id as count');
    return Number(count);
  }

  async update(student: Student): Promise<Student> {
    await this.knex('students')
      .where({ id: student.id, user_id: student.user_id })
      .update({
        name: student.name,
        email: student.email,
        phone: student.phone,
        birth_date: student.birth_date,
        gender: student.gender,
        notes: student.notes,
        updated_at: new Date(),
      });
    return student;
  }

  async softDelete(id: string, userId: string): Promise<void> {
    await this.knex('students')
      .where({ id, user_id: userId })
      .update({ deleted_at: new Date() });
  }
}
