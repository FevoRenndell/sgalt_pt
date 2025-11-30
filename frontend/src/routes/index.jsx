import { lazy } from 'react';
import { UserRoutes } from './users'; 
import { AuthRoutes } from './auth';
import { DashboardRoutes } from './dashboard';
import { PATH_AFTER_LOGIN } from '../config';
import { Navigate } from 'react-router-dom';
import { PublicRoutes } from './public';
import { QuotationRequest } from './quotationRequest';
import { QuotationRoutes } from './quotation';
import { ClientRoutes } from './client';
import { RolesRoutes } from './roles';
 
export const routes = () => {
    return [
      {
        path: '/',
        element: <Navigate to={PATH_AFTER_LOGIN} replace />,
      },

    ...AuthRoutes,
    ...UserRoutes,
    ...RolesRoutes,
    ...PublicRoutes,
    ...ClientRoutes,
    ...QuotationRoutes,
    ...DashboardRoutes,
    ...QuotationRequest,

  ];
};