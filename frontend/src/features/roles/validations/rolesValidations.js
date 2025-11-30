// src/features/clients/validations/clientValidations.js
import * as yup from 'yup';

const rutRegex = /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/;

export const clientValidationAssignScheema = yup.object({
  user_id: yup
    .string()
    .trim()
    .max(20, 'Máximo 20 caracteres')
    .matches(rutRegex, 'RUT inválido')
    .required('El RUT es obligatorio'),

  role_id: yup
    .string()
    .trim()
    .max(255, 'Máximo 255 caracteres')
    .required('El nombre de la empresa es obligatorio'),
 
});

export const clientValidationUpdateSchema = clientValidationCreateSchema;
