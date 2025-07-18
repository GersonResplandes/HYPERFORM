import { CreateAttendanceUseCase } from '../../src/domain/use-cases/CreateAttendanceUseCase';
import { IAttendancesRepository } from '../../src/domain/repositories/IAttendancesRepository';
import { IStudentsRepository } from '../../src/domain/repositories/IStudentsRepository';
import { Attendance } from '../../src/domain/entities/Attendance';
import { AppError } from '../../src/domain/errors/AppError';

describe('CreateAttendanceUseCase', () => {
  let attendancesRepository: jest.Mocked<IAttendancesRepository>;
  let studentsRepository: jest.Mocked<IStudentsRepository>;
  let useCase: CreateAttendanceUseCase;

  const validStudentId = '123e4567-e89b-12d3-a456-426614174000';
  const validUserId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    attendancesRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByStudentAndDate: jest.fn(),
      listByStudent: jest.fn(),
      listByStudentAndDate: jest.fn(),
    } as any;
    studentsRepository = {
      findById: jest.fn(),
    } as any;
    useCase = new CreateAttendanceUseCase(
      attendancesRepository,
      studentsRepository
    );
  });

  it('deve permitir check-in válido', async () => {
    studentsRepository.findById.mockResolvedValue({
      id: validStudentId,
    } as any);
    attendancesRepository.findByStudentAndDate.mockResolvedValue(null);
    attendancesRepository.create.mockImplementation(async (attendance) => ({
      ...attendance,
      id: 'uuid-attendance',
    }));

    const result = await useCase.execute({
      student_id: validStudentId,
      user_id: validUserId,
    });
    expect(result).toHaveProperty('id', 'uuid-attendance');
    expect(attendancesRepository.create).toHaveBeenCalled();
  });

  it('não deve permitir check-in duplicado no mesmo dia', async () => {
    studentsRepository.findById.mockResolvedValue({
      id: validStudentId,
    } as any);
    attendancesRepository.findByStudentAndDate.mockResolvedValue({
      id: 'uuid-attendance',
    } as Attendance);

    await expect(
      useCase.execute({ student_id: validStudentId, user_id: validUserId })
    ).rejects.toThrow(AppError);
    expect(attendancesRepository.create).not.toHaveBeenCalled();
  });

  it('não deve permitir check-in com student_id inexistente', async () => {
    studentsRepository.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({
        student_id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: validUserId,
      })
    ).rejects.toThrow(AppError);
    expect(attendancesRepository.create).not.toHaveBeenCalled();
  });
});
