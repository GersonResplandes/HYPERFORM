import { z } from 'zod';
import { IStudentsRepository } from '../repositories/IStudentsRepository';
import { Student, Gender } from '../entities/Student';

const updateStudentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().regex(/^\(?\d{2}\)? ?9?\d{4}-?\d{4}$/),
  birth_date: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  notes: z.string().optional(),
  user_id: z.string().uuid(),
});

interface IRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth_date: Date | string;
  gender: Gender;
  notes?: string;
  user_id: string;
}

export class UpdateStudentUseCase {
  constructor(private studentsRepository: IStudentsRepository) {}

  async execute(data: IRequest): Promise<Student> {
    console.log('UpdateStudentUseCase.execute data:', data);
    console.log(
      'typeof id:',
      typeof data.id,
      'typeof user_id:',
      typeof data.user_id,
      'id:',
      data.id,
      'user_id:',
      data.user_id
    );
    const parsed = updateStudentSchema.safeParse(data);
    if (!parsed.success) {
      console.log('zod issues:', parsed.error.issues);
      throw new Error(
        parsed.error.issues.map((e: any) => e.message).join(', ')
      );
    }
    const { id, name, email, phone, birth_date, gender, notes, user_id } =
      parsed.data;
    const student = await this.studentsRepository.findById(id, user_id);
    if (!student) {
      throw new Error('Aluno não encontrado');
    }
    // Checar se o e-mail está mudando e se já existe para outro aluno
    if (email !== student.email) {
      const existing = await this.studentsRepository.findByEmail(
        email,
        user_id
      );
      if (existing && existing.id !== id) {
        throw new Error('E-mail de aluno já cadastrado para este usuário');
      }
    }
    student.name = name;
    student.email = email;
    student.phone = phone;
    student.birth_date = new Date(birth_date);
    student.gender = gender;
    student.notes = notes;
    student.updated_at = new Date();
    await this.studentsRepository.update(student);
    return student;
  }
}
