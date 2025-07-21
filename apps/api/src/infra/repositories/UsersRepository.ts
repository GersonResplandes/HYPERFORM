import { injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { IUsersRepository } from '../../domain/repositories/IUsersRepository';
import { User, CreateUserData } from '../../domain/use-cases/users/User';
import { DatabaseConnection } from '../database/connection';

@injectable()
export class UsersRepository implements IUsersRepository {
  private db: any;

  constructor() {
    this.db = DatabaseConnection.getInstance().getConnection();
  }

  async create({ name, email, password }: CreateUserData): Promise<User> {
    const id = uuidv4();
    const now = new Date();

    await this.db('users').insert({
      id,
      name,
      email,
      password_hash: password,
      created_at: now,
      updated_at: now,
    });

    const user = await this.db('users').where({ id }).first();

    return {
      ...user,
      created_at: new Date(user.created_at),
      updated_at: user.updated_at ? new Date(user.updated_at) : undefined,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db('users').where({ email }).first();

    if (!user) {
      return null;
    }

    return {
      ...user,
      created_at: new Date(user.created_at),
      updated_at: user.updated_at ? new Date(user.updated_at) : undefined,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.db('users').where({ id }).first();

    if (!user) {
      return null;
    }

    return {
      ...user,
      created_at: new Date(user.created_at),
      updated_at: user.updated_at ? new Date(user.updated_at) : undefined,
    };
  }
}
