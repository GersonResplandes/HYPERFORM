import { IStudentsRepository } from './IStudentsRepository';

interface IListStudentsResult {
  students: Array<{
    id: string;
    name: string;
    email: string;
    birthDate: Date;
    createdAt: Date;
  }>;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export class ListStudentsUseCase {
  constructor(private studentsRepository: IStudentsRepository) {}

  async execute(
    user_id: string,
    page = 1,
    limit = 10,
    name?: string
  ): Promise<IListStudentsResult> {
    const realLimit = Math.min(limit, 50);
    const students = await this.studentsRepository.listByUserPaginated(
      user_id,
      page,
      realLimit,
      name
    );
    const totalCount = await this.studentsRepository.countByUser(user_id, name);
    const totalPages = Math.ceil(totalCount / realLimit);
    return {
      students: students.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        birthDate: s.birth_date,
        createdAt: s.created_at,
      })),
      totalCount,
      totalPages,
      currentPage: page,
    };
  }
}
