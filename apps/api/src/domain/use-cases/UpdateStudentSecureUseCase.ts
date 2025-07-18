import { inject, injectable } from 'tsyringe';
import { IStudentsRepository } from '../repositories/IStudentsRepository';
import { Student } from '../entities/Student';
import { AppError } from '../errors/AppError';
import { z } from 'zod';

const updateStudentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
});

interface UpdateStudentDTO {
  id: string;
  user_id: string;
  name?: string;
  email?: string;
}

@injectable()
export class UpdateStudentSecureUseCase {
  constructor(
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository
  ) {}

  async execute(data: UpdateStudentDTO): Promise<Student> {
    const parsed = updateStudentSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.issues.map((i) => i.message).join(', '),
        400
      );
    }
    const student = await this.studentsRepository.findById(
      data.id,
      data.user_id
    );
    if (!student) {
      throw new AppError('Aluno não encontrado', 404);
    }
    // Atualiza apenas os campos permitidos
    if (data.name) student.name = data.name;
    if (data.email) student.email = data.email;
    return this.studentsRepository.update(student);
  }
}
