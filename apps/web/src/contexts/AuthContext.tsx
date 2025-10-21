/* eslint-disable @typescript-eslint/no-unused-vars */
/** biome-ignore-all lint/correctness/noUnusedVariables: <explanation> */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginResponse } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (name: string, username: string, password: string, email?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login({ username, password });
      const data: LoginResponse = response.data;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.spreadsheet));
      setUser(data.spreadsheet);
    } catch (error) {
      throw new Error('Credenciais inválidas');
    }
  };

  const signup = async (name: string, username: string, password: string, email?: string) => {
    try {
      const response = await authAPI.signup({ name, username, password, email });
      const data: LoginResponse = response.data;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.spreadsheet));
      setUser(data.spreadsheet);
    } catch (error) {
      throw new Error('Erro ao criar conta');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
