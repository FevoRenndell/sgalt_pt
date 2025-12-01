import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { logout, setCredentials } from "../slice/authSlice";
import { useMeMutation } from "../api/authApi";

/**
 * useAuthState
 * --------------------------------------------------------------
 * Este hook maneja la sesión real del usuario.
 *
 * - Lee el token y usuario desde Redux.
 * - Si existe un token, llama a /auth/me para verificar que siga siendo válido.
 * - Si la verificación falla (token expirado o inválido), se hace logout.
 * - Si es válida, actualiza los datos del usuario.
 *
 * También controla "initialized", para que AuthGuard sepa cuándo
 * la verificación terminó y así evitar redirecciones antes de tiempo.
 * --------------------------------------------------------------
 */

export function useAuthState() {
  const dispatch = useDispatch();

  const { token, user, isAuthenticated: flag } = useSelector(
    (state) => state.auth
  );

  const [initialized, setInitialized] = useState(false);

 const [me] = useMeMutation();

useEffect(() => {
  async function verifyToken() {
    if (!token) {
      setInitialized(true);
      return;
    }

    try {
      const { user: meUser } = await me().unwrap();
      dispatch(
        setCredentials({
          token : token,
          user: meUser,
        })
      );
    } catch (error) {
     if (error?.status === 401 || error?.status === 403) {
        dispatch(logout());
     }
    } finally {
      setInitialized(true);
    }
  }

  verifyToken();
}, [
  token,   
  me,        
  dispatch,  
  setInitialized,
]);

  return {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    initialized,
  };
}
