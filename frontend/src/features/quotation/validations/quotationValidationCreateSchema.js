import * as yup from 'yup';

export const quotationValidationCreateSchema = yup.object({
  items: yup
    .array()
    .of(
      yup.object({

        quantity: yup
          .number()
          .typeError('Debe ingresar una cantidad')
          .required('La cantidad es obligatoria')
          .min(1, 'La cantidad debe ser mayor a 0'),
      })
    )
    .min(1, 'Debe agregar al menos un servicio'),
});
