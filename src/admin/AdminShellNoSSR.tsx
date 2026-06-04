'use client';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

const AdminShell = dynamic(() => import('./AdminShell'), { ssr: false });

export default function AdminShellNoSSR({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
