import { CreateStudentUseCase } from '../../src/domain/use-cases/CreateStudentUseCase';
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

describe('CreateStudentUseCase', () => {
  let studentsRepository: IStudentsRepository;
  let createStudentUseCase: CreateStudentUseCase;
  const user_id = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    studentsRepository = new FakeStudentsRepository();
    createStudentUseCase = new CreateStudentUseCase(studentsRepository);
  });

  it('deve criar um aluno com dados válidos', async () => {
    const student = await createStudentUseCase.execute({
      name: 'Aluno Teste',
      email: 'aluno@email.com',
      phone: '11999999999',
      birth_date: new Date('2000-01-01'),
      gender: 'MALE',
      user_id,
    });
    expect(student).toHaveProperty('id');
    expect(student.name).toBe('Aluno Teste');
    expect(student.email).toBe('aluno@email.com');
    expect(student.user_id).toBe(user_id);
  });

  it('não deve permitir e-mail duplicado para o mesmo usuário', async () => {
    await createStudentUseCase.execute({
      name: 'Aluno 1',
      email: 'aluno@email.com',
      phone: '11999999999',
      birth_date: new Date('2000-01-01'),
      gender: 'MALE',
      user_id,
    });
    await expect(
      createStudentUseCase.execute({
        name: 'Aluno 2',
        email: 'aluno@email.com',
        phone: '11999999999',
        birth_date: new Date('2000-01-01'),
        gender: 'MALE',
        user_id,
      })
    ).rejects.toThrow('E-mail de aluno já cadastrado para este usuário');
  });

  it('deve validar campos obrigatórios', async () => {
    await expect(
      createStudentUseCase.execute({
        name: 'Al',
        email: 'invalido',
        phone: '123',
        birth_date: 'data-invalida',
        gender: 'MALE',
        user_id,
      })
    ).rejects.toThrow();
  });
});
