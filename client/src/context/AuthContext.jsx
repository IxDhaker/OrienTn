import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('studentUser') || 'null');
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [modal, setModal] = useState(null); // null | 'login' | 'register'

  const saveSession = (token, u) => {
    localStorage.setItem('studentToken', token);
    localStorage.setItem('studentUser', JSON.stringify(u));
    setUser(u);
    setModal(null);
  };

  const logout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, modal, setModal, openAuth: (m = 'login') => setModal(m), closeAuth: () => setModal(null), saveSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
