import { Request, Response, NextFunction } from 'express';
import { StudentsRepository } from '../../infra/repositories/StudentsRepository';
import { CreateStudentUseCase } from '../../domain/use-cases/CreateStudentUseCase';
import { ListStudentsUseCase } from '../../domain/use-cases/ListStudentsUseCase';
import { ListStudentsWithFiltersUseCase } from '../../domain/use-cases/ListStudentsWithFiltersUseCase';
// import { GetStudentByIdUseCase } from '../../domain/use-cases/GetStudentByIdUseCase';
import { UpdateStudentUseCase } from '../../domain/use-cases/UpdateStudentUseCase';
import { DeleteStudentUseCase } from '../../domain/use-cases/DeleteStudentUseCase';
import { UpdateStudentSecureUseCase } from '../../domain/use-cases/UpdateStudentSecureUseCase';
import { DeleteStudentSecureUseCase } from '../../domain/use-cases/DeleteStudentSecureUseCase';

export class StudentsController {
  private studentsRepository = new StudentsRepository();

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
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
      return next(err);
    }
  }

  async list(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user_id = req.user.id;
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Number(req.query.limit) || 10, 100);
      const useCase = new ListStudentsUseCase(this.studentsRepository);
      const result = await useCase.execute(user_id, page, limit);
      return res.json(result);
    } catch (err: any) {
      return next(err);
    }
  }

  async listWithFilters(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.user.id;
      const { page, limit, name, email, orderBy, orderDir } = req.query;
      const useCase = new ListStudentsWithFiltersUseCase(
        this.studentsRepository
      );
      const result = await useCase.execute({
        userId,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        name: name ? String(name) : undefined,
        email: email ? String(email) : undefined,
        orderBy: orderBy ? (String(orderBy) as any) : undefined,
        orderDir: orderDir ? (String(orderDir) as any) : undefined,
      });
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    return res.status(501).json({ error: 'Endpoint indisponível no momento.' });
  }

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
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
      return next(err);
    }
  }

  async updateSecure(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const { name, email } = req.body;
      const useCase = new UpdateStudentSecureUseCase(this.studentsRepository);
      const student = await useCase.execute({ id, user_id, name, email });
      return res.status(200).json(student);
    } catch (err) {
      return next(err);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const useCase = new DeleteStudentUseCase(this.studentsRepository);
      await useCase.execute(id, user_id);
      return res.status(204).send();
    } catch (err: any) {
      return next(err);
    }
  }

  async deleteSecure(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const useCase = new DeleteStudentSecureUseCase(this.studentsRepository);
      await useCase.execute({ id, user_id });
      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  }
}
