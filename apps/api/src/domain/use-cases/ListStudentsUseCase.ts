import { IStudentsRepository } from '../repositories/IStudentsRepository';
import { Student } from '../entities/Student';

interface IListStudentsResult {
  students: Student[];
  total: number;
  page: number;
  limit: number;
}

export class ListStudentsUseCase {
  constructor(private studentsRepository: IStudentsRepository) {}

  async execute(
    user_id: string,
    page = 1,
    limit = 10
  ): Promise<IListStudentsResult> {
    const students = await this.studentsRepository.listByUserPaginated(
      user_id,
      page,
      limit
    );
    const total = await this.studentsRepository.countByUser(user_id);
    return { students, total, page, limit };
  }
}
