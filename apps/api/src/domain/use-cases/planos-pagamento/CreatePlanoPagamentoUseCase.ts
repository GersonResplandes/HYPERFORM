import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { IPlanosPagamentoRepository } from '../../repositories/IPlanosPagamentoRepository';
import { IPaymentsRepository } from '../../repositories/IPaymentsRepository';
import { PlanoPagamento } from '../../entities/PlanoPagamento';
import {
  Payment,
  StatusPagamento,
  FormaPagamento,
} from '../../entities/Payment';
import { addMonths, setDate, isBefore } from 'date-fns';

const createPlanoSchema = z.object({
  aluno_id: z.string().uuid(),
  descricao: z.string().min(1),
  valor: z.number().positive(),
  inicio: z.coerce.date(),
  dia_vencimento: z.number().int().min(1).max(31),
});

export class CreatePlanoPagamentoUseCase {
  constructor(
    private planosRepo: IPlanosPagamentoRepository,
    private paymentsRepo: IPaymentsRepository
  ) {}

  async execute(
    data: z.input<typeof createPlanoSchema>
  ): Promise<PlanoPagamento> {
    const parsed = createPlanoSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((e) => e.message).join(', '));
    }
    // Impedir múltiplos planos ativos
    const planoAtivo = await this.planosRepo.findActiveByAlunoId(
      parsed.data.aluno_id
    );
    if (planoAtivo) {
      throw new Error('Já existe um plano ativo para este aluno');
    }
    const now = new Date();
    const plano: PlanoPagamento = {
      id: uuidv4(),
      ...parsed.data,
      ativo: true,
      criado_em: now,
      atualizado_em: now,
    };
    await this.planosRepo.create(plano);
    // Gerar primeiro pagamento se o início for hoje ou anterior
    const vencimento = setDate(plano.inicio, plano.dia_vencimento);
    if (isBefore(vencimento, now)) {
      // Se o vencimento deste mês já passou, gera para o próximo mês
      const proxVenc = setDate(
        addMonths(plano.inicio, 1),
        plano.dia_vencimento
      );
      await this.paymentsRepo.create({
        id: uuidv4(),
        aluno_id: plano.aluno_id,
        valor: plano.valor,
        descricao: plano.descricao,
        vencimento: proxVenc,
        status: StatusPagamento.PENDENTE,
        forma_pagamento: FormaPagamento.OUTRO,
        registrado_por_id: '',
        criado_em: now,
        atualizado_em: now,
      });
    } else {
      await this.paymentsRepo.create({
        id: uuidv4(),
        aluno_id: plano.aluno_id,
        valor: plano.valor,
        descricao: plano.descricao,
        vencimento,
        status: StatusPagamento.PENDENTE,
        forma_pagamento: FormaPagamento.OUTRO,
        registrado_por_id: '',
        criado_em: now,
        atualizado_em: now,
      });
    }
    return plano;
  }
}
