import { IStudentsRepository } from '../repositories/IStudentsRepository';

export class DeleteStudentUseCase {
  constructor(private studentsRepository: IStudentsRepository) {}

  async execute(id: string, user_id: string): Promise<void> {
    const student = await this.studentsRepository.findById(id, user_id);
    if (!student) {
      throw new Error('Aluno não encontrado');
    }
    await this.studentsRepository.softDelete(id, user_id);
  }
}
