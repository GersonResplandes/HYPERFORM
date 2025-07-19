import { injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { IEnrollmentsRepository } from '../../domain/repositories/IEnrollmentsRepository';
import { Enrollment } from '../../domain/entities/Enrollment';
import { DatabaseConnection } from '../database/connection';

@injectable()
export class EnrollmentsRepository implements IEnrollmentsRepository {
  private db: any;

  constructor() {
    this.db = DatabaseConnection.getInstance().getConnection();
  }

  async create(enrollment: Enrollment): Promise<Enrollment> {
    const id = enrollment.id || uuidv4();
    const now = new Date();
    await this.db('enrollments').insert({
      id,
      student_id: enrollment.student_id,
      plan_id: enrollment.plan_id,
      start_date: enrollment.start_date,
      end_date: enrollment.end_date,
      price: enrollment.price,
      created_at: now,
      deleted_at: null,
    });
    return this.findById(id, '') as Promise<Enrollment>;
  }

  async findById(id: string, user_id: string): Promise<Enrollment | null> {
    const enrollment = await this.db('enrollments as e')
      .join('students as s', 'e.student_id', 's.id')
      .where({
        'e.id': id,
        'e.deleted_at': null,
        's.user_id': user_id,
      })
      .first();
    return enrollment ? this.map(enrollment) : null;
  }

  async listByUser(
    user_id: string,
    page: number,
    limit: number
  ): Promise<Enrollment[]> {
    const offset = (page - 1) * limit;
    const enrollments = await this.db('enrollments as e')
      .join('students as s', 'e.student_id', 's.id')
      .where({
        'e.deleted_at': null,
        's.user_id': user_id,
      })
      .orderBy('e.created_at', 'desc')
      .limit(limit)
      .offset(offset);
    return enrollments.map(this.map);
  }

  async countByUser(user_id: string): Promise<number> {
    const result = await this.db('enrollments as e')
      .join('students as s', 'e.student_id', 's.id')
      .where({
        'e.deleted_at': null,
        's.user_id': user_id,
      })
      .count('* as total')
      .first();
    return result ? result.total : 0;
  }

  async update(enrollment: Enrollment): Promise<Enrollment> {
    await this.db('enrollments')
      .where({ id: enrollment.id, deleted_at: null })
      .update({
        student_id: enrollment.student_id,
        plan_id: enrollment.plan_id,
        start_date: enrollment.start_date,
        end_date: enrollment.end_date,
        price: enrollment.price,
      });
    return this.findById(enrollment.id, '') as Promise<Enrollment>;
  }

  async softDelete(id: string): Promise<void> {
    await this.db('enrollments')
      .where({ id })
      .update({ deleted_at: new Date() });
  }

  async findActiveByStudentId(
    student_id: string,
    startDate?: Date
  ): Promise<Enrollment | null> {
    if (startDate) {
      // Busca matrícula ativa que sobrepõe a data informada
      const enrollment = await this.db('enrollments')
        .where({ student_id, deleted_at: null })
        .andWhere('start_date', '<=', startDate)
        .andWhere('end_date', '>', startDate)
        .first();
      return enrollment ? this.map(enrollment) : null;
    }
    // Comportamento antigo: matrícula ativa no momento atual
    const now = new Date();
    const enrollment = await this.db('enrollments')
      .where({ student_id, deleted_at: null })
      .andWhere('end_date', '>=', now)
      .first();
    return enrollment ? this.map(enrollment) : null;
  }

  private map(enrollment: any): Enrollment {
    return {
      id: enrollment.id,
      student_id: enrollment.student_id,
      plan_id: enrollment.plan_id,
      start_date: new Date(enrollment.start_date),
      end_date: new Date(enrollment.end_date),
      price: Number(enrollment.price),
      created_at: new Date(enrollment.created_at),
      deleted_at: enrollment.deleted_at
        ? new Date(enrollment.deleted_at)
        : null,
    };
  }
}
