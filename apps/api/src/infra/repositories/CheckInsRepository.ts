import { injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import {
  ICheckInsRepository,
  ListCheckInsParams,
  ListCheckInsResult,
} from '../../domain/use-cases/checkins/ICheckInsRepository';
import { CheckIn } from '../../domain/use-cases/checkins/CheckIn';
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

  async listByStudent(params: ListCheckInsParams): Promise<ListCheckInsResult> {
    const { student_id, page, limit, date } = params;
    let query = this.db('check_ins').where('student_id', student_id);
    let countQuery = this.db('check_ins').where('student_id', student_id);
    if (date) {
      // Filtro por data UTC
      const [year, month, day] = date.split('-').map(Number);
      const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
      const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
      query = query
        .andWhere('created_at', '>=', start)
        .andWhere('created_at', '<=', end);
      countQuery = countQuery
        .andWhere('created_at', '>=', start)
        .andWhere('created_at', '<=', end);
    }
    const totalResult = await countQuery.count('id as count');
    const total = Number(totalResult[0]?.count || 0);
    const checkIns = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset((page - 1) * limit);
    return {
      checkIns: checkIns.map((c: any) => ({
        checkInId: c.id,
        createdAt: c.created_at.toISOString(),
        studentId: c.student_id,
      })),
      total,
      page,
      limit,
    };
  }
}
