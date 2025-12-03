import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENT
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// CUSTOM LAYOUT COMPONENT
import Layout from '../../../../layouts/Layout';
// CUSTOM COMPONENTS
import { Link } from '../../../../shared/components/link';
import { FlexBetween, FlexBox } from '../../../../shared/components/Flexbox';
import { loginSchema } from '../../validation/loginSchema';
import { FormProvider, RHFTextField } from '../../../../shared/components/hook-form';
import { useLoginMutation } from '../../api/authApi';
import { useDispatch } from "react-redux";
import { setCredentials } from '../../slice/authSlice';

export default function LoginPageView() {

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [login, { isLoading }] = useLoginMutation();

  const initialValues = {
    email: '',
    password_hash: '',
    remember: true,
  };

  const dispatch = useDispatch();

  const methods = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: initialValues,
  });


  const {
    watch,
    setValue,
    handleSubmit,
    formState: {
      isSubmitting,
      isValid
    }
  } = methods;

  const remember = watch('remember');

  const handleFormSubmit = handleSubmit(async values => {
    setServerError('');

    try {

      const data = await login({
        email: values.email,
        password_hash: values.password_hash,
        remember,
      }).unwrap();

      dispatch(
        setCredentials({
          token: data.token,
          user: data.user || null,
         //  remember: arg.remember,
        }),
      );

    } catch (err) {
      console.log(err)
      const msg =
        err?.data?.message ||
        err?.error ||
        'Error al iniciar sesión. Verifica tus credenciales.';
      setServerError(msg);
    }
  });

  return <Layout login>
    <Box maxWidth={550} p={4}>
      <Typography variant="h4" fontWeight={600} fontSize={{
        sm: 30,
        xs: 25
      }}>
        Autenticación de Usuario
      </Typography>

 

      {serverError && (
        <Box
          sx={{
            mb: 2,
            p: 1.2,
            borderRadius: 2,
            bgcolor: 'rgba(248,113,113,0.06)',
            border: '1px solid rgba(248,113,113,0.4)',
          }}
        >
          <Typography variant="caption" sx={{ color: '#fecaca' }}>
            {serverError}
          </Typography>
        </Box>
      )}

      <FormProvider methods={methods} onSubmit={handleFormSubmit}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="body1" fontSize={16} mb={1.5}>
              Ingrese su correo electrónico
            </Typography>

            <RHFTextField fullWidth name="email" placeholder="Ingrese su correo electrónico de trabajo" />
          </Grid>

          <Grid size={12}>
            <RHFTextField fullWidth placeholder="Contraseña" type={showPassword ? 'text' : 'password'} name="password_hash" slotProps={{
              input: {
                endAdornment: <ButtonBase disableRipple disableTouchRipple onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </ButtonBase>
              }
            }} />

            <FlexBetween my={1}>
              <FlexBox alignItems="center" gap={1}>
                <Checkbox sx={{
                  p: 0
                }} name="remember" checked={watch('remember')} onChange={e => setValue('remember', e.target.checked)} />
                <Typography variant="body2" fontWeight={500}>
                  Recuérdame
                </Typography>
              </FlexBox>

        
            </FlexBetween>
          </Grid>

          <Grid size={12}>
            <Button fullWidth type="submit" variant="contained" disabled={!isValid} loading={isSubmitting}>
              Iniciar Sesión
            </Button>
          </Grid>
        </Grid>
      </FormProvider>



    </Box>
  </Layout>;
}