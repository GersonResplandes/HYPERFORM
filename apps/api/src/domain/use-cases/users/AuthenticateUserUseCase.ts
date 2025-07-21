import { injectable, inject } from 'tsyringe';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IHashProvider } from '../../providers/IHashProvider';
import { ITokenProvider } from '../../providers/ITokenProvider';
import { AppError } from '../../errors/AppError';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface AuthenticateUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('TokenProvider')
    private tokenProvider: ITokenProvider
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    // Buscar usuário pelo email
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    // Verificar senha
    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password_hash
    );
    if (!passwordMatched) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    // Gerar token
    const token = this.tokenProvider.generateToken({
      sub: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}
