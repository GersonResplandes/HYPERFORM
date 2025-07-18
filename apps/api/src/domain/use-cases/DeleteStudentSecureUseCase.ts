import { inject, injectable } from 'tsyringe';
import { IStudentsRepository } from '../repositories/IStudentsRepository';
import { AppError } from '../errors/AppError';
import { z } from 'zod';

const deleteStudentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
});

interface DeleteStudentDTO {
  id: string;
  user_id: string;
}

@injectable()
export class DeleteStudentSecureUseCase {
  constructor(
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository
  ) {}

  async execute(data: DeleteStudentDTO): Promise<void> {
    const parsed = deleteStudentSchema.safeParse(data);
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
    await this.studentsRepository.softDelete(data.id, data.user_id);
  }
}
