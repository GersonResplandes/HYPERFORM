import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreatePlanUseCase } from '../../domain/use-cases/plans/CreatePlanUseCase';
import { ListPlansUseCase } from '../../domain/use-cases/plans/ListPlansUseCase';
import { UpdatePlanUseCase } from '../../domain/use-cases/plans/UpdatePlanUseCase';
import { DeletePlanUseCase } from '../../domain/use-cases/plans/DeletePlanUseCase';
import { GetPlanByIdUseCase } from '../../domain/use-cases/plans/GetPlanByIdUseCase';

export class PlansController {
  async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user_id = request.user.id;
      const { title, description, price, duration } = request.body;
      const useCase = container.resolve(CreatePlanUseCase);
      const plan = await useCase.execute({
        title,
        description,
        price,
        duration,
        user_id,
      });
      return response.status(201).json({ plan });
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
      const useCase = container.resolve(ListPlansUseCase);
      const plans = await useCase.execute(user_id);
      return response.json({ plans });
    } catch (err) {
      return next(err);
    }
  }

  async show(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = request.params;
      const user_id = request.user.id;
      const useCase = container.resolve(GetPlanByIdUseCase);
      const plan = await useCase.execute(id, user_id);
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
      const user_id = request.user.id;
      const { title, description, price, duration } = request.body;
      const useCase = container.resolve(UpdatePlanUseCase);
      const plan = await useCase.execute({
        id,
        user_id,
        title,
        description,
        price,
        duration,
      });
      return response.status(200).json(plan);
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
      const useCase = container.resolve(DeletePlanUseCase);
      await useCase.execute({ id, user_id });
      return response.status(200).json({
        message: 'Plano deletado com sucesso',
        status: 200,
        icon: '✅',
      });
    } catch (err) {
      return next(err);
    }
  }
}
