import { DeleteStudentUseCase } from '../../src/domain/use-cases/DeleteStudentUseCase';
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
  async listWithFilters() {
    return { data: [], pagination: { page: 1, limit: 10, total: 0 } };
  }
}

describe('DeleteStudentUseCase', () => {
  let studentsRepository: IStudentsRepository;
  let deleteStudentUseCase: DeleteStudentUseCase;
  const user_id = 'user-uuid';

  beforeEach(() => {
    studentsRepository = new FakeStudentsRepository();
    deleteStudentUseCase = new DeleteStudentUseCase(studentsRepository);
  });

  it('deve realizar soft delete do aluno', async () => {
    await studentsRepository.create({
      id: '1',
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
    await deleteStudentUseCase.execute('1', user_id);
    const student = await studentsRepository.findById('1', user_id);
    expect(student).toBeNull();
  });

  it('deve lançar erro se id não existir', async () => {
    await expect(deleteStudentUseCase.execute('999', user_id)).rejects.toThrow(
      'Aluno não encontrado'
    );
  });
});
