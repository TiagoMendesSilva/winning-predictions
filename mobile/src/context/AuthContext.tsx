import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginWithGoogle, fetchMe } from '../api/auth.api';
import { saveToken, removeToken, getToken, saveUser, getUser, UserStorage } from '../storage/token.storage';

interface AuthContextData {
  user: UserStorage | null;
  loading: boolean;
  signIn: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserStorage | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica token salvo ao abrir o app
  useEffect(() => {
    async function loadStoredSession() {
      try {
        const token = await getToken();
        if (token) {
          const userData = await fetchMe();
          setUser(userData);
        }
      } catch {
        await removeToken();
      } finally {
        setLoading(false);
      }
    }
    loadStoredSession();
  }, []);

  async function signIn(idToken: string) {
    // 1. Autentica no backend
    const authData = await loginWithGoogle(idToken);

    // 2. Salva token
    await saveToken(authData.token);

    // 3. Salva e seta usuário
    const userData: UserStorage = {
      id: authData.userId,
      name: authData.name,
      email: authData.email,
      pictureUrl: authData.pictureUrl,
    };
    await saveUser(userData);
    setUser(userData);
  }

  async function signOut() {
    await removeToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}