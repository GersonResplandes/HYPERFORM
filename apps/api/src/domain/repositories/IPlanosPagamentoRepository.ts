import { PlanoPagamento } from '../entities/PlanoPagamento';

export interface IPlanosPagamentoRepository {
  create(data: PlanoPagamento): Promise<PlanoPagamento>;
  update(data: PlanoPagamento): Promise<PlanoPagamento>;
  findById(id: string): Promise<PlanoPagamento | null>;
  findAll(): Promise<PlanoPagamento[]>;
  findActiveByAlunoId(aluno_id: string): Promise<PlanoPagamento | null>;
  activate(id: string): Promise<void>;
  deactivate(id: string): Promise<void>;
}
