import { lazy, Suspense } from 'react';
import LayoutV1 from '../layouts/layout-1';
import LayoutV2 from '../layouts/layout-2';
import { AuthGuard } from '../features/auth/components';
import { LoadingProgress } from '../shared/components/loader';
import { useSettings } from '../shared/hooks/useSettings';

// ÚNICA PÁGINA DE DASHBOARD QUE QUEDA
const QuotationPage = lazy(() => import('../features/quotation/pages/QuotationPage'));
const QuotationCreatePage = lazy(() => import('../features/quotation/pages/QuotationCreatePage'));

const ActiveLayout = () => {
  const { settings } = useSettings();

  return (
    <AuthGuard>
      <Suspense fallback={<LoadingProgress />}>
        {settings?.activeLayout === 'layout2' ? <LayoutV2 /> : <LayoutV1 />}
      </Suspense>
    </AuthGuard>
  );
};

export const Quotation = [
  {
    path: 'quotation',
    element: <ActiveLayout />,
    children: [
      { path: '/quotation/list'    , element: <QuotationPage          /> },
      { path: '/quotation/create'  , element: <QuotationCreatePage    /> },
      { path: '/quotation/:id/quotation_create' , element: <QuotationCreatePage /> },
    ],
  },
];
