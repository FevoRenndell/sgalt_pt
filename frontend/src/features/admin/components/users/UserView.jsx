

import { Container, Card, CardContent, Box } from '@mui/material';
import UserForm from './UserForm';
import { FormProvider, RHFTextField } from '../../../../shared/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import UserTableList from './UserTableList';
import {
    usersData
} from '../../_mocks/usersData';

export default function UserView({ children }) {

    const initialValues = {
        first_name: '',
        last_name_1: '',
        last_name_2: '',
        email: '',
        password_hash: '',
        role_id: '',
        is_active: true,
    };

    const validationSchema = Yup.object({
        first_name: Yup.string()
            .max(100, 'Máximo 100 caracteres')
            .required('El nombre es obligatorio'),
        last_name_1: Yup.string()
            .max(100, 'Máximo 100 caracteres')
            .required('El primer apellido es obligatorio'),
        last_name_2: Yup.string()
            .max(100, 'Máximo 100 caracteres')
            .nullable(),
        email: Yup.string()
            .email('Correo electrónico inválido')
            .max(255, 'Máximo 255 caracteres')
            .required('El correo es obligatorio'),
        password_hash: Yup.string()
            .min(6, 'Mínimo 6 caracteres')
            .max(255, 'Máximo 255 caracteres')
            .required('La contraseña es obligatoria'),
        role_id: Yup.mixed()
            .nullable(),
        is_active: Yup.boolean()
            .required('El estado es obligatorio'),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues,
    });

    const { reset, control, trigger, handleSubmit } = methods;

    const onSubmit = async (data) => {
        console.log('Form Data:', data);
    }

    return (
        <Container>
            <Box
                sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 2,
                    mb: 2,
                    gridTemplateColumns: { xs: '1fr', sm: '1fr' },
                }}
            >
                <Card>
                    <CardContent>
                        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                            <UserForm />
                        </FormProvider>
                        <UserTableList details={usersData} />
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}