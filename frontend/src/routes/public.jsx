import { lazy, Suspense } from 'react';
import PublicLayout from '../layouts/layout-public';
 
// ÚNICA PÁGINA DE DASHBOARD QUE QUEDA
const QuotationRequestClientCreatePage = lazy(() => import('../features/quotation/pages/QuotationRequestClientCreatePage'));
const QuotationClientPage = lazy(() => import('../features/quotation/pages/QuotationClientPage'));

export const PublicRoutes = [
  {
    path: 'public',
    element:  <PublicLayout />,
             
    children: [
      { path: '/public/solicitud-cotizacion'   , element: <QuotationRequestClientCreatePage /> },
      { path: '/public/cotizacion/:id'         , element: <QuotationClientPage /> },
    ],
  },
];
