// src/validations/quotationRequestSchema.js
import * as yup from 'yup';

// Solo letras (con tildes) y espacios
const nameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;

const baseShape = {
  requester_full_name: yup
    .string()
    .required('El nombre del contacto es obligatorio')
    .max(255, 'El nombre del contacto no puede superar los 255 caracteres')
    .matches(
      nameRegex,
      'El nombre del contacto no debe contener números ni caracteres especiales'
    )
    .trim(),

  requester_email: yup
    .string()
    .required('El correo del contacto es obligatorio')
    .email('Correo electrónico inválido')
    .max(255, 'El correo del contacto no puede superar los 255 caracteres')
    .trim(),

  requester_phone: yup
    .string()
    .required('El teléfono de contacto es obligatorio')
    .max(20, 'El teléfono de contacto no puede superar los 20 caracteres')
    .trim(),

  service_description: yup
    .string()
    .required('La descripción del servicio es obligatoria')
    .trim(),

  obra_direccion: yup
    .string()
    .required('La dirección de la obra es obligatoria')
    .max(255, 'La dirección de la obra no puede superar los 255 caracteres')
    .trim(),

  commune_id: yup
    .number()
    .typeError('Debe seleccionar una comuna')
    .integer('La comuna debe ser un número entero')
    .positive('La comuna debe ser un ID válido')
    .required('La comuna es obligatoria'),

  city_id: yup
    .number()
    .typeError('Debe seleccionar una ciudad')
    .integer('La ciudad debe ser un número entero')
    .positive('La ciudad debe ser un ID válido')
    .required('La ciudad es obligatoria'),

  region_id: yup
    .number()
    .typeError('Debe seleccionar una región')
    .integer('La región debe ser un número entero')
    .positive('La región debe ser un ID válido')
    .required('La región es obligatoria'),
};

export const quotationRequestCreateSchema = yup
  .object()
  .shape(baseShape)
  .noUnknown(true, 'No se permiten campos adicionales');
