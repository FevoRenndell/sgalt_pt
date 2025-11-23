// src/middlewares/validateData.js

const formatJoiError = (error) => ({
  message: 'Errores de validación',
  errors: error.details.map((d) => ({
    path: d.path.join('.'),
    message: d.message,
  })),
});

// BODY (create / update)
export const validateData = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json(formatJoiError(error));
  }

  req.validatedBody = value;
  next();
};

// PARAMS (/:id)
export const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json(formatJoiError(error));
  }

  req.validatedParams = value;
  next();
};

// QUERY (?filters)
export const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json(formatJoiError(error));
  }

  req.validatedQuery = value;
  next();
};
