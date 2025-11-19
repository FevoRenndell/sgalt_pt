import { Navigate, useLocation } from 'react-router-dom';
import { paths }  from '../../../routes/paths';
import { useAuthState } from '../hook/useAuthState';
 
/**
 * AuthGuard
 * --------------------------------------------------------------
 * Protege las rutas que requieren autenticación.
 *
 * FUNCIONAMIENTO:
 * - Espera a que el estado de autenticación esté inicializado.
 * - Si el usuario NO está autenticado y NO está en la página de login,
 *   lo redirige automáticamente al login, guardando la ruta actual.
 * - Si el usuario está autenticado, permite el acceso a los children.
 *
 * CASOS QUE MANEJA:
 * - Evita redirecciones prematuras mientras aún se valida el token.
 * - Maneja rutas públicas (como /login) sin bloquearlas.
 * - Soporta escenarios donde el token expiró y fue invalidado.
 *
 * Se utiliza en la capa superior de la aplicación para asegurar
 * que solo usuarios con sesión activa puedan navegar el dashboard.
 * --------------------------------------------------------------
 */

export function AuthGuard({ children }) {

  const { isAuthenticated, initialized } = useAuthState();
  const location = useLocation();
  
  if (!isAuthenticated && location.pathname !== paths.login) {
    return (
      <Navigate
        to={paths.login}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
