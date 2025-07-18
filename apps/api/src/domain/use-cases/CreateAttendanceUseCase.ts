import { inject, injectable } from 'tsyringe';
import { IAttendancesRepository } from '../repositories/IAttendancesRepository';
import { IStudentsRepository } from '../repositories/IStudentsRepository';
import { Attendance } from '../entities/Attendance';
import { AppError } from '../errors/AppError';
import { z } from 'zod';

const createAttendanceSchema = z.object({
  student_id: z.string().uuid(),
  user_id: z.string().uuid(),
});

interface CreateAttendanceDTO {
  student_id: string;
  user_id: string;
}

@injectable()
export class CreateAttendanceUseCase {
  constructor(
    @inject('AttendancesRepository')
    private attendancesRepository: IAttendancesRepository,
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository
  ) {}

  async execute(data: CreateAttendanceDTO): Promise<Attendance> {
    const parsed = createAttendanceSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.issues.map((i) => i.message).join(', '),
        400
      );
    }
    // Verifica se aluno existe
    const student = await this.studentsRepository.findById(
      data.student_id,
      data.user_id
    );
    if (!student) {
      throw new AppError('Aluno não encontrado', 404);
    }
    // Mock: verifica matrícula ativa (sempre true por enquanto)
    const hasActiveEnrollment = true;
    if (!hasActiveEnrollment) {
      throw new AppError('Aluno sem matrícula ativa', 400);
    }
    // Impede duplicidade de check-in no mesmo dia
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await this.attendancesRepository.findByStudentAndDate(
      data.student_id,
      today
    );
    if (existing) {
      throw new AppError('Check-in já realizado hoje', 409);
    }
    const attendance: Attendance = {
      id: '',
      student_id: data.student_id,
      check_in_date: today,
      created_at: new Date(),
    };
    return this.attendancesRepository.create(attendance);
  }
}
