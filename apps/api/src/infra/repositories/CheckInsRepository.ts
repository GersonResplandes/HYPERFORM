import { injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { ICheckInsRepository } from '../../domain/repositories/ICheckInsRepository';
import { CheckIn } from '../../domain/entities/CheckIn';
import { DatabaseConnection } from '../database/connection';

@injectable()
export class CheckInsRepository implements ICheckInsRepository {
  private db: any;

  constructor() {
    this.db = DatabaseConnection.getInstance().getConnection();
  }

  async create(checkIn: CheckIn): Promise<CheckIn> {
    const id = checkIn.id || uuidv4();
    const created_at = checkIn.created_at || new Date();
    await this.db('check_ins').insert({
      id,
      student_id: checkIn.student_id,
      created_at,
    });
    return { id, student_id: checkIn.student_id, created_at };
  }

  async findByStudentAndDate(
    student_id: string,
    date: Date
  ): Promise<CheckIn | null> {
    // Busca check-in entre o início e fim do dia UTC
    const start = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0
      )
    );
    const end = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );
    const checkIn = await this.db('check_ins')
      .where('student_id', student_id)
      .andWhere('created_at', '>=', start)
      .andWhere('created_at', '<=', end)
      .first();
    return checkIn
      ? {
          id: checkIn.id,
          student_id: checkIn.student_id,
          created_at: checkIn.created_at,
        }
      : null;
  }
}
