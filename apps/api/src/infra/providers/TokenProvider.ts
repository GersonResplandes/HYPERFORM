import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import {
  ITokenProvider,
  ITokenPayload,
} from '../../domain/providers/ITokenProvider';
import { AppError } from '../../domain/errors/AppError';

@injectable()
export class TokenProvider implements ITokenProvider {
  private secret: string;
  private expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'default-secret';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  generateToken(payload: ITokenPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    } as any);
  }

  verifyToken(token: string): ITokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as ITokenPayload;
      return decoded;
    } catch (error) {
      throw new AppError('Token inválido', 401);
    }
  }
}
