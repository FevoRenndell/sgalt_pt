// src/validations/clientValidations.js
import Joi from 'joi';

// Regex
const personNameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const companyNameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s&.,\-]+$/;
const rutRegex = /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/;
const phoneRegex = /^[0-9+\-\s()]+$/;

// ---------- CREATE (BODY) ----------
export const createClientSchema = Joi.object({
  company_rut: Joi.string()
    .trim()
    .required()
    .max(20)
    .pattern(rutRegex)
    .messages({
      'any.required': 'El RUT de la empresa es obligatorio',
      'string.max': 'El RUT de la empresa no puede superar los 20 caracteres',
      'string.pattern.base': 'El RUT de la empresa no es válido',
    }),

  company_name: Joi.string()
    .trim()
    .required()
    .max(255)
    .pattern(companyNameRegex)
    .messages({
      'any.required': 'El nombre de la empresa es obligatorio',
      'string.max': 'El nombre de la empresa no puede superar los 255 caracteres',
      'string.pattern.base': 'El nombre de la empresa no debe contener caracteres especiales no permitidos',
    }),

  contact_name: Joi.string()
    .trim()
    .required()
    .max(255)
    .pattern(personNameRegex)
    .messages({
      'any.required': 'El nombre del contacto es obligatorio',
      'string.max': 'El nombre del contacto no puede superar los 255 caracteres',
      'string.pattern.base': 'El nombre del contacto no debe contener números ni caracteres especiales',
    }),

  contact_email: Joi.string()
    .trim()
    .required()
    .email()
    .max(255)
    .messages({
      'any.required': 'El email de contacto es obligatorio',
      'string.email': 'El email de contacto no es válido',
      'string.max': 'El email de contacto no puede superar los 255 caracteres',
    }),

  contact_phone: Joi.string()
    .trim()
    .required()
    .max(50)
    .pattern(phoneRegex)
    .messages({
      'any.required': 'El teléfono de contacto es obligatorio',
      'string.max': 'El teléfono de contacto no puede superar los 50 caracteres',
      'string.pattern.base':
        'El teléfono de contacto solo puede contener números y símbolos válidos (+, -, espacio, paréntesis)',
    }),

  service_description: Joi.string()
    .allow('', null)
    .max(2000)
    .messages({
      'string.max': 'La descripción del servicio no puede superar los 2000 caracteres',
    }),
});

// ---------- UPDATE (BODY) ----------
export const updateClientSchema  = Joi.object({
  company_rut: Joi.string()
    .trim()
    .required()
    .max(20)
    .pattern(rutRegex)
    .messages({
      'any.required': 'El RUT de la empresa es obligatorio',
      'string.max': 'El RUT de la empresa no puede superar los 20 caracteres',
      'string.pattern.base': 'El RUT de la empresa no es válido',
    }),

  company_name: Joi.string()
    .trim()
    .required()
    .max(255)
    .pattern(companyNameRegex)
    .messages({
      'any.required': 'El nombre de la empresa es obligatorio',
      'string.max': 'El nombre de la empresa no puede superar los 255 caracteres',
      'string.pattern.base': 'El nombre de la empresa no debe contener caracteres especiales no permitidos',
    }),

  contact_name: Joi.string()
    .trim()
    .required()
    .max(255)
    .pattern(personNameRegex)
    .messages({
      'any.required': 'El nombre del contacto es obligatorio',
      'string.max': 'El nombre del contacto no puede superar los 255 caracteres',
      'string.pattern.base': 'El nombre del contacto no debe contener números ni caracteres especiales',
    }),

  contact_email: Joi.string()
    .trim()
    .required()
    .email()
    .max(255)
    .messages({
      'any.required': 'El email de contacto es obligatorio',
      'string.email': 'El email de contacto no es válido',
      'string.max': 'El email de contacto no puede superar los 255 caracteres',
    }),

  contact_phone: Joi.string()
    .trim()
    .required()
    .max(50)
    .pattern(phoneRegex)
    .messages({
      'any.required': 'El teléfono de contacto es obligatorio',
      'string.max': 'El teléfono de contacto no puede superar los 50 caracteres',
      'string.pattern.base':
        'El teléfono de contacto solo puede contener números y símbolos válidos (+, -, espacio, paréntesis)',
    }),

  service_description: Joi.string()
    .allow('', null)
    .max(2000)
    .messages({
      'string.max': 'La descripción del servicio no puede superar los 2000 caracteres',
    }),
});

// ---------- PARAMS (/clients/:id) ----------
export const clientIdParamsSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El id del cliente es obligatorio',
      'number.base': 'El id del cliente debe ser un número',
      'number.integer': 'El id del cliente debe ser un número entero',
      'number.positive': 'El id del cliente debe ser un entero positivo',
    }),
});

export const clientRutParamsSchema = Joi.object({
  rut: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'El rut del cliente es obligatorio',
    }),
});

// ---------- QUERY (/clients/all?...) ----------
export const clientQuerySchema = Joi.object({
  company_rut: Joi.string().trim().max(20).allow('', null),
  company_name: Joi.string().trim().max(255).allow('', null),
  contact_name: Joi.string().trim().max(255).allow('', null),
  contact_email: Joi.string().trim().max(255).allow('', null),
  contact_phone: Joi.string().trim().max(50).allow('', null),
})
  .unknown(false)
  .messages({
    'object.unknown':
      'Campo no permitido en los parámetros de consulta',
  });
