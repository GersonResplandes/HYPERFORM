import { User, CreateUserData } from '../use-cases/users/User';

export interface IUsersRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
