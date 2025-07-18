import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domain/errors/AppError';

const errorIcon = '❌';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log só a mensagem principal no terminal
  console.error(
    `${errorIcon} [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  console.error(`${errorIcon} ${err.message}`);

  // Resposta amigável para o cliente
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      status: err.statusCode,
      icon: errorIcon,
    });
  }

  // Erro inesperado
  return res.status(500).json({
    error: 'Erro interno do servidor',
    status: 500,
    icon: errorIcon,
  });
}
