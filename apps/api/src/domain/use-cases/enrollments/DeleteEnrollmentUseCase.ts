import { injectable, inject } from 'tsyringe';
import { IEnrollmentsRepository } from '../../repositories/IEnrollmentsRepository';
import { AppError } from '../../errors/AppError';

@injectable()
export class DeleteEnrollmentUseCase {
  constructor(
    @inject('EnrollmentsRepository')
    private enrollmentsRepository: IEnrollmentsRepository
  ) {}

  async execute(id: string, user_id: string): Promise<void> {
    const enrollment = await this.enrollmentsRepository.findById(id, user_id);
    if (!enrollment) {
      throw new AppError('Matrícula não encontrada', 404);
    }
    await this.enrollmentsRepository.softDelete(id);
  }
}
