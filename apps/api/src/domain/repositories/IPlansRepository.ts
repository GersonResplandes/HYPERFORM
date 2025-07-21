import { Plan } from '../use-cases/plans/Plan';

export interface IPlansRepository {
  create(plan: Plan): Promise<Plan>;
  findById(id: string, user_id: string): Promise<Plan | null>;
  findByName(name: string): Promise<Plan | null>;
  listByUser(user_id: string): Promise<Plan[]>;
  update(plan: Plan): Promise<Plan>;
  softDelete(id: string): Promise<void>;
}
