import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { IStudentsRepository } from './IStudentsRepository';
import { Student, Gender } from './Student';

const createStudentSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().regex(/^\(?\d{2}\)? ?9?\d{4}-?\d{4}$/),
  birth_date: z.coerce.date(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  notes: z.string().optional(),
  user_id: z.string().uuid(),
});

interface IRequest {
  name: string;
  email: string;
  phone: string;
  birth_date: Date | string;
  gender: Gender;
  notes?: string;
  user_id: string;
}

export class CreateStudentUseCase {
  constructor(private studentsRepository: IStudentsRepository) {}

  async execute(data: IRequest): Promise<Student> {
    const parsed = createStudentSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        parsed.error.issues.map((e: any) => e.message).join(', ')
      );
    }

    const { name, email, phone, birth_date, gender, notes, user_id } =
      parsed.data;

    const existing = await this.studentsRepository.findByEmail(email, user_id);
    if (existing) {
      throw new Error('E-mail de aluno já cadastrado para este usuário');
    }

    const now = new Date();
    const student: Student = {
      id: uuidv4(),
      name,
      email,
      phone,
      birth_date: new Date(birth_date),
      gender,
      notes,
      created_at: now,
      updated_at: now,
      deleted_at: null,
      user_id,
    };

    await this.studentsRepository.create(student);
    return student;
  }
}
