import { z } from 'zod';
import { IPlanosPagamentoRepository } from '../../repositories/IPlanosPagamentoRepository';
import { PlanoPagamento } from '../../entities/PlanoPagamento';

const updatePlanoSchema = z.object({
  id: z.string().uuid(),
  descricao: z.string().min(1),
  valor: z.number().positive(),
  dia_vencimento: z.number().int().min(1).max(31),
});

export class UpdatePlanoPagamentoUseCase {
  constructor(private planosRepo: IPlanosPagamentoRepository) {}

  async execute(
    data: z.input<typeof updatePlanoSchema>
  ): Promise<PlanoPagamento> {
    const parsed = updatePlanoSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
    }
    const plano = await this.planosRepo.findById(parsed.data.id);
    if (!plano) throw new Error('Plano não encontrado');
    const updated: PlanoPagamento = {
      ...plano,
      ...parsed.data,
      atualizado_em: new Date(),
    };
    await this.planosRepo.update(updated);
    return updated;
  }
}
