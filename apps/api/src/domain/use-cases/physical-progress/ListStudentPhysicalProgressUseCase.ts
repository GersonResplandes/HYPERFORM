import { IPhysicalProgressRepository } from '../../repositories/IPhysicalProgressRepository';
import { PhysicalProgress } from '../../entities/PhysicalProgress';

export class ListStudentPhysicalProgressUseCase {
  constructor(private repo: IPhysicalProgressRepository) {}

  async execute(aluno_id: string): Promise<PhysicalProgress[]> {
    return this.repo.findByStudentId(aluno_id);
  }
}
