// src/validations/userSchema.js
import * as yup from 'yup';

// Solo letras (con tildes) y espacios, sin números ni caracteres especiales
const nameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;

const baseShape = {
  first_name: yup
    .string()
    .required('El nombre es obligatorio')
    .max(100, 'El nombre no puede superar los 100 caracteres')
    .matches(nameRegex, 'El nombre no debe contener números ni caracteres especiales'),

  last_name_1: yup
    .string()
    .required('El primer apellido es obligatorio')
    .max(100, 'El primer apellido no puede superar los 100 caracteres')
    .matches(nameRegex, 'El primer apellido no debe contener números ni caracteres especiales'),

  last_name_2: yup
    .string()
    .nullable()
    .max(100, 'El segundo apellido no puede superar los 100 caracteres')
    .matches(nameRegex, 'El segundo apellido no debe contener números ni caracteres especiales')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),

  email: yup
    .string()
    .required('El email es obligatorio')
    .email('El email no es válido')
    .max(255, 'El email no puede superar los 255 caracteres')
    .trim(),

  password_hash: yup
    .string()
    .required('La contraseña es obligatoria')
    .max(255, 'La contraseña no puede superar los 255 caracteres'),

  role_id: yup
    .number()
    .typeError('El rol debe ser un número')
    .integer('El rol debe ser un número entero')
    .positive('El rol debe ser un entero positivo')
    .required('El rol es obligatorio'),

  is_active: yup
    .boolean()
    .default(true),
};

export const createUserSchema = yup
  .object()
  .shape(baseShape)
  .noUnknown(true, 'No se permiten campos adicionales');

export const updateUserSchema = yup
  .object()
  .shape({
    first_name: yup
      .string()
      .max(100)
      .matches(nameRegex, 'El nombre no debe contener números ni caracteres especiales'),

    last_name_1: yup
      .string()
      .max(100)
      .matches(nameRegex, 'El primer apellido no debe contener números ni caracteres especiales'),

    last_name_2: yup
      .string()
      .nullable()
      .max(100)
      .matches(nameRegex, 'El segundo apellido no debe contener números ni caracteres especiales')
      .transform((value, originalValue) => (originalValue === '' ? null : value)),
    email: yup
      .string()
      .email('Email inválido')
      .max(255)
      .trim(),

    password_hash: yup
      .string()
      .max(255),

    role_id: yup
      .number()
      .integer()
      .positive(),

    is_active: yup.boolean(),
  })
  .noUnknown(true, 'No se permiten campos adicionales')
  .test(
    'at-least-one-field',
    'Debes enviar al menos un campo para actualizar',
    value => value && Object.keys(value).length > 0
  )