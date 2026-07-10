import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Shield, ShieldOff, RefreshCw, Copy, Check } from 'lucide-react';
import { useAuth } from '../../lib/useAuth';

type AdminUser = {
  email: string;
  can_manage_admins: boolean;
  created_at: string | null;
};

// ── Toggle switch ──────────────────────────────────────────────────────────────

function Toggle({
  value,
  onChange,
  disabled,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => !disabled && onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        value ? 'bg-primary' : 'bg-gray-300'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
          value ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}

// ── Add / Edit modal ───────────────────────────────────────────────────────────

function AdminModal({
  admin,
  currentEmail,
  onSave,
  onClose,
}: {
  admin: AdminUser | null;
  currentEmail: string;
  onSave: () => void;
  onClose: () => void;
}) {
  const isEdit = admin !== null;
  const isSelf = isEdit && admin.email === currentEmail;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canManage, setCanManage] = useState(isEdit ? admin.can_manage_admins : false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const generatePassword = () => {
    const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
    const pwd = Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map((b) => chars[b % chars.length])
      .join('');
    setPassword(pwd);
    setShowPassword(true);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    setError('');
    if (!isEdit && !email.trim()) { setError('Email é obrigatório.'); return; }
    if (!isEdit && !password)     { setError('Senha é obrigatória.'); return; }

    setSaving(true);
    try {
      const url = isEdit
        ? `/api/admins.php?email=${encodeURIComponent(admin.email)}`
        : '/api/admins.php';
      const body: Record<string, unknown> = { can_manage_admins: canManage };
      if (!isEdit) { body.email = email.trim(); body.password = password; }
      else if (password) body.password = password;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Erro ao salvar.'); return; }
      onSave();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold text-foreground">{isEdit ? 'Editar admin' : 'Novo admin'}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">
              Email
            </label>
            {isEdit ? (
              <p className="text-sm font-medium text-foreground bg-gray-50 px-3 py-2 rounded-xl">
                {admin.email}
              </p>
            ) : (
              <input
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="nome@email.com"
                className="w-full px-3 py-2 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {isEdit ? 'Nova senha (vazio = sem alteração)' : 'Senha'}
              </label>
              <button
                type="button"
                onClick={generatePassword}
                className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                Gerar senha
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEdit ? '••••••••' : 'Mínimo 6 caracteres'}
                className="flex-1 px-3 py-2 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 font-mono"
              />
              {password && (
                <button
                  type="button"
                  onClick={copyPassword}
                  title="Copiar senha"
                  className="px-3 py-2 border border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* can_manage_admins toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div>
              <p className="text-sm font-semibold text-foreground">Pode gerenciar admins</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Acesso à seção de usuários e criação de outros admins
              </p>
            </div>
            <Toggle value={canManage} onChange={setCanManage} disabled={isSelf} />
          </div>

          {isSelf && (
            <p className="text-xs text-muted-foreground">
              Você não pode alterar sua própria permissão de gerenciar admins.
            </p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const { username } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [modal, setModal] = useState<'add' | AdminUser | null>(null);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const reload = () => {
    fetch('/api/admins.php')
      .then((r) => {
        if (r.status === 403) { setForbidden(true); return null; }
        return r.json();
      })
      .then((rows: AdminUser[] | null) => {
        if (rows) setAdmins(rows);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const handleDelete = async (admin: AdminUser) => {
    if (!confirm(`Excluir o admin "${admin.email}"?\nEsta ação não pode ser desfeita.`)) return;
    setDeletingEmail(admin.email);
    await fetch(`/api/admins.php?email=${encodeURIComponent(admin.email)}`, { method: 'DELETE' });
    setDeletingEmail(null);
    reload();
  };

  const fmt = (s: string | null) => {
    if (!s) return '—';
    return new Date(s).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  if (forbidden) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <ShieldOff className="w-12 h-12 mb-4 opacity-25" />
        <p className="font-semibold text-foreground">Acesso restrito</p>
        <p className="text-sm mt-1">Você não tem permissão para gerenciar admins.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {admins.length} admin{admins.length !== 1 ? 's' : ''} cadastrado{admins.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Novo Admin
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-white border border-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Shield className="w-10 h-10 mx-auto mb-3 opacity-25" />
          <p className="font-medium">Nenhum admin cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {admins.map((admin) => {
            const isSelf = admin.email === username;
            return (
              <div
                key={admin.email}
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary uppercase">
                    {admin.email[0]}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">{admin.email}</p>
                    {isSelf && (
                      <span className="text-xs bg-gray-100 text-muted-foreground px-2 py-0.5 rounded-full font-medium shrink-0">
                        você
                      </span>
                    )}
                    {admin.can_manage_admins && (
                      <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold shrink-0">
                        <Shield className="w-3 h-3" />
                        Gerencia admins
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Desde {fmt(admin.created_at)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setModal(admin)}
                    title="Editar"
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(admin)}
                    disabled={isSelf || deletingEmail === admin.email}
                    title={isSelf ? 'Você não pode excluir sua própria conta' : 'Excluir'}
                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {deletingEmail === admin.email ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <AdminModal
          admin={modal === 'add' ? null : modal}
          currentEmail={username ?? ''}
          onSave={reload}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
