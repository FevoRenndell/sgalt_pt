// src/contexts/AuthContext.jsx
import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from 'react';

import { LoadingProgress } from '../shared/components/loader';
import axios from '@/utils/axios'; // ajusta la ruta si es distinta

// ===================== STATE =====================

const initialAuthState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        isInitialized: true,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
      };

    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    default:
      return state;
  }
};

// ===================== HELPERS =====================

const setSession = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ===================== CONTEXT =====================

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  // --------- LOGIN (contra tu API JWT) ---------
  const login = useCallback(async (email, password) => {
    // ajusta los nombres si tu backend espera password_hash u otro
    const { data } = await axios.post('/auth/login', { email, password });

    // data.token y data.user son ejemplo; usa la estructura que devuelva tu backend
    const { token, user } = data;

    setSession(token);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
        isAuthenticated: true,
      },
    });
  }, []);

  // --------- LOGOUT ---------
  const logout = useCallback(() => {
    setSession(null);

    dispatch({
      type: 'LOGOUT',
      payload: {
        user: null,
        isAuthenticated: false,
      },
    });
  }, []);

  // --------- INIT (ver si hay sesión) ---------
  const initialize = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('accessToken');

      if (!storedToken) {
        dispatch({
          type: 'INIT',
          payload: { user: null, isAuthenticated: false },
        });
        return;
      }

      setSession(storedToken);

      // endpoint tipo /auth/me o /me que devuelve el usuario actual
      const { data } = await axios.get('/auth/me');

      dispatch({
        type: 'INIT',
        payload: { user: data.user, isAuthenticated: true },
      });
    } catch (error) {
      setSession(null);

      dispatch({
        type: 'INIT',
        payload: { user: null, isAuthenticated: false },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const contextValue = useMemo(
    () => ({
      ...state,
      method: 'JWT',
      login,
      logout,
    }),
    [state, login, logout],
  );

  if (!state.isInitialized) {
    return <LoadingProgress />;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
