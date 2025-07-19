import { CreateEnrollmentUseCase } from '../../src/domain/use-cases/CreateEnrollmentUseCase';
import { IEnrollmentsRepository } from '../../src/domain/repositories/IEnrollmentsRepository';
import { IStudentsRepository } from '../../src/domain/repositories/IStudentsRepository';
import { IPlansRepository } from '../../src/domain/repositories/IPlansRepository';
import { Enrollment } from '../../src/domain/entities/Enrollment';
import { Student } from '../../src/domain/entities/Student';
import { Plan } from '../../src/domain/entities/Plan';
import { AppError } from '../../src/domain/errors/AppError';

describe('CreateEnrollmentUseCase', () => {
  class FakeEnrollmentsRepository implements IEnrollmentsRepository {
    private enrollments: Enrollment[] = [];

    async create(enrollment: Enrollment): Promise<Enrollment> {
      const e = {
        ...enrollment,
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        created_at: new Date(),
        deleted_at: null,
      };
      this.enrollments.push(e);
      return e;
    }

    async findById(id: string, user_id: string): Promise<Enrollment | null> {
      return this.enrollments.find((e) => e.id === id && !e.deleted_at) || null;
    }

    async listByUser(
      user_id: string,
      page: number,
      limit: number
    ): Promise<Enrollment[]> {
      const offset = (page - 1) * limit;
      return this.enrollments
        .filter((e) => !e.deleted_at)
        .slice(offset, offset + limit);
    }

    async countByUser(user_id: string): Promise<number> {
      return this.enrollments.filter((e) => !e.deleted_at).length;
    }

    async update(enrollment: Enrollment): Promise<Enrollment> {
      const idx = this.enrollments.findIndex((e) => e.id === enrollment.id);
      if (idx >= 0) this.enrollments[idx] = enrollment;
      return enrollment;
    }

    async softDelete(id: string): Promise<void> {
      const e = this.enrollments.find((e) => e.id === id);
      if (e) e.deleted_at = new Date();
    }

    async findActiveByStudentId(
      student_id: string,
      newStartDate?: Date
    ): Promise<Enrollment | null> {
      // Se newStartDate for passado, verifica sobreposição de datas
      if (newStartDate) {
        return (
          this.enrollments.find(
            (e) =>
              e.student_id === student_id &&
              !e.deleted_at &&
              newStartDate >= e.start_date &&
              newStartDate < e.end_date
          ) || null
        );
      }
      // Comportamento antigo para compatibilidade
      const now = new Date();
      return (
        this.enrollments.find(
          (e) =>
            e.student_id === student_id && !e.deleted_at && e.end_date >= now
        ) || null
      );
    }

    async hasActiveEnrollment(
      student_id: string,
      user_id: string
    ): Promise<boolean> {
      const now = new Date();
      return this.enrollments.some(
        (e) =>
          e.student_id === student_id &&
          !e.deleted_at &&
          e.start_date <= now &&
          e.end_date >= now
      );
    }
  }

  class FakeStudentsRepository implements IStudentsRepository {
    private students: Student[] = [];

    async create(student: Student): Promise<Student> {
      const s = {
        ...student,
        id: 'a3e1b2c4-5d6f-4a7b-8c9d-0e1f2a3b4c5d',
        created_at: new Date(),
        updated_at: new Date(),
      };
      this.students.push(s);
      return s;
    }

    async findById(id: string, userId: string): Promise<Student | null> {
      return (
        this.students.find((s) => s.id === id && s.user_id === userId) || null
      );
    }

    async findByEmail(email: string, userId: string): Promise<Student | null> {
      return (
        this.students.find((s) => s.email === email && s.user_id === userId) ||
        null
      );
    }

    async listByUser(userId: string): Promise<Student[]> {
      return this.students.filter((s) => s.user_id === userId);
    }

    async listByUserPaginated(
      userId: string,
      page: number,
      limit: number
    ): Promise<Student[]> {
      const offset = (page - 1) * limit;
      return this.students
        .filter((s) => s.user_id === userId)
        .slice(offset, offset + limit);
    }

    async countByUser(userId: string): Promise<number> {
      return this.students.filter((s) => s.user_id === userId).length;
    }

    async update(student: Student): Promise<Student> {
      const idx = this.students.findIndex((s) => s.id === student.id);
      if (idx >= 0) this.students[idx] = student;
      return student;
    }

    async softDelete(id: string, userId: string): Promise<void> {
      const s = this.students.find((s) => s.id === id && s.user_id === userId);
      if (s) s.updated_at = new Date();
    }
  }

  class FakePlansRepository implements IPlansRepository {
    private plans: Plan[] = [];

    async create(plan: Plan): Promise<Plan> {
      const p = {
        ...plan,
        id: 'b4e2c3d5-6e7f-5b8c-9d0e-1f2a3b4c5d6e',
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

  let createEnrollmentUseCase: CreateEnrollmentUseCase;
  let enrollmentsRepository: FakeEnrollmentsRepository;
  let studentsRepository: FakeStudentsRepository;
  let plansRepository: FakePlansRepository;

  beforeEach(() => {
    enrollmentsRepository = new FakeEnrollmentsRepository();
    studentsRepository = new FakeStudentsRepository();
    plansRepository = new FakePlansRepository();
    createEnrollmentUseCase = new CreateEnrollmentUseCase(
      enrollmentsRepository,
      studentsRepository,
      plansRepository
    );
  });

  it('deve criar uma matrícula com sucesso', async () => {
    // Criar aluno e plano primeiro
    const student = await studentsRepository.create({
      id: '',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999',
      birth_date: new Date('1990-01-01'),
      gender: 'MALE',
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const plan = await plansRepository.create({
      id: '',
      title: 'Mensal',
      description: 'Plano mensal',
      duration: 30,
      price: 99.9,
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const enrollment = await createEnrollmentUseCase.execute({
      student_id: student.id,
      plan_id: plan.id,
      start_date: '2024-08-01T00:00:00.000Z',
      user_id: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(enrollment.student_id).toBe(student.id);
    expect(enrollment.plan_id).toBe(plan.id);
    expect(enrollment.price).toBe(99.9);
  });

  it('deve rejeitar matrícula com aluno inexistente', async () => {
    const plan = await plansRepository.create({
      id: '',
      title: 'Mensal',
      description: 'Plano mensal',
      duration: 30,
      price: 99.9,
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await expect(
      createEnrollmentUseCase.execute({
        student_id: 'a3e1b2c4-5d6f-4a7b-8c9d-0e1f2a3b4c5d',
        plan_id: plan.id,
        start_date: '2024-08-01T00:00:00.000Z',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('deve rejeitar matrícula duplicada ativa', async () => {
    const student = await studentsRepository.create({
      id: '',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999',
      birth_date: new Date('1990-01-01'),
      gender: 'MALE',
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const plan = await plansRepository.create({
      id: '',
      title: 'Mensal',
      description: 'Plano mensal',
      duration: 30,
      price: 99.9,
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Criar primeira matrícula diretamente no repositório (simulando matrícula já existente)
    await enrollmentsRepository.create({
      id: '',
      student_id: student.id,
      plan_id: plan.id,
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-02-01'), // Matrícula ativa até fevereiro
      price: 99.9,
      created_at: new Date(),
      deleted_at: null,
    });

    // Tentar criar segunda matrícula via use case (deve falhar)
    await expect(
      createEnrollmentUseCase.execute({
        student_id: student.id,
        plan_id: plan.id,
        start_date: '2024-01-15T00:00:00.000Z',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('deve rejeitar dados inválidos', async () => {
    await expect(
      createEnrollmentUseCase.execute({
        student_id: '',
        plan_id: '',
        start_date: '',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
