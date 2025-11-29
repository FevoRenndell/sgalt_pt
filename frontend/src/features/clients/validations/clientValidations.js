// src/features/clients/validations/clientValidations.js
import * as yup from 'yup';

const rutRegex = /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/;

export const clientValidationCreateSchema = yup.object({
  company_rut: yup
    .string()
    .trim()
    .max(20, 'Máximo 20 caracteres')
    .matches(rutRegex, 'RUT inválido')
    .required('El RUT es obligatorio'),

  company_name: yup
    .string()
    .trim()
    .max(255, 'Máximo 255 caracteres')
    .required('El nombre de la empresa es obligatorio'),

  contact_name: yup
    .string()
    .trim()
    .max(255, 'Máximo 255 caracteres')
    .nullable(),

  contact_email: yup
    .string()
    .trim()
    .email('Correo electrónico inválido')
    .max(255, 'Máximo 255 caracteres')
    .nullable()
    .notRequired(),

  contact_phone: yup
    .string()
    .trim()
    .max(50, 'Máximo 50 caracteres')
    .nullable()
    .notRequired(),
});

export const clientValidationUpdateSchema = clientValidationCreateSchema;
