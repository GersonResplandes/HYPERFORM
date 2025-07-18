import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreatePlanUseCase } from '../../domain/use-cases/CreatePlanUseCase';
import { ListPlansUseCase } from '../../domain/use-cases/ListPlansUseCase';
import { GetPlanByIdUseCase } from '../../domain/use-cases/GetPlanByIdUseCase';
import { UpdatePlanUseCase } from '../../domain/use-cases/UpdatePlanUseCase';
import { DeletePlanUseCase } from '../../domain/use-cases/DeletePlanUseCase';

export class PlansController {
  async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { name, duration, price } = request.body;
      const useCase = container.resolve(CreatePlanUseCase);
      const plan = await useCase.execute({ name, duration, price });
      return response.status(201).json(plan);
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
      const useCase = container.resolve(ListPlansUseCase);
      const plans = await useCase.execute();
      return response.json(plans);
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
      const useCase = container.resolve(GetPlanByIdUseCase);
      const plan = await useCase.execute(id);
      return response.json(plan);
    } catch (err) {
      return next(err);
    }
  }

  async update(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = request.params;
      const { name, duration, price } = request.body;
      const useCase = container.resolve(UpdatePlanUseCase);
      const plan = await useCase.execute({ id, name, duration, price });
      return response.json(plan);
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
      const useCase = container.resolve(DeletePlanUseCase);
      await useCase.execute(id);
      return response.status(204).send();
    } catch (err) {
      return next(err);
    }
  }
}
