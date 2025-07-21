import { IPlanosPagamentoRepository } from '../../domain/repositories/IPlanosPagamentoRepository';
import { PlanoPagamento } from '../../domain/entities/PlanoPagamento';
import { DatabaseConnection } from '../database/connection';

export class PlanosPagamentoRepository implements IPlanosPagamentoRepository {
  private get knex() {
    return DatabaseConnection.getInstance().getConnection();
  }

  async create(data: PlanoPagamento): Promise<PlanoPagamento> {
    await this.knex('planos_pagamento').insert(data);
    return data;
  }

  async update(data: PlanoPagamento): Promise<PlanoPagamento> {
    await this.knex('planos_pagamento')
      .where({ id: data.id })
      .update({
        ...data,
        atualizado_em: new Date(),
      });
    return data;
  }

  async findById(id: string): Promise<PlanoPagamento | null> {
    const plano = await this.knex('planos_pagamento').where({ id }).first();
    return plano ? (plano as PlanoPagamento) : null;
  }

  async findAll(): Promise<PlanoPagamento[]> {
    return this.knex('planos_pagamento').orderBy('criado_em', 'desc');
  }

  async findActiveByAlunoId(aluno_id: string): Promise<PlanoPagamento | null> {
    const plano = await this.knex('planos_pagamento')
      .where({ aluno_id, ativo: true })
      .first();
    return plano ? (plano as PlanoPagamento) : null;
  }

  async activate(id: string): Promise<void> {
    await this.knex('planos_pagamento')
      .where({ id })
      .update({ ativo: true, atualizado_em: new Date() });
  }

  async deactivate(id: string): Promise<void> {
    await this.knex('planos_pagamento')
      .where({ id })
      .update({ ativo: false, atualizado_em: new Date() });
  }
}
