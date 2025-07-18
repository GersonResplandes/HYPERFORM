import { CreateEnrollmentUseCase } from '../../src/domain/use-cases/CreateEnrollmentUseCase';
import { IEnrollmentsRepository } from '../../src/domain/repositories/IEnrollmentsRepository';
import { IStudentsRepository } from '../../src/domain/repositories/IStudentsRepository';
import { IPlansRepository } from '../../src/domain/repositories/IPlansRepository';
import { Enrollment } from '../../src/domain/entities/Enrollment';
import { Student } from '../../src/domain/entities/Student';
import { Plan } from '../../src/domain/entities/Plan';
import { AppError } from '../../src/domain/errors/AppError';

describe('CreateEnrollmentUseCase', () => {
  let enrollmentsRepository: IEnrollmentsRepository;
  let studentsRepository: IStudentsRepository;
  let plansRepository: IPlansRepository;
  let createEnrollmentUseCase: CreateEnrollmentUseCase;

  class FakeEnrollmentsRepository implements IEnrollmentsRepository {
    private enrollments: Enrollment[] = [];
    async create(enrollment: Enrollment): Promise<Enrollment> {
      const e = {
        ...enrollment,
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // UUID v4 válido
        created_at: new Date(),
        deleted_at: null,
      };
      this.enrollments.push(e);
      return e;
    }
    async findById(id: string): Promise<Enrollment | null> {
      return this.enrollments.find((e) => e.id === id && !e.deleted_at) || null;
    }
    async list(): Promise<Enrollment[]> {
      return this.enrollments.filter((e) => !e.deleted_at);
    }
    async count(): Promise<number> {
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
      student_id: string
    ): Promise<Enrollment | null> {
      const now = new Date();
      return (
        this.enrollments.find(
          (e) =>
            e.student_id === student_id &&
            !e.deleted_at &&
            e.start_date <= now &&
            e.end_date >= now
        ) || null
      );
    }
  }

  class FakeStudentsRepository implements IStudentsRepository {
    public students: Student[] = [
      {
        id: 'a3e1b2c4-5d6f-4a7b-8c9d-0e1f2a3b4c5d', // UUID v4 válido
        name: 'Aluno',
        email: 'a@email.com',
        phone: '11999999999',
        birth_date: new Date('2000-01-01'),
        gender: 'MALE',
        user_id: '550e8400-e29b-41d4-a716-446655440000', // UUID v4 válido
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ];
    async create(student: Student): Promise<Student> {
      this.students.push(student);
      return student;
    }
    async findById(id: string, userId?: string): Promise<Student | null> {
      return this.students.find((s) => s.id === id && !s.deleted_at) || null;
    }
    async findByEmail(): Promise<Student | null> {
      return null;
    }
    async listByUser(): Promise<Student[]> {
      return this.students;
    }
    async listByUserPaginated(): Promise<Student[]> {
      return this.students;
    }
    async countByUser(): Promise<number> {
      return this.students.length;
    }
    async update(student: Student): Promise<Student> {
      return student;
    }
    async softDelete(): Promise<void> {}
    async listWithFilters() {
      return { data: [], pagination: { page: 1, limit: 10, total: 0 } };
    }
  }

  class FakePlansRepository implements IPlansRepository {
    public plans: Plan[] = [
      {
        id: 'b4c5d6e7-8f9a-4b1c-2d3e-4f5a6b7c8d9e', // UUID v4 válido
        name: 'Mensal',
        duration: 30,
        price: 99.9,
        created_at: new Date(),
        deleted_at: null,
      },
    ];
    async create(plan: Plan): Promise<Plan> {
      this.plans.push(plan);
      return plan;
    }
    async findById(id: string, userId?: string): Promise<Plan | null> {
      return this.plans.find((p) => p.id === id && !p.deleted_at) || null;
    }
    async findByName(): Promise<Plan | null> {
      return null;
    }
    async list(): Promise<Plan[]> {
      return this.plans;
    }
    async update(plan: Plan): Promise<Plan> {
      return plan;
    }
    async softDelete(): Promise<void> {}
  }

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

  it('deve criar uma matrícula válida', async () => {
    const validUserId = '550e8400-e29b-41d4-a716-446655440000';
    const enrollment = await createEnrollmentUseCase.execute({
      student_id: 'a3e1b2c4-5d6f-4a7b-8c9d-0e1f2a3b4c5d',
      plan_id: 'b4c5d6e7-8f9a-4b1c-2d3e-4f5a6b7c8d9e',
      start_date: '2024-08-01T00:00:00.000Z',
      user_id: validUserId,
    });
    expect(enrollment).toHaveProperty('id');
    expect(enrollment.student_id).toBe('a3e1b2c4-5d6f-4a7b-8c9d-0e1f2a3b4c5d');
    expect(enrollment.plan_id).toBe('b4c5d6e7-8f9a-4b1c-2d3e-4f5a6b7c8d9e');
    expect(enrollment.price).toBe(99.9);
    expect(enrollment.end_date > enrollment.start_date).toBe(true);
  });

  it('não deve permitir matrícula duplicada ativa', async () => {
    const validUserId = '550e8400-e29b-41d4-a716-446655440000';
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    await createEnrollmentUseCase.execute({
      student_id: 'a3e1b2c4-5d6f-4a7b-8c9d-0e1f2a3b4c5d',
      plan_id: 'b4c5d6e7-8f9a-4b1c-2d3e-4f5a6b7c8d9e',
      start_date: today.toISOString(),
      user_id: validUserId,
    });
    await expect(
      createEnrollmentUseCase.execute({
        student_id: 'a3e1b2c4-5d6f-4a7b-8c9d-0e1f2a3b4c5d',
        plan_id: 'b4c5d6e7-8f9a-4b1c-2d3e-4f5a6b7c8d9e',
        start_date: tomorrow.toISOString(),
        user_id: validUserId,
      })
    ).rejects.toThrow('Aluno já possui matrícula ativa');
  });

  it('deve validar aluno existente', async () => {
    const validUserId = '550e8400-e29b-41d4-a716-446655440000';
    const fakeStudents = new FakeStudentsRepository();
    fakeStudents.students = [];
    const useCase = new CreateEnrollmentUseCase(
      enrollmentsRepository,
      fakeStudents,
      plansRepository
    );
    await expect(
      useCase.execute({
        student_id: 'c5d6e7f8-9a0b-4c1d-2e3f-4a5b6c7d8e9f', // UUID v4 válido
        plan_id: 'b4c5d6e7-8f9a-4b1c-2d3e-4f5a6b7c8d9e',
        start_date: '2025-07-17T21:16:35.058Z',
        user_id: validUserId,
      })
    ).rejects.toThrow('Aluno não encontrado');
  });

  it('deve validar plano existente', async () => {
    const validUserId = '550e8400-e29b-41d4-a716-446655440000';
    const fakePlans = new FakePlansRepository();
    fakePlans.plans = [];
    const useCase = new CreateEnrollmentUseCase(
      enrollmentsRepository,
      studentsRepository,
      fakePlans
    );
    await expect(
      useCase.execute({
        student_id: 'a3e1b2c4-5d6f-4a7b-8c9d-0e1f2a3b4c5d',
        plan_id: 'c5d6e7f8-9a0b-4c1d-2e3f-4a5b6c7d8e9f', // UUID v4 válido
        start_date: '2025-07-17T21:16:35.058Z',
        user_id: validUserId,
      })
    ).rejects.toThrow('Plano não encontrado');
  });

  it('deve validar campos obrigatórios', async () => {
    const validUserId = '550e8400-e29b-41d4-a716-446655440000';
    await expect(
      createEnrollmentUseCase.execute({
        student_id: '',
        plan_id: '',
        start_date: '',
        user_id: validUserId,
      })
    ).rejects.toThrow();
  });
});
