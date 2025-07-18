import { inject, injectable } from 'tsyringe';
import { IAttendancesRepository } from '../repositories/IAttendancesRepository';
import { Attendance } from '../entities/Attendance';

interface IListAttendancesByStudentDTO {
  student_id: string;
  page?: number;
  limit?: number;
}

@injectable()
export class ListAttendancesByStudentUseCase {
  constructor(
    @inject('AttendancesRepository')
    private attendancesRepository: IAttendancesRepository
  ) {}

  async execute({
    student_id,
    page = 1,
    limit = 10,
  }: IListAttendancesByStudentDTO): Promise<Attendance[]> {
    return this.attendancesRepository.listByStudent(student_id, page, limit);
  }
}
