import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domain/errors/AppError';

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): Response {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
}
