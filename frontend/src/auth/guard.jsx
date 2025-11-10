
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export function GuestGuard({ children }) {
  const { isAuthenticated, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return null;l
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
}

// Solo usuarios autenticados
export function AuthGuard({ children }) {
  const { isAuthenticated, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/jwt/login" state={{ from: location }} replace />;
  }

  return children;
}
