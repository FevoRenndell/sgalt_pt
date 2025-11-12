import { CardHeader, Card, CardContent, Box } from '@mui/material';
import { RHFSelect, RHFTextField } from '../../../../shared/components/hook-form';

export default function UserForm() {
  return (
    <Card>
      <CardHeader title="Formulario de Usuario" />
      <CardContent>
        <Box
          sx={{
            display: 'grid',
            columnGap: 2,
            rowGap: 2,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)' },
            mt: 1,
          }}
        >
          <RHFTextField key="first_name" name="first_name" label="Nombre" type="text" />
          <RHFTextField key="last_name_1" name="last_name_1" label="Primer Apellido" type="text" />
          <RHFTextField key="last_name_2" name="last_name_2" label="Segundo Apellido" type="text" />
          <RHFTextField key="email" name="email" label="Correo Electrónico" type="email" />
          <RHFTextField key="password_hash" name="password_hash" label="Contraseña" type="password" />
          <RHFSelect key="role_id" name="role_id" label="Rol" options={[]} />
          <RHFSelect
            key="is_active"
            name="is_active"
            label="Estado"
            options={[
              { value: true, label: 'Activo' },
              { value: false, label: 'Inactivo' },
            ]}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
