import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ITokenProvider } from '../../domain/providers/ITokenProvider';
import { AppError } from '../../domain/errors/AppError';

interface TokenPayload {
  sub: string;
  email: string;
  role: 'INSTRUTOR' | 'ALUNO';
}

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: 'INSTRUTOR' | 'ALUNO';
    }
    interface Request {
      user: User;
    }
  }
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token não fornecido', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const tokenProvider = container.resolve<ITokenProvider>('TokenProvider');
    const {
      sub: user_id,
      email,
      role,
    } = tokenProvider.verifyToken(token) as TokenPayload;

    if (!role) {
      throw new AppError('Perfil do usuário não encontrado no token', 401);
    }

    request.user = {
      id: user_id,
      email,
      role,
    };

    return next();
  } catch {
    throw new AppError('Token inválido', 401);
  }
}
