import { lazy, Suspense } from 'react';
import LayoutV1 from '../layouts/layout-1';
import LayoutV2 from '../layouts/layout-2';
import { AuthGuard } from '../features/auth/components';
import { LoadingProgress } from '../shared/components/loader';
import { useSettings } from '../shared/hooks/useSettings';

// ÚNICA PÁGINA DE DASHBOARD QUE QUEDA
const RolePage = lazy(() => import('../features/roles/pages/RolesPage'));
const RoleCreatePage = lazy(() => import('../features/roles/pages/RolesCreatePage'));

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

export const RolesRoutes = [
  {
    path: 'roles',
    element: <ActiveLayout />,
    children: [
      { path: '/roles/list'     , element: <RolePage       /> },
      { path: '/roles/create'   , element: <RoleCreatePage /> },
      { path: '/roles/:id/edit' , element: <RoleCreatePage /> },
    ],
  },
];
