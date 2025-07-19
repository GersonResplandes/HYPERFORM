import { UpdateStudentUseCase } from '../../src/domain/use-cases/UpdateStudentUseCase';
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

describe('UpdateStudentUseCase', () => {
  let studentsRepository: IStudentsRepository;
  let updateStudentUseCase: UpdateStudentUseCase;
  const user_id = '550e8400-e29b-41d4-a716-446655440000';
  const id1 = '123e4567-e89b-12d3-a456-426614174000';
  const id2 = 'c56a4180-65aa-42ec-a945-5fd21dec0538';
  const idInexistente = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  beforeEach(() => {
    studentsRepository = new FakeStudentsRepository();
    updateStudentUseCase = new UpdateStudentUseCase(studentsRepository);
  });

  it('deve atualizar dados do aluno', async () => {
    await studentsRepository.create({
      id: id1,
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
    const student = await updateStudentUseCase.execute({
      id: id1,
      name: 'Novo Nome',
      email: 'novo@email.com',
      phone: '11999999999',
      birth_date: new Date(),
      gender: 'FEMALE',
      user_id,
    });
    expect(student.name).toBe('Novo Nome');
    expect(student.email).toBe('novo@email.com');
  });

  it('deve lançar erro se id não existir', async () => {
    await expect(
      updateStudentUseCase.execute({
        id: idInexistente,
        name: 'Aluno X',
        email: 'x@email.com',
        phone: '11999999999',
        birth_date: new Date(),
        gender: 'MALE',
        user_id,
      })
    ).rejects.toThrow('Aluno não encontrado');
  });

  it('não deve permitir e-mail duplicado para o mesmo usuário', async () => {
    await studentsRepository.create({
      id: id1,
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
      id: id2,
      name: 'Aluno 2',
      email: 'a2@email.com',
      phone: '11999999999',
      birth_date: new Date(),
      gender: 'FEMALE',
      created_at: new Date(),
      updated_at: new Date(),
      user_id,
      deleted_at: null,
    });
    await expect(
      updateStudentUseCase.execute({
        id: id2,
        name: 'Aluno 2',
        email: 'a1@email.com',
        phone: '11999999999',
        birth_date: new Date(),
        gender: 'FEMALE',
        user_id,
      })
    ).rejects.toThrow('E-mail de aluno já cadastrado para este usuário');
  });

  it('deve validar campos obrigatórios', async () => {
    await studentsRepository.create({
      id: id1,
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
    await expect(
      updateStudentUseCase.execute({
        id: id1,
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
