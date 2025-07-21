import { injectable, inject } from 'tsyringe';
import { IUsersRepository } from './IUsersRepository';
import { UserWithoutPassword } from './User';
import { AppError } from '../../errors/AppError';
import { CacheProvider } from '../../../infra/providers/CacheProvider';

@injectable()
export class GetUserProfileUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    private cacheProvider: CacheProvider
  ) {}

  async execute(userId: string): Promise<UserWithoutPassword> {
    // Tentar buscar no cache primeiro
    const cacheKey = `user:profile:${userId}`;
    const cachedUser =
      await this.cacheProvider.get<UserWithoutPassword>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    // Se não estiver no cache, buscar no banco
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const { password_hash: _, ...userWithoutPassword } = user;
    const userProfile = userWithoutPassword as UserWithoutPassword;

    // Salvar no cache por 5 minutos
    await this.cacheProvider.set(cacheKey, userProfile, 300);

    return userProfile;
  }
}
