import { inject, injectable } from 'tsyringe';
import {
  IStudentsRepository,
  ListStudentsFilters,
  ListStudentsResult,
} from '../repositories/IStudentsRepository';
import { z } from 'zod';

const filtersSchema = z.object({
  userId: z.string().uuid(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  name: z.string().min(1).optional(),
  email: z.string().min(1).optional(),
  orderBy: z.enum(['name', 'email', 'created_at']).optional(),
  orderDir: z.enum(['asc', 'desc']).optional(),
});

@injectable()
export class ListStudentsWithFiltersUseCase {
  constructor(
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository
  ) {}

  async execute(filters: ListStudentsFilters): Promise<ListStudentsResult> {
    const parsed = filtersSchema.safeParse(filters);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((i) => i.message).join(', '));
    }
    return this.studentsRepository.listWithFilters(parsed.data);
  }
}
