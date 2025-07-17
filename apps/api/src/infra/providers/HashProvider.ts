import { injectable } from 'tsyringe';
import bcrypt from 'bcryptjs';
import { IHashProvider } from '../../domain/providers/IHashProvider';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 6;

@injectable()
export class HashProvider implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    return bcrypt.hash(payload, SALT_ROUNDS);
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(payload, hashed);
  }
}
