import { Request, Response } from 'express';
import { PhysicalProgressRepository } from '../../infra/repositories/PhysicalProgressRepository';
import { CreatePhysicalProgressUseCase } from '../../domain/use-cases/physical-progress/CreatePhysicalProgressUseCase';
import { UpdatePhysicalProgressUseCase } from '../../domain/use-cases/physical-progress/UpdatePhysicalProgressUseCase';
import { DeletePhysicalProgressUseCase } from '../../domain/use-cases/physical-progress/DeletePhysicalProgressUseCase';
import { ListStudentPhysicalProgressUseCase } from '../../domain/use-cases/physical-progress/ListStudentPhysicalProgressUseCase';

export class PhysicalProgressController {
  private repo = new PhysicalProgressRepository();

  async create(req: Request, res: Response) {
    try {
      const useCase = new CreatePhysicalProgressUseCase(this.repo);
      const result = await useCase.execute({
        ...req.body,
        registrado_por_id: req.user.id,
      });
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const useCase = new UpdatePhysicalProgressUseCase(this.repo);
      const result = await useCase.execute({ id: req.params.id, ...req.body });
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const useCase = new DeletePhysicalProgressUseCase(this.repo);
      await useCase.execute(req.params.id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async listByStudent(req: Request, res: Response) {
    try {
      const useCase = new ListStudentPhysicalProgressUseCase(this.repo);
      const result = await useCase.execute(req.params.aluno_id);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
