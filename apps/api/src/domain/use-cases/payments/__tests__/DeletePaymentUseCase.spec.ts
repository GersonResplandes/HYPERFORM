import { DeletePaymentUseCase } from '../DeletePaymentUseCase';
import { IPaymentsRepository } from '../../../repositories/IPaymentsRepository';

describe('DeletePaymentUseCase', () => {
  const repo: IPaymentsRepository = {
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    softDelete: jest.fn(async () => {}),
  };

  it('deve realizar soft delete do pagamento', async () => {
    const useCase = new DeletePaymentUseCase(repo);
    await expect(useCase.execute('1')).resolves.toBeUndefined();
    expect(repo.softDelete).toHaveBeenCalledWith('1');
  });
});
