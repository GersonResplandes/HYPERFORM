import { inject, injectable } from 'tsyringe';
import { IAttendancesRepository } from '../repositories/IAttendancesRepository';
import { Attendance } from '../entities/Attendance';

interface IListAttendancesByStudentAndDateDTO {
  student_id: string;
  date?: Date;
}

@injectable()
export class ListAttendancesByStudentAndDateUseCase {
  constructor(
    @inject('AttendancesRepository')
    private attendancesRepository: IAttendancesRepository
  ) {}

  async execute({
    student_id,
    date,
  }: IListAttendancesByStudentAndDateDTO): Promise<Attendance[]> {
    if (date) {
      return this.attendancesRepository.listByStudentAndDate(student_id, date);
    }
    // Se não passar data, retorna todos (sem paginação)
    return this.attendancesRepository.listByStudent(student_id, 1, 1000);
  }
}
