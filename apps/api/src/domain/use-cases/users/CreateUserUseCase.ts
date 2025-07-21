import { injectable, inject } from 'tsyringe';
import { CreateUserData, User, UserWithoutPassword } from './User';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IHashProvider } from '../../providers/IHashProvider';
import { AppError } from '../../errors/AppError';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserData): Promise<UserWithoutPassword> {
    // Verificar se o usuário já existe
    const userExists = await this.usersRepository.findByEmail(email);
    if (userExists) {
      throw new AppError('Usuário já existe com este email', 400);
    }

    // Hash da senha
    const password_hash = await this.hashProvider.generateHash(password);

    // Criar usuário
    const user = await this.usersRepository.create({
      name,
      email,
      password: password_hash,
    });

    // Retornar usuário sem senha
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword as UserWithoutPassword;
  }
}
