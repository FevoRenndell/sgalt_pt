import { Navigate, useLocation } from 'react-router';
 
import { PATH_AFTER_LOGIN } from '../../../config';
import { useAuthState } from '../../hooks/useAuthState';
 

/**
 * AuthGuard - PROTECTS ROUTES THAT REQUIRE AUTHENTICATION
 * REDIRECTS UNAUTHENTICATED USERS TO THE LOGIN PAGE WITH THE CURRENT PATH SAVED
 */


export function AuthGuard({ children }) {
  const { isAuthenticated, initialized } = useAuthState();
  const pathname = useLocation();

  if (!initialized) return null;
  if (isAuthenticated) return <>{children}</>;

  if (!isAuthenticated && location.pathname !== PATH_AFTER_LOGIN) {
    return (
      <Navigate
        to={PATH_AFTER_LOGIN}
        state={{ from: pathname }}
        replace
      />
    );
  }
}
