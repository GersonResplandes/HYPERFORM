import { Request, Response } from 'express';
import { StudentsRepository } from '../../infra/repositories/StudentsRepository';
import { CreateStudentUseCase } from '../../domain/use-cases/CreateStudentUseCase';
import { ListStudentsUseCase } from '../../domain/use-cases/ListStudentsUseCase';
import { UpdateStudentUseCase } from '../../domain/use-cases/UpdateStudentUseCase';
import { DeleteStudentUseCase } from '../../domain/use-cases/DeleteStudentUseCase';
import { CheckActiveEnrollmentUseCase } from '../../domain/use-cases/CheckActiveEnrollmentUseCase';
import { CheckInUseCase } from '../../domain/use-cases/CheckInUseCase';
import { ListStudentCheckInsUseCase } from '../../domain/use-cases/ListStudentCheckInsUseCase';
import { container } from 'tsyringe';
import { z } from 'zod';

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
      const querySchema = z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(50).default(10),
        name: z.string().min(1).max(100).optional(),
      });
      const parsed = querySchema.safeParse(req.query);
      if (!parsed.success) {
        return res
          .status(400)
          .json({
            error: parsed.error.issues.map((i) => i.message).join(', '),
          });
      }
      const { page, limit, name } = parsed.data;
      const useCase = new ListStudentsUseCase(this.studentsRepository);
      const result = await useCase.execute(user_id, page, limit, name);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const { name, email, phone, birthDate } = req.body;
      const useCase = container.resolve(UpdateStudentUseCase);
      const student = await useCase.execute({
        id,
        user_id,
        name,
        email,
        phone,
        birthDate,
      });
      return res.json(student);
    } catch (err: any) {
      if (err.statusCode === 403) {
        return res.status(403).json({ error: err.message });
      }
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

  async activeEnrollment(req: Request, res: Response) {
    try {
      const user_id = req.user.id;
      const { id: student_id } = req.params;
      const useCase = container.resolve(CheckActiveEnrollmentUseCase);
      const result = await useCase.execute({ student_id, user_id });
      return res.json(result);
    } catch (err: any) {
      if (err.statusCode === 404) {
        return res.status(404).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }
  }

  async checkIn(req: Request, res: Response) {
    try {
      const user_id = req.user.id;
      const { id: student_id } = req.params;
      const useCase = container.resolve(CheckInUseCase);
      await useCase.execute({ student_id, user_id });
      return res
        .status(201)
        .json({ message: 'Check-in realizado com sucesso' });
    } catch (err: any) {
      if (err.statusCode === 404) {
        return res.status(404).json({ error: err.message });
      }
      if (err.statusCode === 403) {
        return res.status(403).json({ error: err.message });
      }
      if (err.statusCode === 409) {
        return res.status(409).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }
  }

  async listCheckIns(req: Request, res: Response) {
    try {
      const user_id = req.user.id;
      const { id: student_id } = req.params;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const date = req.query.date ? String(req.query.date) : undefined;
      const useCase = container.resolve(ListStudentCheckInsUseCase);
      const result = await useCase.execute({
        student_id,
        user_id,
        page,
        limit,
        date,
      });
      return res.json(result);
    } catch (err: any) {
      if (err.statusCode === 404) {
        return res.status(404).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }
  }
}
