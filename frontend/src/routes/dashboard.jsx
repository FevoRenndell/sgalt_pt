import { lazy, Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { AuthGuard } from '../auth/guard';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import DashboardLayout from '../layout/DashboardLayout';

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
    ],
  },
];