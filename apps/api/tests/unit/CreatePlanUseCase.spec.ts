import { CreatePlanUseCase } from '../../src/domain/use-cases/CreatePlanUseCase';
import { IPlansRepository } from '../../src/domain/repositories/IPlansRepository';
import { Plan } from '../../src/domain/entities/Plan';
import { AppError } from '../../src/domain/errors/AppError';

describe('CreatePlanUseCase', () => {
  let plansRepository: IPlansRepository;
  let createPlanUseCase: CreatePlanUseCase;

  class FakePlansRepository implements IPlansRepository {
    private plans: Plan[] = [];
    async create(plan: Plan): Promise<Plan> {
      const p = {
        ...plan,
        id: 'uuid',
        created_at: new Date(),
        deleted_at: null,
      };
      this.plans.push(p);
      return p;
    }
    async findById(id: string): Promise<Plan | null> {
      return this.plans.find((p) => p.id === id && !p.deleted_at) || null;
    }
    async findByName(name: string): Promise<Plan | null> {
      return this.plans.find((p) => p.name === name && !p.deleted_at) || null;
    }
    async list(): Promise<Plan[]> {
      return this.plans.filter((p) => !p.deleted_at);
    }
    async update(plan: Plan): Promise<Plan> {
      const idx = this.plans.findIndex((p) => p.id === plan.id);
      if (idx >= 0) this.plans[idx] = plan;
      return plan;
    }
    async softDelete(id: string): Promise<void> {
      const plan = this.plans.find((p) => p.id === id);
      if (plan) plan.deleted_at = new Date();
    }
  }

  beforeEach(() => {
    plansRepository = new FakePlansRepository();
    createPlanUseCase = new CreatePlanUseCase(plansRepository);
  });

  it('deve criar um plano com dados válidos', async () => {
    const plan = await createPlanUseCase.execute({
      name: 'Mensal',
      duration: 30,
      price: 99.9,
    });
    expect(plan).toHaveProperty('id');
    expect(plan.name).toBe('Mensal');
    expect(plan.duration).toBe(30);
    expect(plan.price).toBe(99.9);
  });

  it('não deve permitir nome duplicado', async () => {
    await createPlanUseCase.execute({
      name: 'Mensal',
      duration: 30,
      price: 99.9,
    });
    await expect(
      createPlanUseCase.execute({ name: 'Mensal', duration: 60, price: 199.9 })
    ).rejects.toThrow('Já existe um plano com esse nome');
  });

  it('deve validar campos obrigatórios', async () => {
    await expect(
      createPlanUseCase.execute({ name: 'Me', duration: 0, price: -10 })
    ).rejects.toThrow();
  });
});
