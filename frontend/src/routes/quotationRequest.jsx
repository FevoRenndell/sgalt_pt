import { lazy, Suspense } from 'react';
import LayoutV1 from '../layouts/layout-1';
import LayoutV2 from '../layouts/layout-2';
import { AuthGuard } from '../features/auth/components';
import { LoadingProgress } from '../shared/components/loader';
import { useSettings } from '../shared/hooks/useSettings';

// ÚNICA PÁGINA DE DASHBOARD QUE QUEDA
const QuotationRequestPage = lazy(() => import('../features/quotation/pages/QuotationRequestPage'));
const QuotationRequestCreatePage = lazy(() => import('../features/quotation/pages/QuotationRequestCreatePage'));

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

export const QuotationRequest = [
  {
    path: 'quotation_request',
    element: <ActiveLayout />,
    children: [
      { path: '/quotation_request/list'    , element: <QuotationRequestPage          /> },
      { path: '/quotation_request/create'  , element: <QuotationRequestCreatePage    /> },
    ],
  },
];
