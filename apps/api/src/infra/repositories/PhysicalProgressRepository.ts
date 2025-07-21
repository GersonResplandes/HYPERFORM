import { PhysicalProgress } from '../../domain/entities/PhysicalProgress';
import { IPhysicalProgressRepository } from '../../domain/repositories/IPhysicalProgressRepository';
import { DatabaseConnection } from '../database/connection';

export class PhysicalProgressRepository implements IPhysicalProgressRepository {
  private get knex() {
    return DatabaseConnection.getInstance().getConnection();
  }

  async create(data: PhysicalProgress): Promise<PhysicalProgress> {
    await this.knex('physical_progress').insert(data);
    return data;
  }

  async findById(id: string): Promise<PhysicalProgress | null> {
    const record = await this.knex('physical_progress')
      .where({ id })
      .whereNull('deleted_at')
      .first();
    return record ? (record as PhysicalProgress) : null;
  }

  async findByStudentId(aluno_id: string): Promise<PhysicalProgress[]> {
    return this.knex('physical_progress')
      .where({ aluno_id })
      .whereNull('deleted_at')
      .orderBy('data', 'desc');
  }

  async update(data: PhysicalProgress): Promise<PhysicalProgress> {
    await this.knex('physical_progress')
      .where({ id: data.id })
      .update({
        ...data,
        updated_at: new Date(),
      });
    return data;
  }

  async softDelete(id: string): Promise<void> {
    await this.knex('physical_progress')
      .where({ id })
      .update({ deleted_at: new Date() });
  }
}
