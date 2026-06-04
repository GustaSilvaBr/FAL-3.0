'use client';
import { AuthProvider } from '../lib/useAuth';
import AdminGuard from './AdminGuard';
import type { ReactNode } from 'react';

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
