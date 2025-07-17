import { Request, Response } from 'express';
import { StudentsRepository } from '../../infra/repositories/StudentsRepository';
import { CreateStudentUseCase } from '../../domain/use-cases/CreateStudentUseCase';
import { ListStudentsUseCase } from '../../domain/use-cases/ListStudentsUseCase';
import { GetStudentByIdUseCase } from '../../domain/use-cases/GetStudentByIdUseCase';
import { UpdateStudentUseCase } from '../../domain/use-cases/UpdateStudentUseCase';
import { DeleteStudentUseCase } from '../../domain/use-cases/DeleteStudentUseCase';

export class StudentsController {
  private studentsRepository = new StudentsRepository();

  async create(req: Request, res: Response) {
    try {
      const user_id = req.user.id;
      const { name, email, phone, birth_date, gender, notes } = req.body;
      const useCase = new CreateStudentUseCase(this.studentsRepository);
      const student = await useCase.execute({
        name,
        email,
        phone,
        birth_date,
        gender,
        notes,
        user_id,
      });
      return res.status(201).json(student);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const user_id = req.user.id;
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Number(req.query.limit) || 10, 100);
      const useCase = new ListStudentsUseCase(this.studentsRepository);
      const result = await useCase.execute(user_id, page, limit);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const useCase = new GetStudentByIdUseCase(this.studentsRepository);
      const student = await useCase.execute(id, user_id);
      return res.json(student);
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const { name, email, phone, birth_date, gender, notes } = req.body;
      const useCase = new UpdateStudentUseCase(this.studentsRepository);
      const student = await useCase.execute({
        id,
        name,
        email,
        phone,
        birth_date,
        gender,
        notes,
        user_id,
      });
      return res.json(student);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const useCase = new DeleteStudentUseCase(this.studentsRepository);
      await useCase.execute(id, user_id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
}
