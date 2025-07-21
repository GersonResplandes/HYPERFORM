import { CreatePaymentUseCase } from '../CreatePaymentUseCase';
import { StatusPagamento, FormaPagamento } from '../../../entities/Payment';
import { IPaymentsRepository } from '../../../repositories/IPaymentsRepository';
import { v4 as uuidv4 } from 'uuid';

describe('CreatePaymentUseCase', () => {
  const repo: IPaymentsRepository = {
    create: jest.fn(async (data) => data),
    update: jest.fn(),
    updateStatus: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    softDelete: jest.fn(),
  };

  it('deve criar um pagamento válido', async () => {
    const useCase = new CreatePaymentUseCase(repo);
    const result = await useCase.execute({
      aluno_id: uuidv4(),
      valor: 100,
      descricao: 'Mensalidade Julho',
      vencimento: new Date('2025-07-10'),
      status: StatusPagamento.PENDENTE,
      forma_pagamento: FormaPagamento.PIX,
      registrado_por_id: uuidv4(),
    });
    expect(result).toHaveProperty('id');
    expect(result.valor).toBe(100);
    expect(result.status).toBe(StatusPagamento.PENDENTE);
  });

  it('deve lançar erro se valor for negativo', async () => {
    const useCase = new CreatePaymentUseCase(repo);
    await expect(
      useCase.execute({
        aluno_id: uuidv4(),
        valor: -10,
        descricao: 'Teste',
        vencimento: new Date(),
        status: StatusPagamento.PENDENTE,
        forma_pagamento: FormaPagamento.DINHEIRO,
        registrado_por_id: uuidv4(),
      })
    ).rejects.toThrow();
  });
});
