import { ListPaymentsUseCase } from '../ListPaymentsUseCase';
import {
  StatusPagamento,
  FormaPagamento,
  Payment,
} from '../../../entities/Payment';
import { IPaymentsRepository } from '../../../repositories/IPaymentsRepository';

describe('ListPaymentsUseCase', () => {
  const pagamentos: Payment[] = [
    {
      id: '1',
      aluno_id: 'a1',
      valor: 100,
      descricao: 'Mensalidade Julho',
      vencimento: new Date('2025-07-10'),
      status: StatusPagamento.PENDENTE,
      forma_pagamento: FormaPagamento.PIX,
      registrado_por_id: 'admin',
      criado_em: new Date(),
      atualizado_em: new Date(),
    },
    {
      id: '2',
      aluno_id: 'a1',
      valor: 120,
      descricao: 'Mensalidade Agosto',
      vencimento: new Date('2025-08-10'),
      status: StatusPagamento.PAGO,
      forma_pagamento: FormaPagamento.DINHEIRO,
      registrado_por_id: 'admin',
      criado_em: new Date(),
      atualizado_em: new Date(),
      data_pagamento: new Date('2025-08-10'),
    },
  ];
  const repo: IPaymentsRepository = {
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(async (filters) => {
      if (filters?.status) {
        return pagamentos.filter((p) => p.status === filters.status);
      }
      return pagamentos;
    }),
    softDelete: jest.fn(),
  };

  it('deve listar pagamentos por status', async () => {
    const useCase = new ListPaymentsUseCase(repo);
    const result = await useCase.execute({ status: StatusPagamento.PAGO });
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe(StatusPagamento.PAGO);
  });

  it('deve listar todos os pagamentos se sem filtro', async () => {
    const useCase = new ListPaymentsUseCase(repo);
    const result = await useCase.execute();
    expect(result).toHaveLength(2);
  });
});
