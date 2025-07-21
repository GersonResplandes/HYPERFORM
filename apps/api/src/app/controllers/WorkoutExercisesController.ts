import { Request, Response } from 'express';
import { WorkoutExercisesRepository } from '../../infra/repositories/WorkoutExercisesRepository';
import { AddExerciseToWorkoutUseCase } from '../../domain/use-cases/workouts/AddExerciseToWorkoutUseCase';
import { RemoveExerciseFromWorkoutUseCase } from '../../domain/use-cases/workouts/RemoveExerciseFromWorkoutUseCase';
import { ListWorkoutExercisesUseCase } from '../../domain/use-cases/workouts/ListWorkoutExercisesUseCase';

export class WorkoutExercisesController {
  private repo = new WorkoutExercisesRepository();

  async add(req: Request, res: Response) {
    try {
      const useCase = new AddExerciseToWorkoutUseCase(this.repo);
      const result = await useCase.execute({
        ...req.body,
        workout_id: req.params.workoutId,
      });
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const useCase = new RemoveExerciseFromWorkoutUseCase(this.repo);
      await useCase.execute(req.params.id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const useCase = new ListWorkoutExercisesUseCase(this.repo);
      const result = await useCase.execute(req.params.workoutId);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
