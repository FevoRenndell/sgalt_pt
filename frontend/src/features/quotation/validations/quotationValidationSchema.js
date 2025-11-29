import * as yup from 'yup';

export const quotationValidationSchema = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        service_id: yup
          .number()
          .typeError('Debe seleccionar un servicio')
          .required('Debe seleccionar un servicio')
          .nullable(false),

        quantity: yup
          .number()
          .typeError('Debe ingresar una cantidad')
          .required('La cantidad es obligatoria')
          .min(1, 'La cantidad debe ser mayor a 0'),

        unit_price: yup
          .number()
          .typeError('Debe ingresar un precio')
          .required('El precio es obligatorio')
          .min(1, 'El precio debe ser mayor a 0'),

        total: yup.number().nullable(),
      })
    )
    .min(1, 'Debe agregar al menos un servicio'),
});
