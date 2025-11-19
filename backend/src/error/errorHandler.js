// src/middlewares/errorHandler.js
import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} from 'sequelize';

export function errorHandler(err, req, res, next) {

  console.error('Error capturado:', err);

  if (err.isOperational && err.statusCode) {
    return res.status(err.statusCode).json({
      ok: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  // ---- ERRORES SEQUELIZE ----

  // 1) Violación de unicidad (lo que muestras en el ejemplo)
  if (err instanceof UniqueConstraintError) {
    const details = err.errors?.map((e) => ({
      message: e.message,
      path: e.path,
      type: e.type,
      value: e.value,
    }));

    return res.status(409).json({
      ok: false,
      code: 'UNIQUE_CONSTRAINT',
      message: 'Ya existe un registro con esos datos únicos.',
      errors: details,
    });
  }

  // 2) Validaciones de Sequelize (notNull, isEmail, len, etc.)
  if (err instanceof ValidationError) {
    const details = err.errors?.map((e) => ({
      message: e.message,
      path: e.path,
      type: e.type,
      value: e.value,
    }));

    return res.status(400).json({
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'Error de validación en los datos enviados.',
      errors: details,
    });
  }

  // 3) Foreign key constraint
  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      ok: false,
      code: 'FK_CONSTRAINT',
      message: 'No se puede realizar la operación por restricciones de integridad (FK).',
      detail: err.original?.detail || null,
    });
  }

  // 4) Cualquier DatabaseError
  if (err instanceof DatabaseError) {
    return res.status(500).json({
      ok: false,
      code: 'DATABASE_ERROR',
      message: 'Error en la base de datos.',
      detail: err.original?.detail || err.message,
    });
  }

  // ---- OTROS ERRORES (no sequelize) ----

  // Ej: error de Joi/Yup, etc. (opcional)
  if (err.name === 'ValidationError' && err.isJoi) {
    return res.status(400).json({
      ok: false,
      code: 'SCHEMA_VALIDATION_ERROR',
      message: 'Los datos no cumplen con el esquema de validación.',
      errors: err.details || null,
    });
  }

  // Fallback genérico
  return res.status(500).json({
    ok: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.',
  });
}

 
