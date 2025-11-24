import * as yup from 'yup';

export const quotationRequestValidationCreateSchema = yup.object({
  requester_full_name: yup
    .string()
    .max(255, 'Máximo 255 caracteres')
    .required('El nombre del contacto es obligatorio'),

  requester_email: yup
    .string()
    .email('Correo electrónico inválido')
    .max(255, 'Máximo 255 caracteres')
    .required('El correo del contacto es obligatorio'),

  requester_phone: yup
    .string()
    .max(20, 'Máximo 20 caracteres')
    .required('El teléfono de contacto es obligatorio'),

  service_description: yup
    .string()
    .required('La descripción del servicio es obligatoria'),

  obra_direccion: yup
    .string()
    .max(255, 'Máximo 255 caracteres')
    .required('La dirección de la obra es obligatoria'),

  commune_id: yup
    .object()
    .typeError('Debe seleccionar una comuna')
    .required('La comuna es obligatoria'),

  city_id: yup
    .object()
    .typeError('Debe seleccionar una ciudad')
    .required('La ciudad es obligatoria'),

  region_id: yup
    .object()
    .typeError('Debe seleccionar una región')
    .required('La región es obligatoria'),
});


export const quotationRequestValidationUpdateSchema = yup.object({
  requester_full_name: yup
    .string()
    .max(255, 'Máximo 255 caracteres')
    .required('El nombre del contacto es obligatorio'),

  requester_email: yup
    .string()
    .email('Correo electrónico inválido')
    .max(255, 'Máximo 255 caracteres')
    .required('El correo del contacto es obligatorio'),

  requester_phone: yup
    .string()
    .max(20, 'Máximo 20 caracteres')
    .required('El teléfono de contacto es obligatorio'),

  service_description: yup
    .string()
    .required('La descripción del servicio es obligatoria'),

  obra_direccion: yup
    .string()
    .max(255, 'Máximo 255 caracteres')
    .required('La dirección de la obra es obligatoria'),

  commune_id: yup
    .object()
    .typeError('Debe seleccionar una comuna')
    .required('La comuna es obligatoria'),

  city_id: yup
    .object()
    .typeError('Debe seleccionar una ciudad')
    .required('La ciudad es obligatoria'),

  region_id: yup
    .object()
    .typeError('Debe seleccionar una región')
    .required('La región es obligatoria'),
});
