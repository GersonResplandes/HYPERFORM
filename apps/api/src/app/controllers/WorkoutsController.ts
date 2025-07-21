import { Request, Response } from 'express';
import { WorkoutsRepository } from '../../infra/repositories/WorkoutsRepository';
import { CreateWorkoutUseCase } from '../../domain/use-cases/workouts/CreateWorkoutUseCase';
import { UpdateWorkoutUseCase } from '../../domain/use-cases/workouts/UpdateWorkoutUseCase';
import { DeleteWorkoutUseCase } from '../../domain/use-cases/workouts/DeleteWorkoutUseCase';
import { ListWorkoutsUseCase } from '../../domain/use-cases/workouts/ListWorkoutsUseCase';
import { GetWorkoutByIdUseCase } from '../../domain/use-cases/workouts/GetWorkoutByIdUseCase';

export class WorkoutsController {
  private repo = new WorkoutsRepository();

  async create(req: Request, res: Response) {
    try {
      const useCase = new CreateWorkoutUseCase(this.repo);
      const workout = await useCase.execute(req.body);
      return res.status(201).json(workout);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const useCase = new UpdateWorkoutUseCase(this.repo);
      const workout = await useCase.execute({ id: req.params.id, ...req.body });
      return res.json(workout);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const useCase = new DeleteWorkoutUseCase(this.repo);
      await useCase.execute(req.params.id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const useCase = new ListWorkoutsUseCase(this.repo);
      const workouts = await useCase.execute();
      return res.json(workouts);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const useCase = new GetWorkoutByIdUseCase(this.repo);
      const workout = await useCase.execute(req.params.id);
      if (!workout)
        return res.status(404).json({ error: 'Treino não encontrado' });
      return res.json(workout);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
