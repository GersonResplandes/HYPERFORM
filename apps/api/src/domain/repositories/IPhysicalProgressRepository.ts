import { PhysicalProgress } from '../entities/PhysicalProgress';

export interface IPhysicalProgressRepository {
  create(data: PhysicalProgress): Promise<PhysicalProgress>;
  findById(id: string): Promise<PhysicalProgress | null>;
  findByStudentId(aluno_id: string): Promise<PhysicalProgress[]>;
  update(data: PhysicalProgress): Promise<PhysicalProgress>;
  softDelete(id: string): Promise<void>;
}
