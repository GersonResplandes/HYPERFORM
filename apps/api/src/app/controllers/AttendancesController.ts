import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreateAttendanceUseCase } from '../../domain/use-cases/CreateAttendanceUseCase';
import { ListAttendancesByStudentUseCase } from '../../domain/use-cases/ListAttendancesByStudentUseCase';
import { ListAttendancesByStudentAndDateUseCase } from '../../domain/use-cases/ListAttendancesByStudentAndDateUseCase';

export class AttendancesController {
  async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { student_id } = request.body;
      const user_id = request.user.id;
      const useCase = container.resolve(CreateAttendanceUseCase);
      const attendance = await useCase.execute({ student_id, user_id });
      return response.status(201).json(attendance);
    } catch (err) {
      return next(err);
    }
  }

  async list(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { student_id, date } = request.query;
      const useCase = container.resolve(ListAttendancesByStudentAndDateUseCase);
      const attendances = await useCase.execute({
        student_id: String(student_id),
        date: date ? new Date(String(date)) : undefined,
      });
      return response.json(attendances);
    } catch (err) {
      return next(err);
    }
  }

  async listByStudent(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = request.params;
      const { page = 1, limit = 10 } = request.query;
      const useCase = container.resolve(ListAttendancesByStudentUseCase);
      const attendances = await useCase.execute({
        student_id: id,
        page: Number(page),
        limit: Number(limit),
      });
      return response.json(attendances);
    } catch (err) {
      return next(err);
    }
  }
}
