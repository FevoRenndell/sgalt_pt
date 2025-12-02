/**
 * GuestGuard - PREVENTS AUTHENTICATED USERS FROM ACCESSING GUEST-ONLY ROUTES
 * REDIRECTS AUTHENTICATED USERS TO THEIR PREVIOUS LOCATION OR /DASHBOARD
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthState } from "../../../features/auth/hook/useAuthState";

export function GuestGuard({ children }) {

  const { state } = useLocation();

  const { isAuthenticated } = useAuthState();

  const locationState = state;
  const redirectPath =   '/dashboard/general_performance';
 
  if (isAuthenticated) {
    return <Navigate replace to={redirectPath} />;
  }

  return children || <Outlet />;
}
