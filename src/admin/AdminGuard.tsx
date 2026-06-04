'use client';
import type { ReactNode } from 'react';
import { useAuth } from '../lib/useAuth';
import AdminLoginPage from './AdminLoginPage';
import AdminLayout from './AdminLayout';

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/20 to-primary/10">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLoginPage />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
