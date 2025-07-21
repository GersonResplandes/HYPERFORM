import { Request, Response } from 'express';
import { NotificacoesPagamentoRepository } from '../../infra/repositories/NotificacoesPagamentoRepository';

export class NotificacoesPagamentoController {
  private repo = new NotificacoesPagamentoRepository();

  async list(req: Request, res: Response) {
    try {
      const result = await this.repo.findAll();
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
