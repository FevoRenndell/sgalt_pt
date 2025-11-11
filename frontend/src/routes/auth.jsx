import { lazy, Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { GuestGuard } from '../auth/guard';

// ----------------------------------------------------------------------

// JWT
const LoginPage    = lazy(() => import('../features/auth/pages/LoginPage'   ));

// ----------------------------------------------------------------------

const authJwt = {
  path: 'auth',
  element: (
    <GuestGuard>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: <LoginPage />,
    },
  ],
};

export const authRoutes = [authJwt];
