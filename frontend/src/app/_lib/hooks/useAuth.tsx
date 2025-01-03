"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearCookies, getCookie } from '@/app/_lib/utils/cookies';
import { isJwtExpired } from '@/app/_lib/utils/jwt';
import { UserProfile } from '@/app/_lib/types';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isInitialized: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie('token');

    if (token) {
      setIsAuthenticated(true);

      if (isJwtExpired(token)) {
        logout();
      }

      const userData = getCookie('user');
      setUser(userData ? JSON.parse(userData) : null);
    }

    setIsInitialized(true);
  }, []);

  const logout = () => {
    clearCookies('token', 'user_role', 'user');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isInitialized, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
