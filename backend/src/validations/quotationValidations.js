// src/validations/quotationValidation.js
import Joi from 'joi';

// Si quieres reutilizar regex u otras constantes, las puedes importar de otro archivo

export const quotationCreateSchema = Joi.object({
  // FK hacia quotation_request.id
  request_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'La solicitud de cotización (request_id) es obligatoria',
      'number.base': 'El request_id debe ser un número',
      'number.integer': 'El request_id debe ser un número entero',
      'number.positive': 'El request_id debe ser un ID válido',
    }),
  discount: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El descuento es obligatorio',
      'number.base': 'El descuento debe ser un número',
      'number.integer': 'El descuento debe ser un número entero',
      'number.positive': 'El descuento debe ser mayor a 0',
    }),
  // Arreglo de ítems de la cotización
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.number()
          .integer()
          .positive()
          .required()
          .messages({
            'any.required': 'El servicio es obligatorio',
            'number.base': 'Debe seleccionar un servicio válido',
            'number.integer': 'El ID del servicio debe ser entero',
            'number.positive': 'El ID del servicio debe ser un número positivo',
          }),
        quantity: Joi.number()
          .integer()
          .positive()
          .required()
          .messages({
            'any.required': 'La cantidad es obligatoria',
            'number.base': 'La cantidad debe ser un número',
            'number.integer': 'La cantidad debe ser un número entero',
            'number.positive': 'La cantidad debe ser mayor a 0',
          }),
        base_price: Joi.number().allow('', null).messages({
          'number.base': 'El precio base debe ser un número',
        }),
        name: Joi.string().allow('', null).messages({
          'string.base': 'El nombre del servicio debe ser una cadena de texto',
        }),
     
      })
    )
    .min(1)
    .required()
    .messages({
      'any.required': 'Debe agregar al menos un servicio en la cotización',
      'array.base': 'Los ítems deben enviarse en un arreglo',
      'array.min': 'Debe agregar al menos un servicio en la cotización',
    }),
});
