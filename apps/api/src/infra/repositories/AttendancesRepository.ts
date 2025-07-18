import { injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { IAttendancesRepository } from '../../domain/repositories/IAttendancesRepository';
import { Attendance } from '../../domain/entities/Attendance';
import { DatabaseConnection } from '../database/connection';

@injectable()
export class AttendancesRepository implements IAttendancesRepository {
  private db: any;

  constructor() {
    this.db = DatabaseConnection.getInstance().getConnection();
  }

  async create(attendance: Attendance): Promise<Attendance> {
    const id = attendance.id || uuidv4();
    const now = new Date();
    await this.db('attendances').insert({
      id,
      student_id: attendance.student_id,
      check_in_date: attendance.check_in_date,
      created_at: now,
    });
    return this.findById(id) as Promise<Attendance>;
  }

  async findById(id: string): Promise<Attendance | null> {
    const attendance = await this.db('attendances').where({ id }).first();
    return attendance ? this.map(attendance) : null;
  }

  async findByStudentAndDate(
    student_id: string,
    check_in_date: Date
  ): Promise<Attendance | null> {
    const dateStr = check_in_date.toISOString().slice(0, 10);
    const attendance = await this.db('attendances')
      .where({ student_id })
      .andWhere('check_in_date', dateStr)
      .first();
    return attendance ? this.map(attendance) : null;
  }

  async listByStudent(
    student_id: string,
    page: number,
    limit: number
  ): Promise<Attendance[]> {
    const offset = (page - 1) * limit;
    const attendances = await this.db('attendances')
      .where({ student_id })
      .orderBy('check_in_date', 'desc')
      .limit(limit)
      .offset(offset);
    return attendances.map(this.map);
  }

  async listByStudentAndDate(
    student_id: string,
    date: Date
  ): Promise<Attendance[]> {
    const dateStr = date.toISOString().slice(0, 10);
    const attendances = await this.db('attendances')
      .where({ student_id })
      .andWhere('check_in_date', dateStr)
      .orderBy('check_in_date', 'desc');
    return attendances.map(this.map);
  }

  private map(attendance: any): Attendance {
    return {
      id: attendance.id,
      student_id: attendance.student_id,
      check_in_date: new Date(attendance.check_in_date),
      created_at: new Date(attendance.created_at),
    };
  }
}
