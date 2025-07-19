import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreateEnrollmentUseCase } from '../../domain/use-cases/CreateEnrollmentUseCase';
import { ListEnrollmentsUseCase } from '../../domain/use-cases/ListEnrollmentsUseCase';
import { GetEnrollmentByIdUseCase } from '../../domain/use-cases/GetEnrollmentByIdUseCase';
import { DeleteEnrollmentUseCase } from '../../domain/use-cases/DeleteEnrollmentUseCase';

export class EnrollmentsController {
  async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user_id = request.user.id;
      const { student_id, plan_id, start_date } = request.body;
      const useCase = container.resolve(CreateEnrollmentUseCase);
      const enrollment = await useCase.execute({
        student_id,
        plan_id,
        start_date,
        user_id,
      });
      return response.status(201).json({ enrollment });
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
      const user_id = request.user.id;
      const { page = 1, limit = 10 } = request.query;
      const useCase = container.resolve(ListEnrollmentsUseCase);
      const result = await useCase.execute(
        user_id,
        Number(page),
        Number(limit)
      );
      return response.json(result);
    } catch (err) {
      return next(err);
    }
  }

  async getById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = request.params;
      const user_id = request.user.id;
      const useCase = container.resolve(GetEnrollmentByIdUseCase);
      const enrollment = await useCase.execute(id, user_id);
      return response.json(enrollment);
    } catch (err) {
      return next(err);
    }
  }

  async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = request.params;
      const user_id = request.user.id;
      const useCase = container.resolve(DeleteEnrollmentUseCase);
      await useCase.execute(id, user_id);
      return response.status(200).json({
        message: 'Matrícula cancelada com sucesso',
        status: 200,
        icon: '✅',
      });
    } catch (err) {
      return next(err);
    }
  }
}
