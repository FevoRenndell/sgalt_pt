import { lazy, Suspense } from 'react';
import LayoutV1 from '../layouts/layout-1';
import LayoutV2 from '../layouts/layout-2';
import { AuthGuard } from '../features/auth/components';
import { LoadingProgress } from '../shared/components/loader';
import { useSettings } from '../shared/hooks/useSettings';

// Lazy pages
const ClientListPage   = lazy(() => import('../features/clients/pages/ClientListPage'));
const ClientCreatePage = lazy(() => import('../features/clients/pages/CreateClientPage'));
const ClientEditPage   = lazy(() => import('../features/clients/pages/CreateClientPage')); // reutiliza la misma

// Layout activo
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

export const Client = [
  {
    path: 'clients',
    element: <ActiveLayout />,
    children: [
      { path: '/clients/list', element: <ClientListPage /> },
      { path: '/clients/create', element: <ClientCreatePage /> },
      { path: '/clients/edit/:id', element: <ClientEditPage /> },
    ],
  },
];
