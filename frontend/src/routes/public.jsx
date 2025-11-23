import { lazy, Suspense } from 'react';
import {  GuestGuard } from '../features/auth/components';
import PublicLayout from '../layouts/layout-public';
 

// ÚNICA PÁGINA DE DASHBOARD QUE QUEDA
const QuotationRequestClientCreatePage = lazy(() => import('../features/quotationRequest/pages/QuotationRequestClientCreatePage'));

export const Public = [
  {
    path: 'public',
    element: <GuestGuard>
                <PublicLayout />
             </GuestGuard>,
    children: [
      { path: '/public/solicitud-cotizacion'     , element: <QuotationRequestClientCreatePage /> },

    ],
  },
];
