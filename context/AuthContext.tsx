import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginAPI } from '../services/AuthService'; // sua função que faz login no backend

const USER_STORAGE_KEY = '@SAPE:user';
const TOKEN_STORAGE_KEY = '@SAPE:token';

type User = {
  id: number;
  username: string;
  role: string;
  name: string;
  // adicione outros campos retornados pelo backend
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Carrega usuário e token do AsyncStorage na inicialização
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) setToken(storedToken);
        console.log('Usuário e token carregados do AsyncStorage:', storedUser, storedToken);
      } catch (error) {
        console.error('Erro ao carregar usuário/token do AsyncStorage:', error);
      }
    };
    loadAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const tokenDTO = await loginAPI(username, password);
      setUser(tokenDTO.user);
      setToken(tokenDTO.token);

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(tokenDTO.user));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, tokenDTO.token);

      return true;
    } catch (error: any) {
      console.error('Erro no login:', error.message);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    console.log('Usuário deslogado');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must ser usado dentro do AuthProvider');
  }
  return context;
}
