import { injectable, inject } from 'tsyringe';
import { IStudentsRepository } from './IStudentsRepository';
import { z } from 'zod';
import { AppError } from '../../errors/AppError';

const updateStudentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').optional(),
  email: z.string().email('E-mail inválido').optional(),
  phone: z
    .string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .optional(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
    .optional(),
});

interface UpdateStudentDTO {
  id: string;
  user_id: string;
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
}

@injectable()
export class UpdateStudentUseCase {
  constructor(
    @inject('StudentsRepository')
    private studentsRepository: IStudentsRepository
  ) {}

  async execute(data: UpdateStudentDTO) {
    const parsed = updateStudentSchema.safeParse(data);
    if (!parsed.success) {
      throw new AppError(
        parsed.error.issues.map((i) => i.message).join(', '),
        422
      );
    }
    const { id, user_id, name, email, phone, birthDate } = parsed.data;
    // Busca aluno e valida escopo
    const student = await this.studentsRepository.findById(id, user_id);
    if (!student) {
      throw new AppError('Acesso negado ou aluno não encontrado', 403);
    }
    // Ao menos um campo deve ser informado
    if (!name && !email && !phone && !birthDate) {
      throw new AppError('Informe ao menos um campo para atualizar', 400);
    }
    // Monta objeto de atualização sem sobrescrever undefined
    const updateData: any = Object.fromEntries(
      Object.entries({ name, email, phone, birth_date: birthDate }).filter(
        ([, v]) => v !== undefined
      )
    );
    if (updateData.birth_date) {
      updateData.birth_date = new Date(updateData.birth_date);
    }
    const updated = await this.studentsRepository.update({
      ...student,
      ...updateData,
    });
    return updated;
  }
}
