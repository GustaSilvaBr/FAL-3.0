import { NavLink, Outlet } from 'react-router';
import { Package, LayoutGrid, LogOut, House, Users, Salad } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../lib/useAuth';
import falLogo from '../assets/FAL_LOGO.png';

export default function AdminLayout() {
  const { username, canManageAdmins, signOut } = useAuth();
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [nutritionResult, setNutritionResult] = useState<string | null>(null);

  async function handleUpdateNutrition() {
    if (!confirm('Atualizar tabelas nutricionais de todos os produtos do nutrition-data.json?')) return;
    setNutritionLoading(true);
    setNutritionResult(null);
    try {
      const res = await fetch('/api/update-nutrition.php', { method: 'POST', credentials: 'include' });
      const json = await res.json();
      if (json.ok) {
        setNutritionResult(`✓ ${json.updated} produto(s) atualizados${json.skipped ? `, ${json.skipped} não encontrados` : ''}.`);
      } else {
        setNutritionResult(`Erros: ${json.errors?.join(', ') ?? 'desconhecido'}`);
      }
    } catch {
      setNutritionResult('Falha na requisição.');
    } finally {
      setNutritionLoading(false);
    }
  }

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
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-gray-100'
              }`
            }
          >
            <Package className="w-4 h-4 shrink-0" />
            Produtos
          </NavLink>

          <NavLink
            to="/admin/sections"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-gray-100'
              }`
            }
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            Seções
          </NavLink>

          {canManageAdmins && (
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-gray-100'
                }`
              }
            >
              <Users className="w-4 h-4 shrink-0" />
              Usuários
            </NavLink>
          )}
        </nav>

        {/* Ferramentas */}
        <div className="px-3 pb-3 border-t border-gray-100 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-1.5">
            Ferramentas
          </p>
          <button
            onClick={handleUpdateNutrition}
            disabled={nutritionLoading}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <Salad className="w-4 h-4 shrink-0" />
            {nutritionLoading ? 'Atualizando...' : 'Popular nutrição'}
          </button>
          {nutritionResult && (
            <p className="text-xs px-3 pt-1 text-muted-foreground">{nutritionResult}</p>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary uppercase">{username?.[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{username}</p>
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
        <Outlet />
      </main>
    </div>
  );
}
