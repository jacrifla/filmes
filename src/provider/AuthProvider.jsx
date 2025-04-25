import { useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Carrega token + user do localStorage apenas uma vez
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (savedToken && storedUser) {
      setToken(savedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Sincroniza alterações de user no localStorage
  useEffect(() => {
    if (loading) return;

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user, loading]);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, setUser, setToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
