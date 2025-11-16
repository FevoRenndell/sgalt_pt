import * as yup from 'yup';

export const userValidationCreateSchema = yup.object({
  first_name: yup
    .string()
    .max(100, 'Máximo 100 caracteres')
    .required('El nombre es obligatorio'),

  last_name_1: yup
    .string()
    .max(100, 'Máximo 100 caracteres')
    .required('El primer apellido es obligatorio'),

  last_name_2: yup
    .string()
    .max(100, 'Máximo 100 caracteres')
    .nullable(),

  email: yup
    .string()
    .email('Correo electrónico inválido')
    .max(255, 'Máximo 255 caracteres')
    .required('El correo es obligatorio'),

  password: yup
    .string()
    .min(6, 'Mínimo 6 caracteres')
    .max(255, 'Máximo 255 caracteres')
    .required('La contraseña es obligatoria'),

  repeat_password: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Debe confirmar la contraseña'),

  role_id: yup
    .mixed()
    .required('El rol es obligatorio'),

  is_active: yup
    .boolean()
    .required('El estado es obligatorio'),
});

export const userValidationUpdateSchema = yup.object({
  first_name: yup
    .string()
    .max(100, 'Máximo 100 caracteres')
    .required('El nombre es obligatorio'),

  last_name_1: yup
    .string()
    .max(100, 'Máximo 100 caracteres')
    .required('El primer apellido es obligatorio'),

  last_name_2: yup
    .string()
    .max(100, 'Máximo 100 caracteres')
    .nullable(),

  email: yup
    .string()
    .email('Correo electrónico inválido')
    .max(255, 'Máximo 255 caracteres')
    .required('El correo es obligatorio'),

  // En update la password es opcional
  password: yup
    .string()
    .min(6, 'Mínimo 6 caracteres')
    .max(255, 'Máximo 255 caracteres')
    .nullable()
    .notRequired(),

  repeat_password: yup
    .string()
    .when('password', (password, schema) => {
      if (password) {
        return schema
          .required('Debe confirmar la contraseña')
          .oneOf([yup.ref('password')], 'Las contraseñas no coinciden');
      }
      return schema.nullable().notRequired();
    }),

  role_id: yup
    .mixed()
    .required('El rol es obligatorio'),

  is_active: yup
    .boolean()
    .required('El estado es obligatorio'),
});
