import { AppError } from '../error/AppError.js';

export function errorHandler(err, req, res, next) {
  console.error('[ErrorHandler]', err);

  // Si es un AppError usamos su statusCode, si no, 500
  const status = err instanceof AppError ? err.statusCode : (err.status || 500);

  const response = {
    success: false,
    message:
      err instanceof AppError
        ? err.message
        : 'Error interno del servidor',
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}
