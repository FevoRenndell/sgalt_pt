// src/features/clients/pages-view/ClientCreateView.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Box, CardContent } from '@mui/material';

import { FormProvider, RHFTextField } from '../../../shared/components/hook-form';
import {
  clientValidationCreateSchema,
  clientValidationUpdateSchema,
} from '../validations/clientValidations';
import { paths } from '../../../routes/paths';
import {
  useCreateClientMutation,
  useUpdateClientMutation,
  useFetchClientByIdQuery,
} from '../api/clientApi';
import { enqueueSnackbar } from 'notistack';
import { handleApiError } from '../../../shared/utils/handleApiError';
import { useConfirmDialog } from '../../../contexts/ConfirmDialogContext';
import HeadingArea from '../../../shared/components/heading-area/HeadingArea';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from '@mui/icons-material/Send';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

export default function ClientCreateView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const confirm = useConfirmDialog();
  const isEdit = location.pathname.includes('edit');

  const initialValues = {
    company_rut: '',
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
  };

  const {
    data: clientData,
  } = useFetchClientByIdQuery(id, {
    skip: !isEdit || !id,
  });

  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(
      isEdit ? clientValidationUpdateSchema : clientValidationCreateSchema
    ),
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && clientData) {
      reset({
        company_rut: clientData.company_rut ?? '',
        company_name: clientData.company_name ?? '',
        contact_name: clientData.contact_name ?? '',
        contact_email: clientData.contact_email ?? '',
        contact_phone: clientData.contact_phone ?? '',
      });
    }
  }, [isEdit, clientData, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const ok = await confirm({
        title: isEdit ? 'Confirmar actualización' : 'Confirmar creación',
        description: isEdit
          ? `¿Deseas actualizar los datos del cliente ${values.company_name}?`
          : `¿Deseas crear el cliente ${values.company_name}?`,
        confirmText: isEdit ? 'Actualizar' : 'Crear',
        cancelText: 'Cancelar',
      });

      if (!ok) return;

      if (!isEdit) {
        await createClient(values).unwrap();
      } else {
        await updateClient({ id, ...values }).unwrap();
      }

      enqueueSnackbar(
        isEdit
          ? `Cliente actualizado: ${values.company_name}`
          : 'Cliente creado correctamente',
        {
          variant: 'success',
          autoHideDuration: 1500,
          onExited: () => navigate(paths.clients_list),
        }
      );
    } catch (err) {
      handleApiError(err);
    }
  });

  const handleClean = () => {
    if (isEdit && clientData) {
      reset({
        company_rut: clientData.company_rut ?? '',
        company_name: clientData.company_name ?? '',
        contact_name: clientData.contact_name ?? '',
        contact_email: clientData.contact_email ?? '',
        contact_phone: clientData.contact_phone ?? '',
      });
    } else {
      reset(initialValues);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <div className="pt-2 pb-4">
        <Card className="p-3">
          <Box px={2} pt={2} mb={3}>
            <HeadingArea
              title={
                isEdit
                  ? `Editar Cliente ${watch('company_name')}`
                  : 'Crear Cliente'
              }
              addButton={
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  onClick={() => navigate(paths.clients_list)}
                >
                  Volver
                </Button>
              }
              icon={<PersonAddIcon className="icon" />}
            />
          </Box>

          <CardContent>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ sm: 4, xs: 12 }}>
                <RHFTextField
                  size="small"
                  fullWidth
                  name="company_rut"
                  label="RUT Empresa"
                  sizeParam="small"
                />
              </Grid>

              <Grid size={{ sm: 8, xs: 12 }}>
                <RHFTextField
                  size="small"
                  fullWidth
                  name="company_name"
                  label="Nombre Empresa"
                  sizeParam="small"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ sm: 4, xs: 12 }}>
                <RHFTextField
                  size="small"
                  fullWidth
                  name="contact_name"
                  label="Nombre Contacto"
                  sizeParam="small"
                />
              </Grid>

              <Grid size={{ sm: 4, xs: 12 }}>
                <RHFTextField
                  size="small"
                  fullWidth
                  name="contact_email"
                  label="Correo Contacto"
                  sizeParam="small"
                />
              </Grid>

              <Grid size={{ sm: 4, xs: 12 }}>
                <RHFTextField
                  size="small"
                  fullWidth
                  name="contact_phone"
                  label="Teléfono Contacto"
                  sizeParam="small"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ pt: 3 }}>
              <Grid size={{ sm: 3, xs: 12 }}>
                <Button
                  size="small"
                  type="submit"
                  startIcon={<SendIcon />}
                  variant="outlined"
                  color="success"
                  fullWidth
                  disabled={isSubmitting || isCreating || isUpdating}
                >
                  {isEdit
                    ? isUpdating
                      ? 'Actualizando...'
                      : 'Actualizar'
                    : isCreating
                    ? 'Creando...'
                    : 'Crear Cliente'}
                </Button>
              </Grid>

              <Grid size={{ sm: 3, xs: 12 }}>
                <Button
                  size="small"
                  startIcon={<CleaningServicesIcon />}
                  variant="outlined"
                  color="warning"
                  fullWidth
                  onClick={handleClean}
                >
                  Limpiar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}
