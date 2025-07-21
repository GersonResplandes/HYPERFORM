import { UpdatePaymentUseCase } from '../UpdatePaymentUseCase';
import {
  StatusPagamento,
  FormaPagamento,
  Payment,
} from '../../../entities/Payment';
import { IPaymentsRepository } from '../../../repositories/IPaymentsRepository';
import { v4 as uuidv4 } from 'uuid';

describe('UpdatePaymentUseCase', () => {
  const paymentId = uuidv4();
  const payment: Payment = {
    id: paymentId,
    aluno_id: uuidv4(),
    valor: 100,
    descricao: 'Mensalidade Julho',
    vencimento: new Date('2025-07-10'),
    status: StatusPagamento.PENDENTE,
    forma_pagamento: FormaPagamento.PIX,
    registrado_por_id: uuidv4(),
    criado_em: new Date(),
    atualizado_em: new Date(),
  };
  const repo: IPaymentsRepository = {
    create: jest.fn(),
    update: jest.fn(async (data) => data),
    updateStatus: jest.fn(),
    findById: jest.fn(async (id) => (id === paymentId ? payment : null)),
    findAll: jest.fn(),
    softDelete: jest.fn(),
  };

  it('deve atualizar um pagamento existente', async () => {
    const useCase = new UpdatePaymentUseCase(repo);
    const result = await useCase.execute({
      id: paymentId,
      valor: 150,
      descricao: 'Mensalidade Julho Corrigida',
      vencimento: new Date('2025-07-15'),
      status: StatusPagamento.PENDENTE,
      forma_pagamento: FormaPagamento.PIX,
    });
    expect(result.valor).toBe(150);
    expect(result.descricao).toBe('Mensalidade Julho Corrigida');
  });

  it('deve lançar erro se pagamento não existir', async () => {
    const useCase = new UpdatePaymentUseCase(repo);
    await expect(
      useCase.execute({
        id: uuidv4(),
        valor: 100,
        descricao: 'Teste',
        vencimento: new Date(),
        status: StatusPagamento.PENDENTE,
        forma_pagamento: FormaPagamento.DINHEIRO,
      })
    ).rejects.toThrow('Pagamento não encontrado');
  });
});
