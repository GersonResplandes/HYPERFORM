import { container } from 'tsyringe';
import { AuthenticateUserUseCase } from '../../src/domain/use-cases/AuthenticateUserUseCase';
import { IUsersRepository } from '../../src/domain/repositories/IUsersRepository';
import { IHashProvider } from '../../src/domain/providers/IHashProvider';
import { ITokenProvider } from '../../src/domain/providers/ITokenProvider';
import { AppError } from '../../src/domain/errors/AppError';

describe('AuthenticateUserUseCase', () => {
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let usersRepository: jest.Mocked<IUsersRepository>;
  let hashProvider: jest.Mocked<IHashProvider>;
  let tokenProvider: jest.Mocked<ITokenProvider>;

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

    tokenProvider = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
    };

    container.registerInstance('UsersRepository', usersRepository);
    container.registerInstance('HashProvider', hashProvider);
    container.registerInstance('TokenProvider', tokenProvider);

    authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should authenticate user successfully', async () => {
    const authData = {
      email: 'john@example.com',
      password: '123456',
    };

    const user = {
      id: 'user-id',
      name: 'John Doe',
      email: authData.email,
      password_hash: 'hashed_password',
      created_at: new Date(),
    };

    const token = 'jwt_token';

    usersRepository.findByEmail.mockResolvedValue(user);
    hashProvider.compareHash.mockResolvedValue(true);
    tokenProvider.generateToken.mockReturnValue(token);

    const result = await authenticateUserUseCase.execute(authData);

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(authData.email);
    expect(hashProvider.compareHash).toHaveBeenCalledWith(
      authData.password,
      user.password_hash
    );
    expect(tokenProvider.generateToken).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
    });
    expect(result).toEqual({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  });

  it('should throw error if user does not exist', async () => {
    const authData = {
      email: 'nonexistent@example.com',
      password: '123456',
    };

    usersRepository.findByEmail.mockResolvedValue(null);

    await expect(authenticateUserUseCase.execute(authData)).rejects.toThrow(
      new AppError('Email ou senha incorretos', 401)
    );

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(authData.email);
    expect(hashProvider.compareHash).not.toHaveBeenCalled();
    expect(tokenProvider.generateToken).not.toHaveBeenCalled();
  });

  it('should throw error if password is incorrect', async () => {
    const authData = {
      email: 'john@example.com',
      password: 'wrong_password',
    };

    const user = {
      id: 'user-id',
      name: 'John Doe',
      email: authData.email,
      password_hash: 'hashed_password',
      created_at: new Date(),
    };

    usersRepository.findByEmail.mockResolvedValue(user);
    hashProvider.compareHash.mockResolvedValue(false);

    await expect(authenticateUserUseCase.execute(authData)).rejects.toThrow(
      new AppError('Email ou senha incorretos', 401)
    );

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(authData.email);
    expect(hashProvider.compareHash).toHaveBeenCalledWith(
      authData.password,
      user.password_hash
    );
    expect(tokenProvider.generateToken).not.toHaveBeenCalled();
  });
});
