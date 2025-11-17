import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useConfirmDialog } from '../../../../contexts/ConfirmDialogContext';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { CardContent, CardHeader } from '@mui/material';

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
 const watchedValues = watch();
  const onSubmit = handleSubmit(async (values) => {

   

    console.log(watchedValues)

    const { role, ...rest } = values;

    const data = {
      ...rest,
      role_id: role?.id,   // aquí ya metes solo el id
    };

    try {

      const ok = await confirm({
        title: isEdit ? 'Confirmar actualización' : 'Confirmar creación',
        description: `¿Deseas ${ isEdit ? 'actualizar los cambios de' : 'crear este nuevo'} usuario?`,
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
      console.error('Error en la mutación', err);
    }
  });

  const handleGoBack = () => {
    navigate(paths.users_list);
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
        <CardContent>
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
                  <RHFTextField fullWidth name="email" label="Email" sizeParam="small" />
                </Grid>


              </Grid>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid size={{ sm: 4, xs: 12 }}>
                  <RHFTextField fullWidth name="first_name" label="Nombre" sizeParam="small" />
                </Grid>
                <Grid size={{ sm: 4, xs: 12 }}>
                  <RHFTextField
                    fullWidth
                    name="last_name_1"
                    label="Apellido Paterno"
                    sizeParam="small"
                  />
                </Grid>
                <Grid size={{ sm: 4, xs: 12 }}>
                  <RHFTextField
                    fullWidth
                    name="last_name_2"
                    label="Apellido Materno"
                    sizeParam="small"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ mt: 2 }}>

                <Grid size={{ sm: 6, xs: 12 }}>
                  <RHFTextField fullWidth name="password_hash" label="Password" sizeParam="small" />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                  <RHFTextField
                    fullWidth
                    name="repeat_password"
                    label="Repita Contraseña"
                    sizeParam="small"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ pt: 3 }}>
                <Grid size={{ sm: 3, xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting || isCreating || isUpdating}
                  >
                    {isEdit ? 'Actualizar Usuario' : 'Crear Usuario'}
                  </Button>
                </Grid>
                <Grid size={{ sm: 3, xs: 12 }}>
                  {isEdit ? (
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={isSubmitting || isCreating || isUpdating}
                    >
                      Eliminar usuario
                    </Button>
                  ) : null}
                </Grid>
                <Grid size={{ sm: 1, xs: 12 }}>
                  <Button variant="contained" fullWidth onClick={handleGoBack}>
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
