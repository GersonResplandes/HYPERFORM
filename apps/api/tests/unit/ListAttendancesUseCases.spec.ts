import { ListAttendancesByStudentUseCase } from '../../src/domain/use-cases/ListAttendancesByStudentUseCase';
import { ListAttendancesByStudentAndDateUseCase } from '../../src/domain/use-cases/ListAttendancesByStudentAndDateUseCase';
import { IAttendancesRepository } from '../../src/domain/repositories/IAttendancesRepository';

describe('ListAttendancesByStudentUseCase', () => {
  let attendancesRepository: jest.Mocked<IAttendancesRepository>;
  let useCase: ListAttendancesByStudentUseCase;

  beforeEach(() => {
    attendancesRepository = {
      listByStudent: jest.fn(),
    } as any;
    useCase = new ListAttendancesByStudentUseCase(attendancesRepository);
  });

  it('deve listar presenças de um aluno com paginação', async () => {
    attendancesRepository.listByStudent.mockResolvedValue([
      {
        id: '1',
        student_id: 's1',
        check_in_date: new Date(),
        created_at: new Date(),
      },
    ]);
    const result = await useCase.execute({
      student_id: 's1',
      page: 1,
      limit: 10,
    });
    expect(result).toHaveLength(1);
    expect(attendancesRepository.listByStudent).toHaveBeenCalledWith(
      's1',
      1,
      10
    );
  });
});

describe('ListAttendancesByStudentAndDateUseCase', () => {
  let attendancesRepository: jest.Mocked<IAttendancesRepository>;
  let useCase: ListAttendancesByStudentAndDateUseCase;

  beforeEach(() => {
    attendancesRepository = {
      listByStudentAndDate: jest.fn(),
      listByStudent: jest.fn(),
    } as any;
    useCase = new ListAttendancesByStudentAndDateUseCase(attendancesRepository);
  });

  it('deve listar presenças de um aluno por data', async () => {
    const date = new Date();
    attendancesRepository.listByStudentAndDate.mockResolvedValue([
      {
        id: '1',
        student_id: 's1',
        check_in_date: date,
        created_at: new Date(),
      },
    ]);
    const result = await useCase.execute({ student_id: 's1', date });
    expect(result).toHaveLength(1);
    expect(attendancesRepository.listByStudentAndDate).toHaveBeenCalledWith(
      's1',
      date
    );
  });

  it('deve listar todas as presenças se não passar data', async () => {
    attendancesRepository.listByStudent.mockResolvedValue([
      {
        id: '1',
        student_id: 's1',
        check_in_date: new Date(),
        created_at: new Date(),
      },
    ]);
    const result = await useCase.execute({ student_id: 's1' });
    expect(result).toHaveLength(1);
    expect(attendancesRepository.listByStudent).toHaveBeenCalledWith(
      's1',
      1,
      1000
    );
  });
});
