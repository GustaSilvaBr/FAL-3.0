import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiFetch } from './api';

type AuthState = {
  username: string | null;
  canManageAdmins: boolean;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  username: null,
  canManageAdmins: false,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [canManageAdmins, setCanManageAdmins] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/auth.php')
      .then((r) => r.json())
      .then((data) => {
        setUsername(data.email ?? null);
        setCanManageAdmins(data.can_manage_admins ?? false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (user: string, password: string) => {
    const res = await apiFetch('/api/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email: user, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Erro ao fazer login.');
    setUsername(data.email);
    setCanManageAdmins(data.can_manage_admins ?? false);
  };

  const signOut = async () => {
    await apiFetch('/api/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setUsername(null);
    setCanManageAdmins(false);
  };

  return (
    <AuthContext.Provider value={{ username, canManageAdmins, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
