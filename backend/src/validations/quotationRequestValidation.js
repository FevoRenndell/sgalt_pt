// src/validations/quotationRequestValidation.js
import Joi from 'joi';

// Solo letras con tildes y espacios
const nameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const companyNameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s&.,\-]+$/;
const rutRegex = /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/;
// ---------- CREATE ----------
export const quotationRequestCreateSchema = Joi.object({
  contact_name: Joi.string().trim().max(255).allow('', null),
  contact_email: Joi.string().trim().max(255).allow('', null),
  contact_phone: Joi.string().trim().max(50).allow('', null),
  company_rut: Joi.string()
    .trim()
    .max(255)
    .required()
    .messages({
      'any.required': 'El rut es obligatorio',
      'string.max': 'El rut no puede superar los 255 caracteres',
    }),
  company_name: Joi.string()
    .trim()
    .max(255)
    .required()
    .messages({
      'any.required': 'La Razón social  es obligatorio',
      'string.max': 'La Razón social no puede superar los 255 caracteres',
    }),
  requester_full_name: Joi.string()
    .trim()
    .max(255)
    .required()
    .messages({
      'any.required': 'El nombre del contacto es obligatorio',
      'string.max': 'El nombre del contacto no puede superar los 255 caracteres',
      'string.pattern.base':
        'El nombre del contacto no debe contener números ni caracteres especiales',
    }),

  requester_email: Joi.string()
    .trim()
    .email()
    .max(255)
    .required()
    .messages({
      'any.required': 'El correo del contacto es obligatorio',
      'string.email': 'Correo electrónico inválido',
      'string.max': 'El correo del contacto no puede superar los 255 caracteres',
    }),

  requester_phone: Joi.string()
    .trim()
    .max(20)
    .required()
    .messages({
      'any.required': 'El teléfono de contacto es obligatorio',
      'string.max': 'El teléfono de contacto no puede superar los 20 caracteres',
    }),

  service_description: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'La descripción del servicio es obligatoria',
    }),

  obra_direccion: Joi.string()
    .trim()
    .max(255)
    .required()
    .messages({
      'any.required': 'La dirección de la obra es obligatoria',
      'string.max': 'La dirección de la obra no puede superar los 255 caracteres',
    }),

  commune_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'La comuna es obligatoria',
      'number.base': 'Debe seleccionar una comuna',
      'number.integer': 'La comuna debe ser un número entero',
      'number.positive': 'La comuna debe ser un ID válido',
    }),

  city_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'La ciudad es obligatoria',
      'number.base': 'Debe seleccionar una ciudad',
      'number.integer': 'La ciudad debe ser un número entero',
      'number.positive': 'La ciudad debe ser un ID válido',
    }),

  region_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'La región es obligatoria',
      'number.base': 'Debe seleccionar una región',
      'number.integer': 'La región debe ser un número entero',
      'number.positive': 'La región debe ser un ID válido',
    }),

 
})

// ---------- UPDATE ----------
export const quotationRequestUpdateSchema = Joi.object({
  requester_full_name: Joi.string()
    .trim()
    .max(255)
    .pattern(nameRegex)
    .required()
    .messages({
      'any.required': 'La región es obligatoria',
      'string.max': 'El nombre del contacto no puede superar los 255 caracteres',
      'string.pattern.base':
        'El nombre del contacto no debe contener números ni caracteres especiales',

    }),

  requester_email: Joi.string()
    .trim()
    .email()
    .max(255)
     .required()
    .messages({
      'string.email': 'Correo electrónico inválido',
      'string.max': 'El correo del contacto no puede superar los 255 caracteres',
    }),

  requester_phone: Joi.string()
    .trim()
    .max(20)
     .required()
    .messages({
      'string.max': 'El teléfono de contacto no puede superar los 20 caracteres',
    }),

  service_description: Joi.string()
    .trim()
     .required()
    .messages({
      'string.base': 'La descripción debe ser texto',
    }),

  obra_direccion: Joi.string()
    .trim()
    .max(255)
     .required()
    .messages({
      'string.max': 'La dirección de la obra no puede superar los 255 caracteres',
    }),

  commune_id: Joi.number()
    .integer()
    .positive()
     .required()
    .messages({
      'number.base': 'Debe seleccionar una comuna válida',
      'number.integer': 'La comuna debe ser un número entero',
      'number.positive': 'La comuna debe ser un ID válido',
    }),

  city_id: Joi.number()
    .integer()
    .positive()
     .required()
    .messages({
      'number.base': 'Debe seleccionar una ciudad válida',
      'number.integer': 'La ciudad debe ser un número entero',
      'number.positive': 'La ciudad debe ser un ID válido',
    }),

  region_id: Joi.number()
    .integer()
    .positive()
     .required()
    .messages({
      'number.base': 'Debe seleccionar una región válida',
      'number.integer': 'La región debe ser un número entero',
      'number.positive': 'La región debe ser un ID válido',
    }),

 
})

// ---------- PARAMS ----------
export const quotationRequestIdParamsSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El ID es obligatorio',
      'number.base': 'El ID debe ser un número',
      'number.integer': 'El ID debe ser un número entero',
      'number.positive': 'El ID debe ser un entero positivo',
    }),
});

