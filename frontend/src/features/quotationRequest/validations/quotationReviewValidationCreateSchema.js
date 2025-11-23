
import * as yup from 'yup';

export const quotationReviewValidationCreateSchema = yup.object({
  competence_capacity: yup
    .string()
    .max(2, 'Máximo 2 caracteres')
    .required('Debe seleccionar una opción'),

  need_subcontracting_services: yup
    .string()
    .max(2, 'Máximo 2 caracteres')
    .required('Debe seleccionar una opción'),

  independence_issue: yup
    .string()
    .max(2, 'Máximo 2 caracteres')
    .required('Debe seleccionar una opción'),
});
 