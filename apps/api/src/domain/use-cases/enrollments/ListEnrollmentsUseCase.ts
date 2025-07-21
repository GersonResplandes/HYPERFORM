import { injectable, inject } from 'tsyringe';
import { IEnrollmentsRepository } from '../../repositories/IEnrollmentsRepository';
import { Enrollment } from './Enrollment';

interface ListEnrollmentsResult {
  enrollments: Enrollment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@injectable()
export class ListEnrollmentsUseCase {
  constructor(
    @inject('EnrollmentsRepository')
    private enrollmentsRepository: IEnrollmentsRepository
  ) {}

  async execute(
    user_id: string,
    page = 1,
    limit = 10
  ): Promise<ListEnrollmentsResult> {
    const enrollments = await this.enrollmentsRepository.listByUser(
      user_id,
      page,
      limit
    );
    const total = await this.enrollmentsRepository.countByUser(user_id);
    const totalPages = Math.ceil(total / limit);

    return {
      enrollments,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
