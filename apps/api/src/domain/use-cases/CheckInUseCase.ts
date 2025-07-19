import { injectable, inject } from 'tsyringe';
import { ICheckInsRepository } from '../repositories/ICheckInsRepository';
import { IStudentsRepository } from '../repositories/IStudentsRepository';
import { IEnrollmentsRepository } from '../repositories/IEnrollmentsRepository';
import { z } from 'zod';
import { AppError } from '../errors/AppError';

const checkInSchema = z.object({
  student_id: z.string().uuid(),
  user_id: z.string().uuid(),
});

interface CheckInDTO {
  student_id: string;
  user_id: string;
}

@injectable()
export class CheckInUseCase {
  constructor(
    @inject('CheckInsRepository')
    private checkInsRepository: ICheckInsRepository,
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository,
    @inject('EnrollmentsRepository')
    private enrollmentsRepository: IEnrollmentsRepository
  ) {}

  async execute(data: CheckInDTO): Promise<void> {
    const parsed = checkInSchema.safeParse(data);
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
    const hasActive = await this.enrollmentsRepository.hasActiveEnrollment(
      data.student_id,
      data.user_id
    );
    if (!hasActive) {
      throw new AppError('Aluno não possui matrícula ativa', 403);
    }
    // Impede duplo check-in no mesmo dia UTC
    const today = new Date();
    const alreadyChecked = await this.checkInsRepository.findByStudentAndDate(
      data.student_id,
      today
    );
    if (alreadyChecked) {
      throw new AppError('Check-in já realizado hoje', 409);
    }
    // Registra o check-in
    await this.checkInsRepository.create({
      id: '',
      student_id: data.student_id,
      created_at: today,
    });
  }
}
