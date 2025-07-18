import { ListStudentsWithFiltersUseCase } from '../../src/domain/use-cases/ListStudentsWithFiltersUseCase';
import {
  IStudentsRepository,
  ListStudentsFilters,
  ListStudentsResult,
} from '../../src/domain/repositories/IStudentsRepository';

describe('ListStudentsWithFiltersUseCase', () => {
  let studentsRepository: jest.Mocked<IStudentsRepository>;
  let useCase: ListStudentsWithFiltersUseCase;

  beforeEach(() => {
    studentsRepository = {
      listWithFilters: jest.fn(),
    } as any;
    useCase = new ListStudentsWithFiltersUseCase(studentsRepository);
  });

  it('deve listar alunos com paginação padrão', async () => {
    const validUserId = '550e8400-e29b-41d4-a716-446655440000';
    const filters: ListStudentsFilters = { userId: validUserId };
    const result: ListStudentsResult = {
      data: [
        {
          id: '1',
          name: 'João',
          email: 'joao@email.com',
          created_at: new Date(),
        },
      ],
      pagination: { page: 1, limit: 10, total: 1 },
    };
    studentsRepository.listWithFilters.mockResolvedValue(result);
    const response = await useCase.execute(filters);
    expect(response.data).toHaveLength(1);
    expect(response.pagination.page).toBe(1);
    expect(response.pagination.limit).toBe(10);
  });

  it('deve filtrar por nome parcial', async () => {
    const validUserId = '550e8400-e29b-41d4-a716-446655440000';
    const filters: ListStudentsFilters = { userId: validUserId, name: 'jo' };
    studentsRepository.listWithFilters.mockResolvedValue({
      data: [
        {
          id: '1',
          name: 'João',
          email: 'joao@email.com',
          created_at: new Date(),
        },
      ],
      pagination: { page: 1, limit: 10, total: 1 },
    });
    const response = await useCase.execute(filters);
    expect(response.data[0].name).toMatch(/jo/i);
  });

  it('deve filtrar por email', async () => {
    const validUserId = '550e8400-e29b-41d4-a716-446655440000';
    const filters: ListStudentsFilters = { userId: validUserId, email: 'joao' };
    studentsRepository.listWithFilters.mockResolvedValue({
      data: [
        {
          id: '1',
          name: 'João',
          email: 'joao@email.com',
          created_at: new Date(),
        },
      ],
      pagination: { page: 1, limit: 10, total: 1 },
    });
    const response = await useCase.execute(filters);
    expect(response.data[0].email).toContain('joao');
  });

  it('deve ordenar por nome desc', async () => {
    const validUserId = '550e8400-e29b-41d4-a716-446655440000';
    const filters: ListStudentsFilters = {
      userId: validUserId,
      orderBy: 'name',
      orderDir: 'desc',
    };
    studentsRepository.listWithFilters.mockResolvedValue({
      data: [
        {
          id: '2',
          name: 'Zeca',
          email: 'zeca@email.com',
          created_at: new Date(),
        },
        {
          id: '1',
          name: 'Ana',
          email: 'ana@email.com',
          created_at: new Date(),
        },
      ],
      pagination: { page: 1, limit: 10, total: 2 },
    });
    const response = await useCase.execute(filters);
    expect(response.data[0].name).toBe('Zeca');
  });

  it('deve validar parâmetros inválidos', async () => {
    await expect(
      useCase.execute({
        userId: 'invalido',
        page: 0,
        limit: 0,
        orderBy: 'foo' as any,
      })
    ).rejects.toThrow();
  });
});
