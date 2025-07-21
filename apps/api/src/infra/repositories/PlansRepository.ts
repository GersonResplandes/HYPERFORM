import { injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { IPlansRepository } from '../../domain/repositories/IPlansRepository';
import { Plan } from '../../domain/use-cases/plans/Plan';
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
      title: plan.title,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      user_id: plan.user_id,
      created_at: now,
      updated_at: now,
    });
    return this.findById(id, plan.user_id) as Promise<Plan>;
  }

  async findById(id: string, userId: string): Promise<Plan | null> {
    const plan = await this.db('plans')
      .where({ id, user_id: userId })
      .whereNull('deleted_at')
      .first();
    return plan ? this.map(plan) : null;
  }

  async findByName(name: string): Promise<Plan | null> {
    const plan = await this.db('plans')
      .where({ title: name })
      .whereNull('deleted_at')
      .first();
    return plan ? this.map(plan) : null;
  }

  async listByUser(userId: string): Promise<Plan[]> {
    const plans = await this.db('plans')
      .where({ user_id: userId })
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');
    return plans.map(this.map);
  }

  async update(plan: Plan): Promise<Plan> {
    await this.db('plans')
      .where({ id: plan.id, user_id: plan.user_id })
      .whereNull('deleted_at')
      .update({
        title: plan.title,
        description: plan.description,
        price: plan.price,
        duration: plan.duration,
        updated_at: new Date(),
      });
    return this.findById(plan.id, plan.user_id) as Promise<Plan>;
  }

  async softDelete(id: string): Promise<void> {
    await this.db('plans').where({ id }).update({ deleted_at: new Date() });
  }

  private map(plan: any): Plan {
    return {
      id: plan.id,
      title: plan.title,
      description: plan.description,
      price: Number(plan.price),
      duration: plan.duration,
      user_id: plan.user_id,
      created_at: new Date(plan.created_at),
      updated_at: new Date(plan.updated_at),
    };
  }
}
