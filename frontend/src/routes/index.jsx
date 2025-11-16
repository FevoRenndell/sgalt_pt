import { lazy } from 'react';
import { Users } from './users'; 
import { AuthRoutes } from './auth';
import { DashboardRoutes } from './dashboard';
import { PATH_AFTER_LOGIN } from '../config';
import { Navigate } from 'react-router-dom';

// GLOBAL ERROR PAGE
// const ErrorPage = lazy(() => import('../pages/error/404'));

export const routes = () => {
  return [

    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },
    
  ...Users,
  // AUTHENTICATION PAGES ROUTES & DIFFERENT AUTH DEMO PAGES ROUTES
  ...AuthRoutes,
  // INSIDE DASHBOARD PAGES ROUTES
  ...DashboardRoutes,
  // PAGES ROUTES
];
};