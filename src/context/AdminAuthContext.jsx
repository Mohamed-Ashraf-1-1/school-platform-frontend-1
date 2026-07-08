import { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext(null);
const STORAGE_KEY = 'admin_ui_gate';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export function AdminAuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(() => sessionStorage.getItem(STORAGE_KEY) === 'true');

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthed(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAuthed(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthed, login, logout }}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
