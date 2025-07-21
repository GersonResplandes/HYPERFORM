import { IPhysicalProgressRepository } from '../../repositories/IPhysicalProgressRepository';

export class DeletePhysicalProgressUseCase {
  constructor(private repo: IPhysicalProgressRepository) {}

  async execute(id: string): Promise<void> {
    const record = await this.repo.findById(id);
    if (!record) {
      throw new Error('Registro de progresso não encontrado');
    }
    await this.repo.softDelete(id);
  }
}
