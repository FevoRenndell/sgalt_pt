import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
 
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { CardContent, CardHeader, Snackbar } from '@mui/material';

// CUSTOM
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField } from '../../../../shared/components/hook-form';
import { userValidationCreateSchema, userValidationUpdateSchema } from '../../validations/usersValidations';
import { paths } from '../../../../routes/paths';
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useFetchUserByIdQuery,
} from '../../api/userApi';
import { useFetchUsersFiltersQuery } from '../../api/filterApi';
import { enqueueSnackbar } from 'notistack';
import { handleApiError } from '../../../../shared/utils/handleApiError';
import { useConfirmDialog } from '../../../../contexts/ConfirmDialogContext';

// ---------------- COMPONENT ----------------
export default function UserCreateView() {

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialValues = {
    first_name: '',
    last_name_1: '',
    last_name_2: '',
    role: null,
    is_active: false,
    email: '',
    password_hash: '',
    repeat_password: '',
  };
 
  const confirm = useConfirmDialog();

  const isEdit = location.pathname.includes('edit');

  const { data: options } = useFetchUsersFiltersQuery();

  const {
    data: userData,
    isLoading: isUserLoading,
    error,
  } = useFetchUserByIdQuery(id, {
    skip: !isEdit || !id,
  });

  const [createUser, { isLoading: isCreating, error: createError }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating, error: updateError }] = useUpdateUserMutation();

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(isEdit ? userValidationUpdateSchema : userValidationCreateSchema),
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isValid },
  } = methods;

  useEffect(() => {
    if (isEdit && userData) {
      reset({
        first_name: userData.first_name ?? '',
        last_name_1: userData.last_name_1 ?? '',
        last_name_2: userData.last_name_2 ?? '',
        role: userData.role ?? null,
        is_active: userData.is_active ?? null,
        email: userData.email ?? '',
        password_hash: '',
        repeat_password: '',
      });
    }
  }, [isEdit, userData, reset]);


  const onSubmit = handleSubmit(async (values) => {

    const { role, ...rest } = values;

    const data = {
      ...rest,
      role_id: role?.id,   // aquí ya metes solo el id
    };

    try {

      const ok = await confirm({
        title: isEdit ? 'Confirmar actualización' : 'Confirmar creación',
        description: `¿Deseas ${isEdit ? `actualizar los cambios de ${userData.first_name} ${userData.last_name_1}` : `crear este nuevo ${values.first_name} ${values.last_name_1}`} usuario?`,
        confirmText: isEdit ? 'Actualizar' : 'Crear',
        cancelText: 'Cancelar',
      });

      if (!ok) {
        return;
      }

      if (!isEdit) {
        await createUser(data).unwrap();
      } else {
        await updateUser({ id, ...data }).unwrap();
      }

      enqueueSnackbar(
        isEdit ? `Usuario actualizado ${values.first_name}` : 'Usuario creado',
        {
          variant: 'success',
          autoHideDuration: 1500,
          onExited: () => {
            navigate(paths.users_list);
          }
        }
      );

    } catch (err) {
      handleApiError(err);
    }
  });

  const handleGoBack = () => {
    navigate(paths.users_list);
  };

  const handleDelete = async () => {
    try {
      const ok = await confirm({
        title: 'Confirmar eliminación',
        description: `¿Deseas eliminar el usuario ${userData.first_name} ${userData.last_name_1}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'error',
      });
      if (!ok) {
        return;
      }
      // Aquí iría la lógica para eliminar el usuario
      enqueueSnackbar('Usuario eliminado', { variant: 'info', autoHideDuration: 1500 });
      navigate(paths.users_list);
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader title={isEdit ? `Editar Usuario ${watch('first_name')}` : 'Crear Usuario'}
          action={
            <RHFSwitch
              fullWidth
              name="is_active"
              label="Activo"
              options={options?.state || []}
              sizeParam="small"
            />
          }
        />
        <CardContent sx={{ pt: 0 , pl:10, pr:10}}>
          <div className="pt-2 pb-4">
            <Card className="p-3">
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid size={{ sm: 6, xs: 12 }}>
                  <RHFSelect
                    fullWidth
                    name="role"
                    label="Rol"
                    options={options?.roles || []}
                    sizeParam="small"
                  />
                </Grid>
                <Grid size={{ sm: 6, xs: 12 }}>
                  <RHFTextField  size='small' fullWidth name="email" label="Email" sizeParam="small" />
                </Grid>


              </Grid>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid size={{ sm: 4, xs: 12 }}>
                  <RHFTextField  size='small' fullWidth name="first_name" label="Nombre" sizeParam="small" />
                </Grid>
                <Grid size={{ sm: 4, xs: 12 }}>
                  <RHFTextField
                    fullWidth
                     size='small'
                    name="last_name_1"
                    label="Apellido Paterno"
                    sizeParam="small"
                  />
                </Grid>
                <Grid size={{ sm: 4, xs: 12 }}>
                  <RHFTextField
                    size='small'
                    fullWidth
                    name="last_name_2"
                    label="Apellido Materno"
                    sizeParam="small"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ mt: 2 }}>

                <Grid size={{ sm: 6, xs: 12 }}>
                  <RHFTextField  size='small' fullWidth name="password_hash" label="Password" sizeParam="small" />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                  <RHFTextField
                    fullWidth
                     size='small'
                    name="repeat_password"
                    label="Repita Contraseña"
                    sizeParam="small"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ pt: 3 }}>
                <Grid size={{ sm: 3, xs: 12 }}>
                  <Button
                    size='small'
                    type="submit"
                    
                    variant="outlined"
                    outlined={true}
                    color="success"
                    fullWidth
                    disabled={isSubmitting || isCreating || isUpdating}
                  >
                    {isEdit ? 'Actualizar Usuario' : 'Crear Usuario'}
                  </Button>
                </Grid>
                {isEdit ? (
                  <Grid size={{ sm: 3, xs: 12 }}>

                    <Button
                      size='small'
                      variant="outlined"
                      fullWidth
                      color="error"
                      disabled={isSubmitting || isCreating || isUpdating}
                      onClick={handleDelete}
                    >
                      Eliminar usuario
                    </Button>
                  </Grid>
                ) : null}

                <Grid size={{ sm: 1, xs: 12 }}>
                  <Button size='small' variant="outlined" color="primary" fullWidth onClick={handleGoBack}>
                    Volver
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
