'use client';
import React, { createContext, useContext,  useEffect, useState,
} from 'react';
import { authClient } from '@/lib/auth-client';
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  image?: string;
  photoURL?: string;
  photo?: string;
}
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (user: User, token?: string) => void;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  updateUser: () => {},
});
export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isPending } = authClient.useSession();
  const [token, setToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const sessionUser = (
    data as unknown as {
      user?: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
      };
    } | null
  )?.user;
  const user: User | null = sessionUser ? {
        id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
        image: sessionUser.image ?? undefined,
        photoURL: sessionUser.image ?? undefined,
        photo: sessionUser.image ?? undefined,
      }
    : null;
  useEffect(() => {
    let cancelled = false;
    const getToken = async () => {
      if (!sessionUser?.id) {
        setToken(null);
        return;
      }
      setTokenLoading(true);
      try {
        const response = await fetch('/api/backend-token', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Token generation failed');
        }
        if (!cancelled) {
          setToken(result.token);
        }
      } catch (error) {
        console.error('Backend token error:', error);
        if (!cancelled) {
          setToken(null);
        }
      } finally {
        if (!cancelled) {
          setTokenLoading(false);
        }
      }
    };
    getToken();
    return () => {
      cancelled = true;
    };
  }, [sessionUser?.id]);
  const logout = async (): Promise<void> => {
    setToken(null);
    await authClient.signOut({});
  };
  return (
    <AuthContext.Provider
      value={{ user, token, loading: isPending || tokenLoading,
        login: () => {},
        logout,
        updateUser: () => {},
      }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);