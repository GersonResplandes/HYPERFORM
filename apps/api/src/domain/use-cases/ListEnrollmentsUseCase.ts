import { injectable, inject } from 'tsyringe';
import { IEnrollmentsRepository } from '../repositories/IEnrollmentsRepository';
import { Enrollment } from '../entities/Enrollment';

interface ListEnrollmentsResult {
  enrollments: Enrollment[];
  total: number;
  page: number;
  limit: number;
}

@injectable()
export class ListEnrollmentsUseCase {
  constructor(
    @inject('EnrollmentsRepository')
    private enrollmentsRepository: IEnrollmentsRepository
  ) {}

  async execute(page = 1, limit = 10): Promise<ListEnrollmentsResult> {
    const enrollments = await this.enrollmentsRepository.list(page, limit);
    const total = await this.enrollmentsRepository.count();
    return { enrollments, total, page, limit };
  }
}
