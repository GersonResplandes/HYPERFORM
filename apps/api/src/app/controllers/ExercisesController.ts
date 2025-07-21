import { Request, Response } from 'express';
import { ExercisesRepository } from '../../infra/repositories/ExercisesRepository';
import { CreateExerciseUseCase } from '../../domain/use-cases/exercises/CreateExerciseUseCase';
import { UpdateExerciseUseCase } from '../../domain/use-cases/exercises/UpdateExerciseUseCase';
import { DeleteExerciseUseCase } from '../../domain/use-cases/exercises/DeleteExerciseUseCase';
import { ListExercisesUseCase } from '../../domain/use-cases/exercises/ListExercisesUseCase';
import { GetExerciseByIdUseCase } from '../../domain/use-cases/exercises/GetExerciseByIdUseCase';

export class ExercisesController {
  private repo = new ExercisesRepository();

  async create(req: Request, res: Response) {
    try {
      const useCase = new CreateExerciseUseCase(this.repo);
      const exercise = await useCase.execute(req.body);
      return res.status(201).json(exercise);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const useCase = new UpdateExerciseUseCase(this.repo);
      const exercise = await useCase.execute({
        id: req.params.id,
        ...req.body,
      });
      return res.json(exercise);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const useCase = new DeleteExerciseUseCase(this.repo);
      await useCase.execute(req.params.id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const useCase = new ListExercisesUseCase(this.repo);
      const exercises = await useCase.execute();
      return res.json(exercises);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const useCase = new GetExerciseByIdUseCase(this.repo);
      const exercise = await useCase.execute(req.params.id);
      if (!exercise)
        return res.status(404).json({ error: 'Exercício não encontrado' });
      return res.json(exercise);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
