import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '@ecoflow/shared-types';
import axios from 'axios';
import { router } from 'expo-router';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refresh: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        }
      } catch (error) {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (token: string, refresh: string, userData: User) => {
    await SecureStore.setItemAsync('accessToken', token);
    await SecureStore.setItemAsync('refreshToken', refresh);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    router.replace('/(tabs)');
  };

  const logout = async () => {
    try {
      const refresh = await SecureStore.getItemAsync('refreshToken');
      await api.post('/auth/logout', { refreshToken: refresh });
    } catch (e) {
      // ignore
    }
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
