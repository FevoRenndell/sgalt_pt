// 404
export const notFoundHandler = (req, res, _next) => {
  res
    .status(404)
    .json({ ok: false, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// Errores
export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  // Loguear el stack en desarrollo
  res.status(status).json({ ok: false, message });
};
