import { lazy, Suspense } from 'react';
import {  GuestGuard } from '../features/auth/components';
import PublicLayout from '../layouts/layout-public';
 

// ÚNICA PÁGINA DE DASHBOARD QUE QUEDA
const CreateQuoterPage = lazy(() => import('../features/quotes/pages/CreateQuoterPage'));

export const Public = [
  {
    path: 'public',
    element: <GuestGuard>
                <PublicLayout />
             </GuestGuard>,
    children: [
      { path: '/public/solicitud-cotizacion'     , element: <CreateQuoterPage /> },

    ],
  },
];
