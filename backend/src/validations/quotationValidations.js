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

  // Arreglo de ítems de la cotización
  items: Joi.array()
    .items(
      Joi.object({
        service_id: Joi.number()
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

        unit_price: Joi.number()
          .precision(2)
          .min(0)
          .required()
          .messages({
            'any.required': 'El valor unitario es obligatorio',
            'number.base': 'El valor unitario debe ser un número',
            'number.min': 'El valor unitario no puede ser negativo',
          }),

        total: Joi.number()
          .precision(2)
          .min(0)
          .required()
          .messages({
            'any.required': 'El total es obligatorio',
            'number.base': 'El total debe ser un número',
            'number.min': 'El total no puede ser negativo',
          }),

        is_active: Joi.boolean()
          .default(true)
          .messages({
            'boolean.base': 'El estado del ítem debe ser verdadero o falso',
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
