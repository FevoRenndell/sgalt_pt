import { Navigate, useRoutes } from 'react-router-dom';

import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
import { usersRoutes } from './users';
 
// ----------------------------------------------------------------------

const PATH_AFTER_LOGIN = '/dashboard';

export default function Router() {

  const routes =  useRoutes([

    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },

    // Auth routes
    ...authRoutes,

    ...dashboardRoutes,

    ...usersRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/dashboard" replace /> },
  ]);

  return routes;

}
