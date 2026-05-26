import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, tokenStorage } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const { access } = tokenStorage.get();
    if (access) {
      authApi.profile(access)
        .then(setUser)
        .catch(() => tokenStorage.clear())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await authApi.login({ username, password });
    tokenStorage.set(data.access, data.refresh);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (formData) => {
    const data = await authApi.register(formData);
    tokenStorage.set(data.access, data.refresh);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  const getToken = useCallback(() => tokenStorage.get().access, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getToken, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
