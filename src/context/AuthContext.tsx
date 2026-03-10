import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

// ══════════════════════════════════════════════
//  AUTH CONTEXT — MULTICONSULTORIAS
//  Maneja login/registro y sesión persistente
// ══════════════════════════════════════════════

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'asesor' | 'admin' | 'supervisor';
  photoURL: string | null;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = '@multiconsultorias_auth';

// Demo user for offline testing
const DEMO_USER: User = {
  uid: 'usr_001',
  email: 'asesor@multiconsultorias.com',
  displayName: 'Esteban Martínez',
  role: 'asesor',
  photoURL: null,
  createdAt: '2026-01-15T08:00:00Z',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Check stored session on mount
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored) as User;
        setState({ user, isLoading: false, isAuthenticated: true, error: null });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // ── Demo / offline bypass ──────────────────
    const DEMO_CREDENTIALS: Record<string, { password: string; user: User }> = {
      'demo@multiconsultorias.com': {
        password: 'demo123',
        user: DEMO_USER,
      },
      'asesor@multiconsultorias.com': {
        password: 'asesor123',
        user: { ...DEMO_USER, email: 'asesor@multiconsultorias.com' },
      },
    };

    const demoEntry = DEMO_CREDENTIALS[email.toLowerCase().trim()];
    if (demoEntry && demoEntry.password === password) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demoEntry.user));
      setState({ user: demoEntry.user, isLoading: false, isAuthenticated: true, error: null });
      return;
    }
    // ──────────────────────────────────────────

    try {
      const credential = await auth().signInWithEmailAndPassword(email, password);
      const fbUser = credential.user;
      
      const user: User = {
        uid: fbUser.uid,
        email: fbUser.email || email,
        displayName: fbUser.displayName || email.split('@')[0],
        role: 'asesor',
        photoURL: fbUser.photoURL,
        createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setState({ user, isLoading: false, isAuthenticated: true, error: null });
    } catch (err: any) {
      let msg = 'Error al iniciar sesión';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Credenciales incorrectas';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Correo electrónico inválido';
      } else if (err.code === 'auth/network-request-failed') {
        msg = 'Sin conexión. Usa acceso demo para continuar.';
      }
      setState(prev => ({ ...prev, isLoading: false, error: msg }));
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const credential = await auth().createUserWithEmailAndPassword(email, password);
      await credential.user.updateProfile({ displayName: name });
      
      const user: User = {
        uid: credential.user.uid,
        email,
        displayName: name,
        role: 'asesor',
        photoURL: null,
        createdAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setState({ user, isLoading: false, isAuthenticated: true, error: null });
    } catch (err: any) {
      let msg = 'Error al registrarse';
      if (err.code === 'auth/email-already-in-use') msg = 'El correo ya está en uso';
      if (err.code === 'auth/weak-password') msg = 'La contraseña es muy débil (mín. 6 caracteres)';
      setState(prev => ({ ...prev, isLoading: false, error: msg }));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem(STORAGE_KEY);
      setState({ user: null, isLoading: false, isAuthenticated: false, error: null });
    } catch {}
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
