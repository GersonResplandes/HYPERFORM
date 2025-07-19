import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateEnrollmentUseCase } from '../../domain/use-cases/CreateEnrollmentUseCase';
import { ListEnrollmentsUseCase } from '../../domain/use-cases/ListEnrollmentsUseCase';
import { GetEnrollmentByIdUseCase } from '../../domain/use-cases/GetEnrollmentByIdUseCase';
import { DeleteEnrollmentUseCase } from '../../domain/use-cases/DeleteEnrollmentUseCase';

export class EnrollmentsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { student_id, plan_id, start_date } = request.body;
    const useCase = container.resolve(CreateEnrollmentUseCase);
    const enrollment = await useCase.execute({
      student_id,
      plan_id,
      start_date,
    });
    return response.status(201).json(enrollment);
  }

  async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10 } = request.query;
    const useCase = container.resolve(ListEnrollmentsUseCase);
    const result = await useCase.execute(Number(page), Number(limit));
    return response.json(result);
  }

  async getById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const useCase = container.resolve(GetEnrollmentByIdUseCase);
    const enrollment = await useCase.execute(id);
    return response.json(enrollment);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const useCase = container.resolve(DeleteEnrollmentUseCase);
    await useCase.execute(id);
    return response.status(204).send();
  }
}
