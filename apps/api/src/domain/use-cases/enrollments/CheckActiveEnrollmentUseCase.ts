import { injectable, inject } from 'tsyringe';
import { IEnrollmentsRepository } from '../enrollments/IEnrollmentsRepository';
import { IStudentsRepository } from '../students/IStudentsRepository';
import { z } from 'zod';
import { AppError } from '../../errors/AppError';

const checkActiveEnrollmentSchema = z.object({
  student_id: z.string().uuid(),
  user_id: z.string().uuid(),
});

interface CheckActiveEnrollmentDTO {
  student_id: string;
  user_id: string;
}

@injectable()
export class CheckActiveEnrollmentUseCase {
  constructor(
    @inject('EnrollmentsRepository')
    private enrollmentsRepository: IEnrollmentsRepository,
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository
  ) {}

  async execute(data: CheckActiveEnrollmentDTO): Promise<{ active: boolean }> {
    const parsed = checkActiveEnrollmentSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.issues.map((i) => i.message).join(', '),
        422
      );
    }
    // Verifica se o aluno pertence ao usuário
    const student = await this.studentsRepository.findById(
      data.student_id,
      data.user_id
    );
    if (!student) {
      throw new AppError('Aluno não encontrado', 404);
    }
    // Verifica matrícula ativa
    const active = await this.enrollmentsRepository.hasActiveEnrollment(
      data.student_id,
      data.user_id
    );
    return { active };
  }
}
