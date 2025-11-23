// src/validations/userValidations.js
import Joi from 'joi';

// Solo letras (con tildes) y espacios
const nameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;

// ---------- CREATE (BODY) ----------
export const createUserSchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .max(100)
    .pattern(nameRegex)
    .required()
    .messages({
      'any.required': 'El nombre es obligatorio',
      'string.max': 'El nombre no puede superar los 100 caracteres',
      'string.pattern.base': 'El nombre no debe contener números ni caracteres especiales',
    }),

  last_name_1: Joi.string()
    .trim()
    .max(100)
    .pattern(nameRegex)
    .required()
    .messages({
      'any.required': 'El primer apellido es obligatorio',
      'string.max': 'El primer apellido no puede superar los 100 caracteres',
      'string.pattern.base':
        'El primer apellido no debe contener números ni caracteres especiales',
    }),

  last_name_2: Joi.string()
    .trim()
    .allow('', null)
    .max(100)
    .pattern(nameRegex)
    .messages({
      'string.max': 'El segundo apellido no puede superar los 100 caracteres',
      'string.pattern.base':
        'El segundo apellido no debe contener números ni caracteres especiales',
    }),

  email: Joi.string()
    .trim()
    .email()
    .max(255)
    .required()
    .messages({
      'any.required': 'El email es obligatorio',
      'string.email': 'El email no es válido',
      'string.max': 'El email no puede superar los 255 caracteres',
    }),

  password_hash: Joi.string()
    .trim()
    .max(255)
    .required()
    .messages({
      'any.required': 'La contraseña es obligatoria',
      'string.max': 'La contraseña no puede superar los 255 caracteres',
    }),

  role_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El rol es obligatorio',
      'number.base': 'El rol debe ser un número',
      'number.integer': 'El rol debe ser un número entero',
      'number.positive': 'El rol debe ser un entero positivo',
    }),

  is_active: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El estado activo debe ser verdadero o falso',
    }),
})
  .unknown(false)
  .messages({
    'object.unknown': 'Campo no permitido en el cuerpo de la solicitud',
  });

// ---------- UPDATE (BODY) ----------
export const updateUserSchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .max(100)
    .pattern(nameRegex)
    .messages({
      'string.max': 'El nombre no puede superar los 100 caracteres',
      'string.pattern.base': 'El nombre no debe contener números ni caracteres especiales',
    }),

  last_name_1: Joi.string()
    .trim()
    .max(100)
    .pattern(nameRegex)
    .messages({
      'string.max': 'El primer apellido no puede superar los 100 caracteres',
      'string.pattern.base':
        'El primer apellido no debe contener números ni caracteres especiales',
    }),

  last_name_2: Joi.string()
    .trim()
    .allow('', null)
    .max(100)
    .pattern(nameRegex)
    .messages({
      'string.max': 'El segundo apellido no puede superar los 100 caracteres',
      'string.pattern.base':
        'El segundo apellido no debe contener números ni caracteres especiales',
    }),

  email: Joi.string()
    .trim()
    .email()
    .max(255)
    .messages({
      'string.email': 'El email no es válido',
      'string.max': 'El email no puede superar los 255 caracteres',
    }),

  password_hash: Joi.string()
    .trim()
    .max(255)
    .messages({
      'string.max': 'La contraseña no puede superar los 255 caracteres',
    }),

  role_id: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'El rol debe ser un número',
      'number.integer': 'El rol debe ser un número entero',
      'number.positive': 'El rol debe ser un entero positivo',
    }),

  is_active: Joi.boolean().messages({
    'boolean.base': 'El estado activo debe ser verdadero o falso',
  }),
})
  .unknown(false)
  .or(
    'first_name',
    'last_name_1',
    'last_name_2',
    'email',
    'password_hash',
    'role_id',
    'is_active',
  )
  .messages({
    'object.missing': 'Debe enviar al menos un campo para actualizar el usuario',
    'object.unknown': 'Campo no permitido en el cuerpo de la solicitud',
  });

// ---------- PARAMS (/users/:id) ----------
export const userIdParamsSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El id del usuario es obligatorio',
      'number.base': 'El id del usuario debe ser un número',
      'number.integer': 'El id del usuario debe ser un número entero',
      'number.positive': 'El id del usuario debe ser un entero positivo',
    }),
});

// ---------- QUERY (/users/all?...) ----------
export const userQuerySchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .max(100)
    .pattern(nameRegex)
    .allow('', null)
    .messages({
      'string.max': 'El nombre no puede superar los 100 caracteres',
      'string.pattern.base': 'El nombre no debe contener números ni caracteres especiales',
    }),

  last_name_1: Joi.string()
    .trim()
    .max(100)
    .pattern(nameRegex)
    .allow('', null)
    .messages({
      'string.max': 'El primer apellido no puede superar los 100 caracteres',
      'string.pattern.base':
        'El primer apellido no debe contener números ni caracteres especiales',
    }),

  last_name_2: Joi.string()
    .trim()
    .max(100)
    .pattern(nameRegex)
    .allow('', null)
    .messages({
      'string.max': 'El segundo apellido no puede superar los 100 caracteres',
      'string.pattern.base':
        'El segundo apellido no debe contener números ni caracteres especiales',
    }),

  email: Joi.string()
    .trim()
    .email()
    .max(255)
    .allow('', null)
    .messages({
      'string.email': 'El email no es válido',
      'string.max': 'El email no puede superar los 255 caracteres',
    }),

  role_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      'number.base': 'El rol debe ser un número',
      'number.integer': 'El rol debe ser un número entero',
      'number.positive': 'El rol debe ser un entero positivo',
    }),

  is_active: Joi.boolean()
    .allow(null)
    .messages({
      'boolean.base': 'El estado activo debe ser verdadero o falso',
    }),
})
  .unknown(false)
  .messages({
    'object.unknown': 'Campo no permitido en los parámetros de consulta',
  });
