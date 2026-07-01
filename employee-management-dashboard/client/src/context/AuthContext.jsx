import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios.js';

// The auth context exposes: user, loading, login(), logout().
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // `loading` is true while we verify an existing token on first load,
  // so protected routes don't flash the login page during that check.
  const [loading, setLoading] = useState(true);

  // On mount: if a token exists, ask the server who we are to restore the
  // session across page refreshes. Invalid tokens get cleared by the
  // axios response interceptor (401 handling).
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  // Call the login endpoint, persist the token, and store the user.
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Convenience hook so components do `const { user } = useAuth()`.
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
