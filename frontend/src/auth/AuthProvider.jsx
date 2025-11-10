import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || null);
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);  
  const [loading, setLoading] = useState(false);

  // Guarda / limpia token en localStorage
  const setSession = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem(STORAGE_KEY, newToken);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setToken(newToken || null);
  }, []);

 
  const fetchMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      setInitialized(true);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('No autorizado');

      const data = await res.json();
      setUser(data || null);
    } catch (err) {
      // Token inválido => limpiar sesión
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [token, setSession]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

 
  const login = useCallback(
    async ({ email, password_hash, remember = true }) => {
       
      const res = await fetch('http://192.168.1.90:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password_hash }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.token) {
        throw new Error(data.message || 'Credenciales inválidas');
      }

      if (remember) {
        setSession(data.token);
      } else {
        setSession(data.token);
      }

      await fetchMe();
      return data;
    },
    [fetchMe, setSession],
  );

  const logout = useCallback(() => {
    setSession(null);
    setUser(null);
  }, [setSession]);

  const value = {
    token,
    user,
    loading,
    initialized,
    isAuthenticated: !!user && !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
