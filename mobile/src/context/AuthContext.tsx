/*
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
*/

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  loginWithGoogle,
  fetchMe,
} from '../api/auth.api';

import {
  saveToken,
  removeToken,
  getToken,
  saveUser,
  UserStorage,
} from '../storage/token.storage';

import axios from 'axios';

// ==========================================
// INTERFACE DO CONTEXTO
// ==========================================

interface AuthContextData {
  user: UserStorage | null;
  loading: boolean;
  signIn: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

// ==========================================
// AUTH PROVIDER
// ==========================================

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] = useState<UserStorage | null>(null);

  const [loading, setLoading] = useState(true);

  // ========================================
  // RECUPERAR SESSÃO AO ABRIR O APLICATIVO
  // ========================================

  useEffect(() => {

    async function loadStoredSession() {

      try {

        const token = await getToken();

        if (token) {

          // Busca os dados atualizados no backend
          const userData = await fetchMe();

          setUser(userData);

          await saveUser(userData);

        }

      } catch (error) {

       console.error('Erro ao recuperar sessão:', error);

        // Remove o token somente quando a autenticação não é aceita
        if (
          axios.isAxiosError(error) &&
          [401, 403].includes(error.response?.status ?? 0)
        ) {
          await removeToken();
          setUser(null);
        }

      } finally {

        setLoading(false);

      }

    }

    loadStoredSession();

  }, []);

  // ========================================
  // LOGIN GOOGLE
  // ========================================

  async function signIn(idToken: string) {

    // 1. Autentica no backend
    const authData = await loginWithGoogle(idToken);

    // 2. Salva JWT
    await saveToken(authData.token);

    // 3. Monta usuário
    const userData: UserStorage = {

      id: authData.userId,

      name: authData.name,

      email: authData.email,

      pictureUrl: authData.pictureUrl,

    };

    // 4. Salva usuário
    await saveUser(userData);

    // 5. Atualiza contexto
    setUser(userData);

  }

  // ========================================
  // LOGOUT
  // ========================================
/*
  async function signOut() {

    try {

      // Remove JWT armazenado
      await removeToken();

      // Remove usuário armazenado
      await saveUser(null);

      // Atualiza estado de autenticação
      setUser(null);

    } catch (error) {

      console.error(
        'Erro ao encerrar sessão:',
        error
      );

      throw error;

    }

  }
*/
  async function signOut() {
    try {
      await removeToken();
      setUser(null);
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
      throw error;
    }
}

  // ========================================
  // PROVIDER
  // ========================================

  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

// ==========================================
// HOOK
// ==========================================

export function useAuth() {

  return useContext(AuthContext);

}
