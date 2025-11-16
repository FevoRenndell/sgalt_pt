// src/middlewares/validate.js
export const validateBody = (schema) => async (req, res, next) => {
  try {
    
    const validated = await schema.validate(req.body, {
      abortEarly: false,    
      stripUnknown: true,  
    });
    req.validatedBody = validated;
    next();

  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Errores de validación',
        errors: err.inner.length
          ? err.inner.map(e => ({
              path: e.path,
              message: e.message,
            }))
          : [{ path: err.path, message: err.message }],
      });
    }

    // Cualquier otro error
    return res.status(500).json({
      message: 'Error al validar datos',
    });
  }
};
