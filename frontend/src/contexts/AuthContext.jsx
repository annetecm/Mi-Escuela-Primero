import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tipo = localStorage.getItem('tipoUsuario');
    if (token && tipo) {
      setIsLoggedIn(true);
      setUserType(tipo);
    } else {
      setIsLoggedIn(false);
      setUserType(null);
    }
  }, []);

  const login = (token, type) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tipoUsuario', type);
    setIsLoggedIn(true);
    setUserType(type);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    setIsLoggedIn(false);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

