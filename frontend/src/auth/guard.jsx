// src/auth/guard.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const LOGIN_PATH = '/auth/login'; 
const DEFAULT_AFTER_LOGIN = '/dashboard';

function useAuthState() {
  const { token, isAuthenticated: flag, user, initialized } = useSelector(
    (state) => state.auth
  );

  return {
    token,
    user,
    isAuthenticated: !!token || !!flag,
    initialized: initialized ?? true,
  };
}

export function GuestGuard({ children }) {
  const { isAuthenticated, initialized } = useAuthState();
  const location = useLocation();

  if (!initialized) return null;

  if (isAuthenticated) {
    return (
      <Navigate
        to={DEFAULT_AFTER_LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}

export function AuthGuard({ children }) {
  const { isAuthenticated, initialized } = useAuthState();
  const location = useLocation();

  if (!initialized) return null;

  if (!isAuthenticated && location.pathname !== LOGIN_PATH) {
    return (
      <Navigate
        to={LOGIN_PATH}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}
