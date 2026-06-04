'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, LayoutGrid, LogOut, House } from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import falLogoImg from '../assets/FAL_LOGO.png';
import type { ReactNode } from 'react';

const falLogo = (falLogoImg as unknown as { src: string }).src ?? falLogoImg as unknown as string;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const navClass = (base: string) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      pathname.startsWith(base)
        ? 'bg-primary text-white'
        : 'text-foreground hover:bg-gray-100'
    }`;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-100">
          <img src={falLogo} alt="FAL" className="h-10 w-auto" />
          <p className="text-xs text-muted-foreground mt-1.5 font-bold uppercase tracking-widest">
            Painel Admin
          </p>
          <a
            href="/"
            className="flex items-center gap-2 mt-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors"
          >
            <House className="w-4 h-4" />
            Página principal
          </a>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-auto">
          <Link href="/admin/products" className={navClass('/admin/products')}>
            <Package className="w-4 h-4 shrink-0" />
            Produtos
          </Link>

          <Link href="/admin/sections" className={navClass('/admin/sections')}>
            <LayoutGrid className="w-4 h-4 shrink-0" />
            Seções
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt=""
                className="w-8 h-8 rounded-full shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
