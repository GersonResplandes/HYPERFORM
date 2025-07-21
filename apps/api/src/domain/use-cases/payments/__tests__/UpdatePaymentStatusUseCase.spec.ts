import { UpdatePaymentStatusUseCase } from '../UpdatePaymentStatusUseCase';
import { StatusPagamento } from '../../../entities/Payment';
import { IPaymentsRepository } from '../../../repositories/IPaymentsRepository';
import { v4 as uuidv4 } from 'uuid';

describe('UpdatePaymentStatusUseCase', () => {
  const repo: IPaymentsRepository = {
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    softDelete: jest.fn(),
  };

  it('deve alterar o status do pagamento', async () => {
    repo.updateStatus = jest.fn(async () => {});
    const useCase = new UpdatePaymentStatusUseCase(repo);
    const paymentId = uuidv4();
    await expect(
      useCase.execute({
        id: paymentId,
        status: StatusPagamento.PAGO,
        data_pagamento: new Date(),
      })
    ).resolves.toBeUndefined();
    expect(repo.updateStatus).toHaveBeenCalledWith(
      paymentId,
      StatusPagamento.PAGO,
      expect.any(Date)
    );
  });

  it('deve lançar erro se status for inválido', async () => {
    const useCase = new UpdatePaymentStatusUseCase(repo);
    // Forçando status inválido para simular erro de validação
    await expect(
      useCase.execute({ id: uuidv4(), status: 'INVALIDO' as any })
    ).rejects.toThrow();
  });
});
