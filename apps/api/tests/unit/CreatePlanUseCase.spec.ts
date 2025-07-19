import { CreatePlanUseCase } from '../../src/domain/use-cases/CreatePlanUseCase';
import { IPlansRepository } from '../../src/domain/repositories/IPlansRepository';
import { Plan } from '../../src/domain/entities/Plan';
import { AppError } from '../../src/domain/errors/AppError';

describe('CreatePlanUseCase', () => {
  class FakePlansRepository implements IPlansRepository {
    private plans: Plan[] = [];

    async create(plan: Plan): Promise<Plan> {
      const p = {
        ...plan,
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        created_at: new Date(),
        updated_at: new Date(),
      };
      this.plans.push(p);
      return p;
    }

    async findById(id: string, user_id: string): Promise<Plan | null> {
      return (
        this.plans.find((p) => p.id === id && p.user_id === user_id) || null
      );
    }

    async findByName(name: string): Promise<Plan | null> {
      return this.plans.find((p) => p.title === name) || null;
    }

    async listByUser(user_id: string): Promise<Plan[]> {
      return this.plans.filter((p) => p.user_id === user_id);
    }

    async update(plan: Plan): Promise<Plan> {
      const idx = this.plans.findIndex((p) => p.id === plan.id);
      if (idx >= 0) this.plans[idx] = plan;
      return plan;
    }

    async softDelete(id: string): Promise<void> {
      const plan = this.plans.find((p) => p.id === id);
      if (plan) plan.updated_at = new Date();
    }
  }

  let createPlanUseCase: CreatePlanUseCase;
  let plansRepository: FakePlansRepository;

  beforeEach(() => {
    plansRepository = new FakePlansRepository();
    createPlanUseCase = new CreatePlanUseCase(plansRepository);
  });

  it('deve criar um plano com sucesso', async () => {
    const plan = await createPlanUseCase.execute({
      title: 'Mensal',
      description: 'Plano mensal com acesso completo',
      duration: 30,
      price: 99.9,
      user_id: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(plan.title).toBe('Mensal');
    expect(plan.description).toBe('Plano mensal com acesso completo');
    expect(plan.duration).toBe(30);
    expect(plan.price).toBe(99.9);
  });

  it('deve rejeitar plano com título duplicado', async () => {
    await createPlanUseCase.execute({
      title: 'Mensal',
      description: 'Plano mensal',
      duration: 30,
      price: 99.9,
      user_id: '550e8400-e29b-41d4-a716-446655440000',
    });

    await expect(
      createPlanUseCase.execute({
        title: 'Mensal',
        description: 'Outro plano',
        duration: 60,
        price: 199.9,
        user_id: '550e8400-e29b-41d4-a716-446655440000',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('deve rejeitar dados inválidos', async () => {
    await expect(
      createPlanUseCase.execute({
        title: 'Me',
        description: 'Descrição muito curta',
        duration: 0,
        price: -10,
        user_id: '550e8400-e29b-41d4-a716-446655440000',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
