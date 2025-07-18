import { injectable, inject } from 'tsyringe';
import { IEnrollmentsRepository } from '../repositories/IEnrollmentsRepository';
import { Enrollment } from '../entities/Enrollment';
import { IStudentsRepository } from '../repositories/IStudentsRepository';
import { IPlansRepository } from '../repositories/IPlansRepository';
import { z } from 'zod';
import { AppError } from '../errors/AppError';

const createEnrollmentSchema = z.object({
  student_id: z.string().uuid(),
  plan_id: z.string().uuid(),
  start_date: z.coerce.date(),
  user_id: z.string().uuid(),
});

interface CreateEnrollmentDTO {
  student_id: string;
  plan_id: string;
  start_date: Date | string;
  user_id: string;
}

@injectable()
export class CreateEnrollmentUseCase {
  constructor(
    @inject('EnrollmentsRepository')
    private enrollmentsRepository: IEnrollmentsRepository,
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository,
    @inject('PlansRepository')
    private plansRepository: IPlansRepository
  ) {}

  async execute(data: CreateEnrollmentDTO): Promise<Enrollment> {
    console.log('CreateEnrollmentUseCase.execute data:', data);
    const parsed = createEnrollmentSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.issues.map((i) => i.message).join(', '),
        422
      );
    }

    // Verifica se aluno existe e pertence ao usuário
    const student = await this.studentsRepository.findById(
      data.student_id,
      data.user_id
    );
    if (!student) {
      throw new AppError('Aluno não encontrado', 404);
    }

    // Verifica se plano existe e pertence ao usuário
    const plan = await this.plansRepository.findById(
      data.plan_id,
      data.user_id
    );
    if (!plan) {
      throw new AppError('Plano não encontrado', 404);
    }

    // Previne matrícula duplicada ativa
    const startDate = new Date(data.start_date);
    const active = await this.enrollmentsRepository.findActiveByStudentId(
      data.student_id,
      startDate
    );
    if (active) {
      throw new AppError('Aluno já possui matrícula ativa', 400);
    }

    // Calcula end_date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    // Preço fixado no momento
    const price = plan.price;

    const enrollment: Enrollment = {
      id: '',
      student_id: data.student_id,
      plan_id: data.plan_id,
      start_date: startDate,
      end_date: endDate,
      price,
      created_at: new Date(),
      deleted_at: null,
    };

    return this.enrollmentsRepository.create(enrollment);
  }
}
