import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domain/errors/AppError';

export function ensureRole(role: 'INSTRUTOR' | 'ALUNO') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      throw new AppError('Usuário não autenticado', 401);
    }
    if (req.user.role !== role) {
      throw new AppError('Acesso negado: permissão insuficiente', 403);
    }
    return next();
  };
}
