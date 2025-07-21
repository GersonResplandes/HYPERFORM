import { Request, Response } from 'express';
import { WorkoutStudentsRepository } from '../../infra/repositories/WorkoutStudentsRepository';
import { LinkWorkoutToStudentUseCase } from '../../domain/use-cases/workouts/LinkWorkoutToStudentUseCase';
import { UnlinkWorkoutFromStudentUseCase } from '../../domain/use-cases/workouts/UnlinkWorkoutFromStudentUseCase';
import { ListStudentWorkoutsUseCase } from '../../domain/use-cases/workouts/ListStudentWorkoutsUseCase';

export class WorkoutStudentsController {
  private repo = new WorkoutStudentsRepository();

  async link(req: Request, res: Response) {
    try {
      const useCase = new LinkWorkoutToStudentUseCase(this.repo);
      const result = await useCase.execute({
        ...req.body,
        student_id: req.params.studentId,
      });
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async unlink(req: Request, res: Response) {
    try {
      const useCase = new UnlinkWorkoutFromStudentUseCase(this.repo);
      await useCase.execute(req.params.id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const useCase = new ListStudentWorkoutsUseCase(this.repo);
      const result = await useCase.execute(req.params.studentId);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
