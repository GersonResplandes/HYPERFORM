import { ListStudentsUseCase } from '../../src/domain/use-cases/ListStudentsUseCase';
import { IStudentsRepository } from '../../src/domain/repositories/IStudentsRepository';
import { Student } from '../../src/domain/entities/Student';

class FakeStudentsRepository implements IStudentsRepository {
  private students: Student[] = [];
  async create(student: Student): Promise<Student> {
    this.students.push(student);
    return student;
  }
  async findById(id: string, userId: string): Promise<Student | null> {
    return (
      this.students.find(
        (s) => s.id === id && s.user_id === userId && !s.deleted_at
      ) || null
    );
  }
  async findByEmail(email: string, userId: string): Promise<Student | null> {
    return (
      this.students.find(
        (s) => s.email === email && s.user_id === userId && !s.deleted_at
      ) || null
    );
  }
  async listByUser(userId: string): Promise<Student[]> {
    return this.students.filter((s) => s.user_id === userId && !s.deleted_at);
  }
  async listByUserPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<Student[]> {
    const students = this.students.filter(
      (s) => s.user_id === userId && !s.deleted_at
    );
    const start = (page - 1) * limit;
    return students.slice(start, start + limit);
  }
  async countByUser(userId: string): Promise<number> {
    return this.students.filter((s) => s.user_id === userId && !s.deleted_at)
      .length;
  }
  async update(student: Student): Promise<Student> {
    const idx = this.students.findIndex(
      (s) => s.id === student.id && s.user_id === student.user_id
    );
    if (idx >= 0) this.students[idx] = student;
    return student;
  }
  async softDelete(id: string, userId: string): Promise<void> {
    const student = this.students.find(
      (s) => s.id === id && s.user_id === userId
    );
    if (student) student.deleted_at = new Date();
  }
}

describe('ListStudentsUseCase', () => {
  let studentsRepository: IStudentsRepository;
  let listStudentsUseCase: ListStudentsUseCase;
  const user_id = '550e8400-e29b-41d4-a716-446655440000';
  const other_user_id = '11111111-1111-1111-1111-111111111111';

  beforeEach(() => {
    studentsRepository = new FakeStudentsRepository();
    listStudentsUseCase = new ListStudentsUseCase(studentsRepository);
  });

  it('deve listar apenas alunos do usuário autenticado', async () => {
    await studentsRepository.create({
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Aluno 1',
      email: 'a1@email.com',
      phone: '11999999999',
      birth_date: new Date(),
      gender: 'MALE',
      created_at: new Date(),
      updated_at: new Date(),
      user_id,
      deleted_at: null,
    });
    await studentsRepository.create({
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Aluno 2',
      email: 'a2@email.com',
      phone: '11999999999',
      birth_date: new Date(),
      gender: 'FEMALE',
      created_at: new Date(),
      updated_at: new Date(),
      user_id: other_user_id,
      deleted_at: null,
    });
    const result = await listStudentsUseCase.execute(user_id);
    expect(result.students).toHaveLength(1);
    expect(result.students[0].name).toBe('Aluno 1');
  });

  it('não deve listar alunos deletados', async () => {
    await studentsRepository.create({
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Aluno 1',
      email: 'a1@email.com',
      phone: '11999999999',
      birth_date: new Date(),
      gender: 'MALE',
      created_at: new Date(),
      updated_at: new Date(),
      user_id,
      deleted_at: null,
    });
    await studentsRepository.create({
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Aluno 2',
      email: 'a2@email.com',
      phone: '11999999999',
      birth_date: new Date(),
      gender: 'FEMALE',
      created_at: new Date(),
      updated_at: new Date(),
      user_id,
      deleted_at: new Date(),
    });
    const result = await listStudentsUseCase.execute(user_id);
    expect(result.students).toHaveLength(1);
    expect(result.students[0].name).toBe('Aluno 1');
  });

  it('deve paginar corretamente os alunos', async () => {
    for (let i = 1; i <= 25; i++) {
      await studentsRepository.create({
        id: `${i}`.padStart(24, '0'),
        name: `Aluno ${i}`,
        email: `a${i}@email.com`,
        phone: '11999999999',
        birth_date: new Date(),
        gender: 'MALE',
        created_at: new Date(),
        updated_at: new Date(),
        user_id,
        deleted_at: null,
      });
    }
    const result = await listStudentsUseCase.execute(user_id, 2, 10);
    expect(result.students).toHaveLength(10);
    expect(result.currentPage).toBe(2);
    expect(result.totalCount).toBe(25);
    expect(result.totalPages).toBe(3);
  });

  it('deve filtrar alunos por nome (case-insensitive, contains)', async () => {
    await studentsRepository.create({
      id: '1',
      name: 'Maria Souza',
      email: 'maria@email.com',
      phone: '11999999999',
      birth_date: new Date(),
      gender: 'FEMALE',
      created_at: new Date(),
      updated_at: new Date(),
      user_id,
      deleted_at: null,
    });
    await studentsRepository.create({
      id: '2',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999',
      birth_date: new Date(),
      gender: 'MALE',
      created_at: new Date(),
      updated_at: new Date(),
      user_id,
      deleted_at: null,
    });
    const result = await listStudentsUseCase.execute(user_id, 1, 10, 'maria');
    expect(result.students).toHaveLength(1);
    expect(result.students[0].name).toBe('Maria Souza');
  });

  it('deve limitar o número máximo de alunos por página a 50', async () => {
    for (let i = 1; i <= 60; i++) {
      await studentsRepository.create({
        id: `${i}`.padStart(24, '0'),
        name: `Aluno ${i}`,
        email: `a${i}@email.com`,
        phone: '11999999999',
        birth_date: new Date(),
        gender: 'MALE',
        created_at: new Date(),
        updated_at: new Date(),
        user_id,
        deleted_at: null,
      });
    }
    const result = await listStudentsUseCase.execute(user_id, 1, 100);
    expect(result.students).toHaveLength(50);
    expect(result.totalCount).toBe(60);
    expect(result.totalPages).toBe(2);
  });
});
