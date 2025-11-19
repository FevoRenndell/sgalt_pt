import { useSelector } from 'react-redux';
import { useLogoutMutation } from '../../features/auth/api/authApi';

export const useAuth = () => {

  const { user, token } = useSelector((s) => s.auth);
  const [ logoutTrigger ] = useLogoutMutation();

  return {
    user,
    token,
    isAuthenticated: !!token,
    logout: async () => {
      try {
        await logoutTrigger().unwrap();
      } catch (e) {
        console.error('Error al cerrar sesión', e);
      }
    },
  };
};
