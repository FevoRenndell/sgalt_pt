import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { FormProvider, RHFSelect, RHFTextField } from '../../../../shared/components/hook-form';
import { CardContent, CardHeader } from '@mui/material';
import { userValidationCreateSchema } from '../../validations/usersValidations';
import { paths } from '../../../../routes/paths';
import { useCreateUserMutation, useUpdateUserMutation, useFetchUserByIdQuery } from '../../api/userApi';
import { useFetchUsersFiltersQuery } from '../../api/filterApi';
import { useEffect, useState } from 'react';

// ---------------- COMPONENT ----------------
export default function UserCreateView() {

    let { id } = useParams();
    let location = useLocation();
     const navigate = useNavigate();

    const isEdit = location.pathname.includes('edit');

    const { data: options, isLoading } = useFetchUsersFiltersQuery();

    const {
        data: userData ,
        isLoading : isUserLoading,
        error,
    } = useFetchUserByIdQuery(id, {
        skip: !isEdit || !id,      
    });

    const [createUser, { isLoading: isCreating, error: createError }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating, error: updateError }] = useUpdateUserMutation();
 
    const initialValues = {
        first_name: '',
        last_name_1: '',
        last_name_2: '',
        role_id: null,
        is_active: null,
        email: '',
        password: '',
        repeat_password: '',
    };
    

    const [ values , setValues ] = useState(userData || initialValues);

    const methods = useForm({
        defaultValues: values,
        resolver: yupResolver(userValidationCreateSchema),
    });

    useEffect(() => {
        if(isEdit && userData){
            setValues(userData);
            methods.reset(userData);
        }
    }, [isEdit, userData, methods]);

    const { isSubmitting, handleSubmit } = methods;

    const handleFormSubmit = handleSubmit((values) => {
        if(!isEdit){
            createUser(values);
        }else{
            updateUser({ id, ...values });
        }
    });

    const handleGoBack = () => {
        navigate(paths.users_list);
    }

    return (
        <FormProvider methods={methods} onSubmit={handleFormSubmit}>
            <Card>
                <CardHeader title={isEdit ? "Editar Usuario" : "Crear Usuario"} />
                <CardContent>
                    <div className="pt-2 pb-4">

                        <Card className="p-3">

                            <Grid container spacing={3}>
                                <Grid size={{ sm: 4, xs: 12 }}>
                                    <RHFTextField fullWidth name="first_name" label="Nombre" />
                                </Grid>
                                <Grid size={{ sm: 4, xs: 12 }}>
                                    <RHFTextField fullWidth name="last_name_1" label="Apellido Paterno" />
                                </Grid>
                                <Grid size={{ sm: 4, xs: 12 }}>
                                    <RHFTextField fullWidth name="last_name_2" label="Apellido Materno" />
                                </Grid>
                            </Grid>

                            <Grid container spacing={3} sx={{ mt: 2 }}>
                                <Grid size={{ sm: 6, xs: 12 }}>
                                    <RHFSelect fullWidth name="role_id" label="Rol" options={options?.roles || []} />
                                </Grid>

                                <Grid size={{ sm: 6, xs: 12 }}>
                                    <RHFSelect fullWidth name="is_active" label="Activo" options={options?.state || []} />
                                </Grid>
                            </Grid>

                            <Grid container spacing={3} sx={{ mt: 2 }}>
                                <Grid size={{ sm: 4, xs: 12 }}>
                                    <RHFTextField fullWidth name="email" label="Email" />
                                </Grid>

                                <Grid size={{ sm: 4, xs: 12 }}>
                                    <RHFTextField fullWidth name="password" label="Password" />
                                </Grid>

                                <Grid size={{ sm: 4, xs: 12 }}>
                                    <RHFTextField fullWidth name="repeat_password" label="Repita Contraseña" />
                                </Grid>
                            </Grid>

                            <Grid container spacing={3} sx={{ pt: 3 }}>
                                <Grid size={{ sm: 4, xs: 12 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        loading={isSubmitting}
                                    >
                                        Crear Usuario
                                    </Button>
                                </Grid>
                                <Grid size={{ sm: 1, xs: 12 }}>
                                    <Button
    
                                        variant="contained"
                                        fullWidth
                                        onClick={handleGoBack}
                                    >
                                        Volver
                                    </Button>
                                </Grid>
                            </Grid>

                        </Card>

                    </div>
                </CardContent>

            </Card>   </FormProvider>
    );
}
