// src/features/auth/pages/LoginView.jsx
import { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useLocation } from 'react-router-dom';

import { loginSchema } from '../../validation/loginSchema';
import { FormProvider, RHFTextField } from '../../../../shared/components/hook-form';

import { useAuth } from '../../../../shared/hooks/useAuth';

export default function LoginView() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  // 👉 del ejemplo nuevo
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const methods = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password_hash: '',
      remember: true,
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const remember = watch('remember');

  const onSubmit = async (values) => {
    setServerError('');

    try {
      // 👇 usamos la misma firma lógica del ejemplo:
      // await signInWithEmail(values.email, values.password);
      await signInWithEmail(values.email, values.password_hash);

      // Si el login fue exitoso, redirigimos donde quería ir
      navigate(from, { replace: true });
    } catch (err) {
      // el hook puede lanzar error con message
      const msg =
        err?.message ||
        err?.data?.message ||
        'Error al iniciar sesión. Verifica tus credenciales.';
      setServerError(msg);
    }
  };

  const handleGoogle = async () => {
    setServerError('');
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err?.message ||
        'No se pudo iniciar sesión con Google. Intenta nuevamente.';
      setServerError(msg);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: 4,
          border: '1px solid rgba(148,163,253,0.14)',
          bgcolor: 'rgba(2,6,23,0.98)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Iniciar sesión
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontSize: 12 }}
          >
            Usa tus credenciales internas del sistema.
          </Typography>
        </Box>

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

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <RHFTextField
            name="email"
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email fontSize="small" color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="password_hash"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => setShowPassword((v) => !v)}
                    sx={{ color: 'text.secondary' }}
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              mt: 0.5,
              mb: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={!!remember}
                  onChange={(e) => setValue('remember', e.target.checked)}
                  sx={{ p: 0.5 }}
                />
              }
              label={
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                  Mantener sesión iniciada
                </Typography>
              }
            />

            <Button
              type="button"
              sx={{ p: 0, minWidth: 'auto', fontSize: 10 }}
            >
              Olvidé mi contraseña
            </Button>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 1.5, py: 1, borderRadius: 2, fontSize: 13 }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress
                  size={16}
                  sx={{ color: 'inherit', mr: 1 }}
                />
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </Button>

          {/* Opcional: botón para login con Google, igual que el ejemplo */}
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={handleGoogle}
            sx={{ mt: 1.5, py: 0.8, borderRadius: 2, fontSize: 12 }}
          >
            Ingresar con Google
          </Button>
        </FormProvider>
      </Paper>
    </Box>
  );
}
