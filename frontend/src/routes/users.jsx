import { lazy, Suspense } from 'react';
import LayoutV1 from '../layouts/layout-1';
import LayoutV2 from '../layouts/layout-2';
import { AuthGuard } from '../features/auth/components';
import { LoadingProgress } from '../shared/components/loader';
import { useSettings } from '../shared/hooks/useSettings';

// ÚNICA PÁGINA DE DASHBOARD QUE QUEDA
const UserPage = lazy(() => import('../features/admin/pages/UserPage'));
const UserCreatePage = lazy(() => import('../features/admin/pages/CreateUserPage'));

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

export const UserRoutes = [
  {
    path: 'admin',
    element: <ActiveLayout />,
    children: [
      { path: 'users/list'     , element: <UserPage       /> },
      { path: 'users/create'   , element: <UserCreatePage /> },
      { path: 'users/:id/edit' , element: <UserCreatePage /> },
    ],
  },
];