// ---------- QUERY ----------
export const quotationRequestQuerySchema = Joi.object({
  requester_full_name: Joi.string()
    .trim()
    .max(255)
    .pattern(nameRegex)
    .allow('', null)
    .messages({
      'string.max': 'El nombre no puede superar los 255 caracteres',
      'string.pattern.base': 'El nombre no debe contener números ni caracteres especiales',
    }),

  requester_email: Joi.string()
    .trim()
    .email()
    .max(255)
    .allow('', null)
    .messages({
      'string.email': 'Correo electrónico inválido',
      'string.max': 'El correo no puede superar los 255 caracteres',
    }),

 
})
  .unknown(false)
  .messages({
    'object.unknown': 'Campo no permitido en los parámetros de consulta',
  });

// ---------- PARAMS: región ----------
export const regionIdParamsSchema = Joi.object({
  regionId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El ID de la región es obligatorio',
      'number.base': 'El ID de la región debe ser un número',
      'number.integer': 'El ID de la región debe ser un número entero',
      'number.positive': 'El ID de la región debe ser un entero positivo',
    }),
});

// ---------- PARAMS: ciudad ----------
export const cityIdParamsSchema = Joi.object({
  cityId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El ID de la ciudad es obligatorio',
      'number.base': 'El ID de la ciudad debe ser un número',
      'number.integer': 'El ID de la ciudad debe ser un número entero',
      'number.positive': 'El ID de la ciudad debe ser un entero positivo',
    }),
});

// ---------- BODY: aceptar cotización ----------
export const quotationRequestAcceptSchema = Joi.object({
  quotation_request_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El ID de la solicitud de cotización es obligatorio',
      'number.base': 'El ID de la solicitud debe ser un número',
      'number.integer': 'El ID de la solicitud debe ser un número entero',
      'number.positive': 'El ID de la solicitud debe ser un entero positivo',
    }),
})
  .unknown(false)
  .messages({
    'object.unknown': 'Campo no permitido en el cuerpo de la solicitud',
  });


export const quotationRequestPublicCreateSchema = Joi.object({

  requester_full_name: Joi.string()
    .trim()
    .max(255)
    .pattern(nameRegex)
    .required()
    .messages({
      'any.required': 'El nombre del contacto es obligatorio',
      'string.max': 'El nombre del contacto no puede superar los 255 caracteres',
      'string.pattern.base':
        'El nombre del contacto no debe contener números ni caracteres especiales',
    }),

  requester_email: Joi.string()
    .trim()
    .email()
    .max(255)
    .required()
    .messages({
      'any.required': 'El correo del contacto es obligatorio',
      'string.email': 'Correo electrónico inválido',
      'string.max': 'El correo del contacto no puede superar los 255 caracteres',
    }),

  requester_phone: Joi.string()
    .trim()
    .max(20)
    .required()
    .messages({
      'any.required': 'El teléfono de contacto es obligatorio',
      'string.max': 'El teléfono de contacto no puede superar los 20 caracteres',
    }),

  service_description: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'La descripción del servicio es obligatoria',
    }),

  obra_direccion: Joi.string()
    .trim()
    .max(255)
    .required()
    .messages({
      'any.required': 'La dirección de la obra es obligatoria',
      'string.max': 'La dirección de la obra no puede superar los 255 caracteres',
    }),

  commune_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'La comuna es obligatoria',
      'number.base': 'Debe seleccionar una comuna',
      'number.integer': 'La comuna debe ser un número entero',
      'number.positive': 'La comuna debe ser un ID válido',
    }),

  city_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'La ciudad es obligatoria',
      'number.base': 'Debe seleccionar una ciudad',
      'number.integer': 'La ciudad debe ser un número entero',
      'number.positive': 'La ciudad debe ser un ID válido',
    }),

  region_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'La región es obligatoria',
      'number.base': 'Debe seleccionar una región',
      'number.integer': 'La región debe ser un número entero',
      'number.positive': 'La región debe ser un ID válido',
    }),

  company_rut: Joi.string()
    .trim()
    .max(20)
    .pattern(rutRegex)
    .messages({
      'string.max': 'El RUT de la empresa no puede superar los 20 caracteres',
      'string.pattern.base': 'El RUT de la empresa no es válido',
    }),

  company_name: Joi.string()
    .trim()
    .max(255)
    .pattern(companyNameRegex)
    .messages({
      'string.max': 'El nombre de la empresa no puede superar los 255 caracteres',
      'string.pattern.base':
        'El nombre de la empresa no debe contener caracteres especiales no permitidos',
    }),
})
 
export const quotationRequestSaveReviewSchema = Joi.object({
  competence_capacity: Joi.string()
    .valid('SI', 'NO')
    .required()
    .messages({
      'any.only': 'Debe indicar si cuenta con la competencia y capacidad necesarias',
      'any.required': 'Debe indicar si cuenta con la competencia y capacidad necesarias',
    }),

  need_subcontracting_services: Joi.string()
    .valid('SI', 'NO')
    .required()
    .messages({
      'any.only': 'Debe indicar si es necesario subcontratar los servicios',
      'any.required': 'Debe indicar si es necesario subcontratar los servicios',
    }),

  independence_issue: Joi.string()
    .valid('SI', 'NO')
    .required()
    .messages({
      'any.only': 'Debe indicar si existe problema de independencia',
      'any.required': 'Debe indicar si existe problema de independencia',
    }),

  review_notes: Joi.string()
    .trim()
    .max(1000)
    .allow('', null)
    .messages({
      'string.max': 'Las notas de revisión no pueden superar los 1000 caracteres',
    }),
});


 