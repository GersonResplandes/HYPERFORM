import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ITokenProvider } from '../../domain/providers/ITokenProvider';
import { AppError } from '../../domain/errors/AppError';

interface TokenPayload {
  sub: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
      };
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
    return next(new AppError('Token não fornecido', 401));
  }

  const [, token] = authHeader.split(' ');

  try {
    const tokenProvider = container.resolve<ITokenProvider>('TokenProvider');
    const { sub: user_id, email } = tokenProvider.verifyToken(
      token
    ) as TokenPayload;

    request.user = {
      id: user_id,
      email,
    };

    return next();
  } catch {
    return next(new AppError('Token inválido', 401));
  }
}
