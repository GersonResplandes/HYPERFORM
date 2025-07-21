import { injectable, inject } from 'tsyringe';
import { IStudentsRepository } from './IStudentsRepository';
import { AppError } from '../../errors/AppError';

@injectable()
export class DeleteStudentUseCase {
  constructor(
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository
  ) {}

  async execute(id: string, user_id: string): Promise<void> {
    const student = await this.studentsRepository.findById(id, user_id);
    if (!student) {
      throw new AppError('Acesso negado ou aluno não encontrado', 403);
    }
    await this.studentsRepository.update({
      ...student,
      deleted_at: new Date(),
    });
  }
}
