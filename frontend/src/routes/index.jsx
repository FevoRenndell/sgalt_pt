import { lazy } from 'react';
import { Users } from './users'; 
import { AuthRoutes } from './auth';
import { DashboardRoutes } from './dashboard';
import { PATH_AFTER_LOGIN } from '../config';
import { Navigate } from 'react-router-dom';
import { Public } from './public';

export const routes = () => {
    return [

      {
        path: '/',
        element: <Navigate to={PATH_AFTER_LOGIN} replace />,
      },
      
    ...Users,
    ...AuthRoutes,
    ...DashboardRoutes,
    ...Public
  ];
};