import { Student } from '../../domain/entities/Student';
import {
  IStudentsRepository,
  ListStudentsFilters,
  ListStudentsResult,
} from '../../domain/repositories/IStudentsRepository';
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
    const data = await this.knex('students')
      .where({ user_id: userId })
      .whereNull('deleted_at');
    return data as Student[];
  }

  async listByUserPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<Student[]> {
    const data = await this.knex('students')
      .where({ user_id: userId })
      .whereNull('deleted_at')
      .limit(limit)
      .offset((page - 1) * limit);
    return data as Student[];
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

  async listWithFilters(
    filters: ListStudentsFilters
  ): Promise<ListStudentsResult> {
    const {
      userId,
      page = 1,
      limit = 10,
      name,
      email,
      orderBy = 'created_at',
      orderDir = 'asc',
    } = filters;

    const allowedOrderFields = ['name', 'email', 'created_at'];
    const orderField = allowedOrderFields.includes(orderBy)
      ? orderBy
      : 'created_at';
    const orderDirection = orderDir === 'desc' ? 'desc' : 'asc';

    const query = this.knex('students')
      .where({ user_id: userId })
      .whereNull('deleted_at');

    if (name) {
      query.andWhereRaw('LOWER(name) LIKE ?', [`%${name.toLowerCase()}%`]);
    }
    if (email) {
      query.andWhere('email', 'like', `%${email}%`);
    }

    const totalQuery = query.clone();
    const totalResult =
      await totalQuery.count<{ count: string }[]>('id as count');
    const total = Number(totalResult[0]?.count || 0);

    const data = await query
      .clone()
      .orderBy(orderField, orderDirection)
      .limit(limit)
      .offset((page - 1) * limit)
      .select(['id', 'name', 'email', 'created_at']);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }
}
