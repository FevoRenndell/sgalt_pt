import { useSelector } from "react-redux";

export function useAuthState() {
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