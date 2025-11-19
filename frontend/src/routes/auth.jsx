import { lazy } from 'react';
import { GuestGuard } from '../features/auth/components';

// AUTH PAGES (tu sistema real)
const Login = lazy(() => import('../features/auth/pages/LoginPage'));
const Register = lazy(() => import('../features/auth/pages/RegisterPage'));
const VerifyCode = lazy(() => import('../features/auth/pages/VerifyCodePage'));
const ForgetPassword = lazy(() => import('../features/auth/pages/ForgetPasswordPage'));

// AUTH DEMO — JWT (lo que SÍ usarás)
 
export const AuthRoutes = [
  // LOGIN / REGISTER reales de tu proyecto
  {
    element: <GuestGuard />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forget-password', element: <ForgetPassword /> },
      { path: 'verify-code', element: <VerifyCode /> },
    ],
  },

  // JWT DEMO
  {
    path: 'jwt',
    children: [
       <></>
    ],
  },
];
