import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ticket_users') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    const saved = localStorage.getItem('ticket_auth');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  const login = useCallback((email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { error: 'Email o contraseña incorrectos' };
    const userData = { id: found.id, name: found.name, email: found.email };
    setUser(userData);
    localStorage.setItem('ticket_auth', JSON.stringify(userData));
    return { success: true };
  }, [users]);

  const register = useCallback((name, email, password) => {
    if (users.find(u => u.email === email)) {
      return { error: 'Ya existe una cuenta con ese email' };
    }
    const newUser = { id: 'u' + Date.now(), name, email, password };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('ticket_users', JSON.stringify(updated));
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(userData);
    localStorage.setItem('ticket_auth', JSON.stringify(userData));
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ticket_auth');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
