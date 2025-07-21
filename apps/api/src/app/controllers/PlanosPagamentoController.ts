import { Request, Response } from 'express';
import { PlanosPagamentoRepository } from '../../infra/repositories/PlanosPagamentoRepository';
import { PaymentsRepository } from '../../infra/repositories/PaymentsRepository';
import { CreatePlanoPagamentoUseCase } from '../../domain/use-cases/planos-pagamento/CreatePlanoPagamentoUseCase';
import { UpdatePlanoPagamentoUseCase } from '../../domain/use-cases/planos-pagamento/UpdatePlanoPagamentoUseCase';
import { ActivateDeactivatePlanoUseCase } from '../../domain/use-cases/planos-pagamento/ActivateDeactivatePlanoUseCase';
import { ListPlanosPagamentoUseCase } from '../../domain/use-cases/planos-pagamento/ListPlanosPagamentoUseCase';

export class PlanosPagamentoController {
  private repo = new PlanosPagamentoRepository();
  private paymentsRepo = new PaymentsRepository();

  async create(req: Request, res: Response) {
    try {
      const useCase = new CreatePlanoPagamentoUseCase(
        this.repo,
        this.paymentsRepo
      );
      const result = await useCase.execute(req.body);
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const useCase = new UpdatePlanoPagamentoUseCase(this.repo);
      const result = await useCase.execute({ id: req.params.id, ...req.body });
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async activate(req: Request, res: Response) {
    try {
      const useCase = new ActivateDeactivatePlanoUseCase(this.repo);
      await useCase.execute(req.params.id, true);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async deactivate(req: Request, res: Response) {
    try {
      const useCase = new ActivateDeactivatePlanoUseCase(this.repo);
      await useCase.execute(req.params.id, false);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const useCase = new ListPlanosPagamentoUseCase(this.repo);
      const result = await useCase.execute();
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
