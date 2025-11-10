import { Navigate, useRoutes } from 'react-router-dom';

import { authRoutes } from './auth';
 
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

    // No match 404
    { path: '*', element: <Navigate to="/login" replace /> },
  ]);

  return routes;

}
