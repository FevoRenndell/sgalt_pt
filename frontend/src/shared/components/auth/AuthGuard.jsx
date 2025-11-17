import { Navigate, useLocation } from 'react-router';
 
import { paths }  from '../../../routes/paths';
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

  if (!isAuthenticated && location.pathname !== paths.login) {
    return (
      <Navigate
        to={paths.login}
        state={{ from: pathname }}
        replace
      />
    );
  }
}
