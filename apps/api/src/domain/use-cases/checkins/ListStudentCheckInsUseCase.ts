import { injectable, inject } from 'tsyringe';
import { ICheckInsRepository } from '../../repositories/ICheckInsRepository';
import { IStudentsRepository } from '../../repositories/IStudentsRepository';
import { z } from 'zod';
import { AppError } from '../../errors/AppError';

const listCheckInsSchema = z.object({
  student_id: z.string().uuid(),
  user_id: z.string().uuid(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  date: z.string().optional(), // YYYY-MM-DD
});

interface ListStudentCheckInsDTO {
  student_id: string;
  user_id: string;
  page?: number;
  limit?: number;
  date?: string;
}

@injectable()
export class ListStudentCheckInsUseCase {
  constructor(
    @inject('CheckInsRepository')
    private checkInsRepository: ICheckInsRepository,
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository
  ) {}

  async execute(data: ListStudentCheckInsDTO) {
    const parsed = listCheckInsSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.issues.map((i) => i.message).join(', '),
        422
      );
    }
    const { student_id, user_id, page, limit, date } = parsed.data;
    // Verifica se o aluno pertence ao usuário
    const student = await this.studentsRepository.findById(student_id, user_id);
    if (!student) {
      throw new AppError('Aluno não encontrado', 404);
    }
    // Busca check-ins paginados e filtrados
    const result = await this.checkInsRepository.listByStudent({
      student_id,
      page,
      limit,
      date,
    });
    return result;
  }
}
