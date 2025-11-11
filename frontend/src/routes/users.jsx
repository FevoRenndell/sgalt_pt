import { lazy, Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { AuthGuard } from '../auth/guard';
import UserPage from '../features/admin/pages/UserPage';
import DashboardLayout from '../layout/DashboardLayout';
 
// ----------------------------------------------------------------------

export const usersRoutes = [
  {
    path: '/',
    element: (
      <AuthGuard>
         <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: 'users', element: <UserPage /> },
    ],
  },
];