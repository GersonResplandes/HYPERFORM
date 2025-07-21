import { IPlanosPagamentoRepository } from '../repositories/IPlanosPagamentoRepository';
import { IPaymentsRepository } from '../repositories/IPaymentsRepository';
import { INotificacoesPagamentoRepository } from '../repositories/INotificacoesPagamentoRepository';
import { PlanoPagamento } from '../entities/PlanoPagamento';
import { Payment, StatusPagamento, FormaPagamento } from '../entities/Payment';
import {
  NotificacaoPagamento,
  TipoNotificacao,
} from '../entities/NotificacaoPagamento';
import { v4 as uuidv4 } from 'uuid';
import { addMonths, setDate, isSameDay, isBefore, subDays } from 'date-fns';

export class PagamentosSchedulerService {
  constructor(
    private planosRepo: IPlanosPagamentoRepository,
    private paymentsRepo: IPaymentsRepository,
    private notificacoesRepo: INotificacoesPagamentoRepository
  ) {}

  async processarDia(dataReferencia: Date = new Date()): Promise<void> {
    // 1. Gerar pagamentos recorrentes para planos ativos
    const planos = await this.planosRepo.findAll();
    for (const plano of planos) {
      if (!plano.ativo) continue;
      // Calcular vencimento do mês corrente
      const vencimento = setDate(dataReferencia, plano.dia_vencimento);
      // Verificar se já existe pagamento para este mês
      const pagamentos = await this.paymentsRepo.findAll({
        aluno_id: plano.aluno_id,
        vencimento_inicio: setDate(dataReferencia, 1),
        vencimento_fim: setDate(dataReferencia, 31),
      });
      const existe = pagamentos.some((p) =>
        isSameDay(new Date(p.vencimento), vencimento)
      );
      if (!existe) {
        await this.paymentsRepo.create({
          id: uuidv4(),
          aluno_id: plano.aluno_id,
          valor: plano.valor,
          descricao: plano.descricao,
          vencimento,
          status: StatusPagamento.PENDENTE,
          forma_pagamento: FormaPagamento.OUTRO,
          registrado_por_id: '',
          criado_em: new Date(),
          atualizado_em: new Date(),
        });
      }
    }

    // 2. Atualizar status de pagamentos vencidos
    const todosPagamentos = await this.paymentsRepo.findAll();
    for (const pagamento of todosPagamentos) {
      if (
        pagamento.status === StatusPagamento.PENDENTE &&
        isBefore(new Date(pagamento.vencimento), dataReferencia)
      ) {
        await this.paymentsRepo.updateStatus(
          pagamento.id,
          StatusPagamento.ATRASADO
        );
      }
    }

    // 3. Notificações mockadas
    for (const pagamento of todosPagamentos) {
      if (pagamento.status !== StatusPagamento.PENDENTE) continue;
      const vencimento = new Date(pagamento.vencimento);
      // 3 dias antes
      if (isSameDay(subDays(vencimento, 3), dataReferencia)) {
        await this.notificacoesRepo.create({
          id: uuidv4(),
          pagamento_id: pagamento.id,
          tipo_notificacao: TipoNotificacao.LEMBRETE_3_DIAS,
          data_envio: new Date(),
        });
      }
      // No dia do vencimento
      if (isSameDay(vencimento, dataReferencia)) {
        await this.notificacoesRepo.create({
          id: uuidv4(),
          pagamento_id: pagamento.id,
          tipo_notificacao: TipoNotificacao.LEMBRETE_VENCIMENTO,
          data_envio: new Date(),
        });
      }
    }
  }
}
