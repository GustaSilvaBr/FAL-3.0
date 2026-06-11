import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type AuthState = {
  username: string | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  username: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth.php')
      .then((r) => r.json())
      .then((data) => setUsername(data.email ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (user: string, password: string) => {
    const res = await fetch('/api/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email: user, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Erro ao fazer login.');
    setUsername(data.email);
  };

  const signOut = async () => {
    await fetch('/api/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ username, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
