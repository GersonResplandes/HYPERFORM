import { Request, Response } from 'express';
import { PlanosPagamentoRepository } from '../../infra/repositories/PlanosPagamentoRepository';
import { PaymentsRepository } from '../../infra/repositories/PaymentsRepository';
import { NotificacoesPagamentoRepository } from '../../infra/repositories/NotificacoesPagamentoRepository';
import { PagamentosSchedulerService } from '../../domain/services/PagamentosSchedulerService';

export class SchedulerController {
  async processarDia(req: Request, res: Response) {
    try {
      const planosRepo = new PlanosPagamentoRepository();
      const paymentsRepo = new PaymentsRepository();
      const notificacoesRepo = new NotificacoesPagamentoRepository();
      const scheduler = new PagamentosSchedulerService(
        planosRepo,
        paymentsRepo,
        notificacoesRepo
      );
      await scheduler.processarDia();
      return res.status(204).send();
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
