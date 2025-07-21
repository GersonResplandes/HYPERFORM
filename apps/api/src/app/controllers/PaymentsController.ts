import { Request, Response } from 'express';
import { PaymentsRepository } from '../../infra/repositories/PaymentsRepository';
import { CreatePaymentUseCase } from '../../domain/use-cases/payments/CreatePaymentUseCase';
import { UpdatePaymentUseCase } from '../../domain/use-cases/payments/UpdatePaymentUseCase';
import { UpdatePaymentStatusUseCase } from '../../domain/use-cases/payments/UpdatePaymentStatusUseCase';
import { ListPaymentsUseCase } from '../../domain/use-cases/payments/ListPaymentsUseCase';
import { DeletePaymentUseCase } from '../../domain/use-cases/payments/DeletePaymentUseCase';

export class PaymentsController {
  private repo = new PaymentsRepository();

  async create(req: Request, res: Response) {
    try {
      const useCase = new CreatePaymentUseCase(this.repo);
      const result = await useCase.execute({
        ...req.body,
        registrado_por_id: req.user.id,
      });
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const useCase = new UpdatePaymentUseCase(this.repo);
      const result = await useCase.execute({ id: req.params.id, ...req.body });
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const useCase = new UpdatePaymentStatusUseCase(this.repo);
      await useCase.execute({ id: req.params.id, ...req.body });
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const useCase = new ListPaymentsUseCase(this.repo);
      const filters = {
        aluno_id: req.query.aluno_id as string,
        status: req.query.status as any,
        vencimento_inicio: req.query.vencimento_inicio
          ? new Date(req.query.vencimento_inicio as string)
          : undefined,
        vencimento_fim: req.query.vencimento_fim
          ? new Date(req.query.vencimento_fim as string)
          : undefined,
      };
      const result = await useCase.execute(filters);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const payment = await this.repo.findById(req.params.id);
      if (!payment)
        return res.status(404).json({ error: 'Pagamento não encontrado' });
      return res.json(payment);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const useCase = new DeletePaymentUseCase(this.repo);
      await useCase.execute(req.params.id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
}
