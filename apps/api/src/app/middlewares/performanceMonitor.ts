import { Request, Response, NextFunction } from 'express';

export function performanceMonitor(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const startTime = Date.now();

  // Interceptar o final da resposta
  response.on('finish', () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const { method, originalUrl } = request;
    const { statusCode } = response;

    // Log de performance
    console.log(
      `[PERFORMANCE] ${method} ${originalUrl} - ${statusCode} - ${responseTime}ms`
    );

    // Alertar se a resposta for muito lenta
    if (responseTime > 1000) {
      console.warn(
        `[SLOW RESPONSE] ${method} ${originalUrl} took ${responseTime}ms`
      );
    }

    // Alertar se a resposta for extremamente lenta
    if (responseTime > 5000) {
      console.error(
        `[CRITICAL SLOW] ${method} ${originalUrl} took ${responseTime}ms`
      );
    }
  });

  next();
}
