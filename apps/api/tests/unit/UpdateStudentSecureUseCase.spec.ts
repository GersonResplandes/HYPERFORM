import { UpdateStudentSecureUseCase } from '../../src/domain/use-cases/UpdateStudentSecureUseCase';
import { IStudentsRepository } from '../../src/domain/repositories/IStudentsRepository';
import { Student } from '../../src/domain/entities/Student';
import { AppError } from '../../src/domain/errors/AppError';

describe('UpdateStudentSecureUseCase', () => {
  let studentsRepository: jest.Mocked<IStudentsRepository>;
  let useCase: UpdateStudentSecureUseCase;
  const validUserId = '550e8400-e29b-41d4-a716-446655440000';
  const validStudentId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    studentsRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      listWithFilters: jest.fn(),
    } as any;
    useCase = new UpdateStudentSecureUseCase(studentsRepository);
  });

  it('deve atualizar nome e email do aluno com sucesso', async () => {
    const student: Student = {
      id: validStudentId,
      name: 'Antigo',
      email: 'antigo@email.com',
      phone: '',
      birth_date: new Date(),
      gender: 'MALE',
      user_id: validUserId,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      notes: '',
    };
    studentsRepository.findById.mockResolvedValue(student);
    studentsRepository.update.mockResolvedValue({
      ...student,
      name: 'Novo',
      email: 'novo@email.com',
    });
    const result = await useCase.execute({
      id: validStudentId,
      user_id: validUserId,
      name: 'Novo',
      email: 'novo@email.com',
    });
    expect(result.name).toBe('Novo');
    expect(result.email).toBe('novo@email.com');
  });

  it('deve retornar 404 se aluno não existir', async () => {
    studentsRepository.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({
        id: validStudentId,
        user_id: validUserId,
        name: 'Novo',
      })
    ).rejects.toThrow(AppError);
  });

  it('deve retornar erro para UUID inválido', async () => {
    await expect(
      useCase.execute({ id: 'invalido', user_id: validUserId, name: 'Novo' })
    ).rejects.toThrow(AppError);
  });

  it('deve validar campos obrigatórios', async () => {
    await expect(
      useCase.execute({ id: validStudentId, user_id: validUserId })
    ).rejects.toThrow(AppError);
  });
});
