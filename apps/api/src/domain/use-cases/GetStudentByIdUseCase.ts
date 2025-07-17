import { IStudentsRepository } from '../repositories/IStudentsRepository';
import { Student } from '../entities/Student';

export class GetStudentByIdUseCase {
  constructor(private studentsRepository: IStudentsRepository) {}

  async execute(id: string, user_id: string): Promise<Student> {
    const student = await this.studentsRepository.findById(id, user_id);
    if (!student) {
      throw new Error('Aluno não encontrado');
    }
    return student;
  }
}
