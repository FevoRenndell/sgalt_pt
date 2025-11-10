import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('El correo es obligatorio')
    .email('Ingresa un correo válido'),
  password_hash: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(4, 'Mínimo 4 caracteres'),
  remember: yup.boolean().default(true),
});