// src/context/AuthContext.tsx - CORREGIDO
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react'; // ✅ Import type-only
import { login as loginService } from '../services/authService'; // ✅ Importar servicio


interface AuthContextType {
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: any) => void;
  isAuthenticated: boolean; // ✅ Agregar esta propiedad
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}




export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });

  // ✅ Ahora SÍ usa los parámetros
  const login = async (username: string, password: string) => {
    try {
      const response = await loginService(username, password);
      
      if (response.success) {
        const userData = response.usuario;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.token);
      } else {
        throw new Error('Login falló');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    setUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};