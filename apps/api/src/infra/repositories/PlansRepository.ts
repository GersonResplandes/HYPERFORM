import { injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { IPlansRepository } from '../../domain/repositories/IPlansRepository';
import { Plan } from '../../domain/entities/Plan';
import { DatabaseConnection } from '../database/connection';

@injectable()
export class PlansRepository implements IPlansRepository {
  private db: any;

  constructor() {
    this.db = DatabaseConnection.getInstance().getConnection();
  }

  async create(plan: Plan): Promise<Plan> {
    const id = plan.id || uuidv4();
    const now = new Date();
    await this.db('plans').insert({
      id,
      name: plan.name,
      duration: plan.duration,
      price: plan.price,
      created_at: now,
      deleted_at: null,
    });
    return this.findById(id) as Promise<Plan>;
  }

  async findById(id: string): Promise<Plan | null> {
    const plan = await this.db('plans').where({ id, deleted_at: null }).first();
    return plan ? this.map(plan) : null;
  }

  async findByName(name: string): Promise<Plan | null> {
    const plan = await this.db('plans')
      .where({ name, deleted_at: null })
      .first();
    return plan ? this.map(plan) : null;
  }

  async list(): Promise<Plan[]> {
    const plans = await this.db('plans').where({ deleted_at: null });
    return plans.map(this.map);
  }

  async update(plan: Plan): Promise<Plan> {
    await this.db('plans').where({ id: plan.id, deleted_at: null }).update({
      name: plan.name,
      duration: plan.duration,
      price: plan.price,
    });
    return this.findById(plan.id) as Promise<Plan>;
  }

  async softDelete(id: string): Promise<void> {
    await this.db('plans')
      .where({ id, deleted_at: null })
      .update({ deleted_at: new Date() });
  }

  private map(plan: any): Plan {
    return {
      id: plan.id,
      name: plan.name,
      duration: plan.duration,
      price: Number(plan.price),
      created_at: new Date(plan.created_at),
      deleted_at: plan.deleted_at ? new Date(plan.deleted_at) : null,
    };
  }
}
