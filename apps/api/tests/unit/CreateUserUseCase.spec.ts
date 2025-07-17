import { container } from 'tsyringe';
import { CreateUserUseCase } from '../../src/domain/use-cases/CreateUserUseCase';
import { IUsersRepository } from '../../src/domain/repositories/IUsersRepository';
import { IHashProvider } from '../../src/domain/providers/IHashProvider';
import { AppError } from '../../src/domain/errors/AppError';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepository: jest.Mocked<IUsersRepository>;
  let hashProvider: jest.Mocked<IHashProvider>;

  beforeEach(() => {
    usersRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };

    hashProvider = {
      generateHash: jest.fn(),
      compareHash: jest.fn(),
    };

    container.registerInstance('UsersRepository', usersRepository);
    container.registerInstance('HashProvider', hashProvider);

    createUserUseCase = container.resolve(CreateUserUseCase);
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should create a new user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    };

    const hashedPassword = 'hashed_password';
    const createdUser = {
      id: 'user-id',
      name: userData.name,
      email: userData.email,
      password_hash: hashedPassword,
      created_at: new Date(),
    };

    usersRepository.findByEmail.mockResolvedValue(null);
    hashProvider.generateHash.mockResolvedValue(hashedPassword);
    usersRepository.create.mockResolvedValue(createdUser);

    const result = await createUserUseCase.execute(userData);

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(hashProvider.generateHash).toHaveBeenCalledWith(userData.password);
    expect(usersRepository.create).toHaveBeenCalledWith({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });
    expect(result).toEqual({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      created_at: createdUser.created_at,
    });
  });

  it('should throw error if user already exists', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    };

    const existingUser = {
      id: 'existing-user-id',
      name: 'Existing User',
      email: userData.email,
      password_hash: 'existing_hash',
      created_at: new Date(),
    };

    usersRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(createUserUseCase.execute(userData)).rejects.toThrow(
      new AppError('Usuário já existe com este email', 400)
    );

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(hashProvider.generateHash).not.toHaveBeenCalled();
    expect(usersRepository.create).not.toHaveBeenCalled();
  });
});
