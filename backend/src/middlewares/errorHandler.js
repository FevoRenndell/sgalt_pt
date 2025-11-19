import { AppError } from '../error/AppError.js';
import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} from 'sequelize';

export function errorHandler(err, req, res, next) {
  console.error('[ErrorHandler]', err);

  let status = 500;
  let message = 'Error interno del servidor';
  let errors = null;

  if (err instanceof AppError) {
    status = err.statusCode || 400;
    message = err.message;
    errors = err.errors || null;
  }

  else if (err instanceof UniqueConstraintError) {
    status = 409;
    message = 'Ya existe un registro con estos datos únicos.';
    errors = err.errors?.map(e => ({
      path: e.path,
      message: e.message,
      value: e.value,
    }));
  }

  else if (err instanceof ValidationError) {
    status = 400;
    message = 'Datos inválidos.';
    errors = err.errors?.map(e => ({
      path: e.path,
      message: e.message,
      value: e.value,
    }));
  }

  else if (err instanceof ForeignKeyConstraintError) {
    status = 400;
    message = 'Violación de referencia: clave foránea inválida.';
    errors = { detail: err.original?.detail };
  }

  else if (err instanceof DatabaseError) {
    status = 500;
    message = 'Error de base de datos.';
    errors = { detail: err.original?.detail || err.message };
  }

  else if (err.status) {
    status = err.status;
    message = err.message || message;
  }

  const response = {
    success: false,
    status,
    message,
    errors,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}
