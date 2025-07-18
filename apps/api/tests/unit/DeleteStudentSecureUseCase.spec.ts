import { DeleteStudentSecureUseCase } from '../../src/domain/use-cases/DeleteStudentSecureUseCase';
import { IStudentsRepository } from '../../src/domain/repositories/IStudentsRepository';
import { AppError } from '../../src/domain/errors/AppError';

describe('DeleteStudentSecureUseCase', () => {
  let studentsRepository: jest.Mocked<IStudentsRepository>;
  let useCase: DeleteStudentSecureUseCase;
  const validUserId = '550e8400-e29b-41d4-a716-446655440000';
  const validStudentId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    studentsRepository = {
      findById: jest.fn(),
      softDelete: jest.fn(),
      listWithFilters: jest.fn(),
    } as any;
    useCase = new DeleteStudentSecureUseCase(studentsRepository);
  });

  it('deve deletar aluno com sucesso', async () => {
    studentsRepository.findById.mockResolvedValue({
      id: validStudentId,
      user_id: validUserId,
    } as any);
    await expect(
      useCase.execute({ id: validStudentId, user_id: validUserId })
    ).resolves.toBeUndefined();
    expect(studentsRepository.softDelete).toHaveBeenCalledWith(
      validStudentId,
      validUserId
    );
  });

  it('deve retornar 404 se aluno não existir', async () => {
    studentsRepository.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({ id: validStudentId, user_id: validUserId })
    ).rejects.toThrow(AppError);
  });

  it('deve retornar erro para UUID inválido', async () => {
    await expect(
      useCase.execute({ id: 'invalido', user_id: validUserId })
    ).rejects.toThrow(AppError);
  });
});
