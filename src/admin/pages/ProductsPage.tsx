import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import SeedButton from '../seed/SeedButton';
import {
  Plus,
  Folder as FolderIcon,
  FolderPlus,
  Pencil,
  Trash2,
  Package,
  Check,
  X,
  Tag,
} from 'lucide-react';
import type { Folder, Product } from '../../lib/types';

// ─── Tree helpers ─────────────────────────────────────────────────────────────

function sortedChildren(folders: Folder[], parentId?: string): Folder[] {
  return folders
    .filter((f) => (parentId ? f.parentId === parentId : !f.parentId))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function countAllProducts(folderId: string, folders: Folder[], products: Product[]): number {
  const direct = products.filter((p) => p.folderId === folderId).length;
  const children = folders.filter((f) => f.parentId === folderId);
  return direct + children.reduce((sum, child) => sum + countAllProducts(child.id, folders, products), 0);
}

// ─── FolderRow ────────────────────────────────────────────────────────────────

type RowProps = {
  folder: Folder;
  folders: Folder[];
  products: Product[];
  depth: number;
  selectedFolder: string | null;
  renamingId: string | null;
  renameValue: string;
  addingSubfolderId: string | null;
  newSubfolderName: string;
  onSelect: (id: string) => void;
  onStartRename: (f: Folder) => void;
  onRenameChange: (v: string) => void;
  onRenameSubmit: () => void;
  onRenameCancel: () => void;
  onStartSubfolder: (id: string) => void;
  onSubNameChange: (v: string) => void;
  onSubfolderSubmit: () => void;
  onSubfolderCancel: () => void;
  onDelete: (f: Folder) => void;
};

function FolderRow({
  folder, folders, products, depth,
  selectedFolder, renamingId, renameValue, addingSubfolderId, newSubfolderName,
  onSelect, onStartRename, onRenameChange, onRenameSubmit, onRenameCancel,
  onStartSubfolder, onSubNameChange, onSubfolderSubmit, onSubfolderCancel, onDelete,
}: RowProps) {
  const children = sortedChildren(folders, folder.id);
  const count = countAllProducts(folder.id, folders, products);
  const active = selectedFolder === folder.id;
  const isRenaming = renamingId === folder.id;
  const addingHere = addingSubfolderId === folder.id;
  const indent = 12 + depth * 12;

  const childProps: Omit<RowProps, 'folder' | 'depth'> = {
    folders, products, selectedFolder, renamingId, renameValue,
    addingSubfolderId, newSubfolderName,
    onSelect, onStartRename, onRenameChange, onRenameSubmit, onRenameCancel,
    onStartSubfolder, onSubNameChange, onSubfolderSubmit, onSubfolderCancel, onDelete,
  };

  return (
    <>
      <div
        onClick={() => !isRenaming && onSelect(folder.id)}
        style={{ paddingLeft: `${indent}px` }}
        className={`group flex items-center gap-2 pr-2 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
          active && !isRenaming
            ? 'bg-primary/10 text-primary font-semibold'
            : 'text-foreground hover:bg-gray-50'
        }`}
      >
        <FolderIcon className="w-4 h-4 shrink-0" />

        {isRenaming ? (
          <div
            className="flex-1 flex gap-1 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => onRenameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onRenameSubmit();
                if (e.key === 'Escape') onRenameCancel();
              }}
              className="flex-1 min-w-0 px-1.5 py-0.5 text-xs border border-primary/40 rounded outline-none focus:ring-1 focus:ring-primary/30"
            />
            <button
              onClick={onRenameSubmit}
              className="p-0.5 text-primary hover:text-primary/70 shrink-0"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={onRenameCancel}
              className="p-0.5 text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <>
            <span className="flex-1 truncate">{folder.name}</span>
            <span className="text-xs text-muted-foreground">{count}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onStartRename(folder); }}
              title="Renomear"
              className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-primary transition-all"
            >
              <Pencil className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onStartSubfolder(folder.id); }}
              title="Adicionar subpasta"
              className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-primary transition-all"
            >
              <FolderPlus className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(folder); }}
              title="Excluir"
              className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-red-600 transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </>
        )}
      </div>

      {addingHere && (
        <div
          style={{ paddingLeft: `${indent + 12}px` }}
          className="flex items-center gap-1 pr-2 py-1"
        >
          <FolderIcon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={newSubfolderName}
            onChange={(e) => onSubNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSubfolderSubmit();
              if (e.key === 'Escape') onSubfolderCancel();
            }}
            placeholder="Nome da subpasta"
            className="flex-1 min-w-0 px-2 py-0.5 text-xs border border-border rounded-md outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={onSubfolderSubmit}
            className="px-2 py-0.5 text-xs bg-primary text-white rounded-md shrink-0"
          >
            OK
          </button>
        </div>
      )}

      {children.map((child) => (
        <FolderRow key={child.id} folder={child} depth={depth + 1} {...childProps} />
      ))}
    </>
  );
}

// ─── ProductsPage ─────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  const [newFolderName, setNewFolderName] = useState('');
  const [addingFolder, setAddingFolder] = useState(false);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const [addingSubfolderId, setAddingSubfolderId] = useState<string | null>(null);
  const [newSubfolderName, setNewSubfolderName] = useState('');

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [keywordInput, setKeywordInput] = useState('');
  const keywordInputRef = useRef<HTMLInputElement>(null);

  const [sidebarWidth, setSidebarWidth] = useState(224);
  const dragState = useRef<{ startX: number; startWidth: number } | null>(null);

  const reload = () => setRefresh((n) => n + 1);

  const handleDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragState.current = { startX: e.clientX, startWidth: sidebarWidth };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.current) return;
      const delta = e.clientX - dragState.current.startX;
      const clamped = Math.min(480, Math.max(160, dragState.current.startWidth + delta));
      setSidebarWidth(clamped);
    };
    const onMouseUp = () => {
      if (!dragState.current) return;
      dragState.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  useEffect(() => {
    fetch('/api/folders.php')
      .then((r) => r.json())
      .then((rows: Folder[]) => setFolders([...rows].sort((a, b) => a.name.localeCompare(b.name))));
  }, [refresh]);

  useEffect(() => {
    fetch('/api/products.php')
      .then((r) => r.json())
      .then((rows: Product[]) => setProducts([...rows].sort((a, b) => a.name.localeCompare(b.name))));
  }, [refresh]);

  const handleAddFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    await fetch('/api/folders.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, order: folders.length }),
    });
    setNewFolderName('');
    setAddingFolder(false);
    reload();
  };

  const handleAddSubfolder = async () => {
    const name = newSubfolderName.trim();
    if (!name || !addingSubfolderId) return;
    await fetch('/api/folders.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentId: addingSubfolderId, order: folders.length }),
    });
    setNewSubfolderName('');
    setAddingSubfolderId(null);
    reload();
  };

  const handleStartRename = (folder: Folder) => {
    setRenamingId(folder.id);
    setRenameValue(folder.name);
    setAddingSubfolderId(null);
  };

  const handleRenameSubmit = async () => {
    const name = renameValue.trim();
    if (name && renamingId) {
      const folder = folders.find((f) => f.id === renamingId);
      await fetch(`/api/folders.php?id=${renamingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, order: folder?.order ?? 0, parentId: folder?.parentId ?? null }),
      });
      reload();
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const handleDeleteFolder = async (folder: Folder) => {
    const hasProducts = products.some((p) => p.folderId === folder.id);
    if (hasProducts) {
      alert('Mova ou exclua os produtos desta pasta antes de excluí-la.');
      return;
    }
    const hasChildren = folders.some((f) => f.parentId === folder.id);
    if (hasChildren) {
      alert('Mova ou exclua as subpastas antes de excluir esta pasta.');
      return;
    }
    if (!confirm(`Excluir pasta "${folder.name}"?`)) return;
    await fetch(`/api/folders.php?id=${folder.id}`, { method: 'DELETE' });
    if (selectedFolder === folder.id) setSelectedFolder(null);
    reload();
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Excluir "${product.name}"?`)) return;
    setDeletingId(product.id);
    try {
      await fetch(`/api/products.php?id=${product.id}`, { method: 'DELETE' });
      reload();
    } finally {
      setDeletingId(null);
    }
  };

  const selectedFolderData = folders.find((f) => f.id === selectedFolder);
  const currentKeywords = selectedFolderData?.keywords ?? [];

  const handleAddKeyword = async () => {
    const kw = keywordInput.trim().toLowerCase();
    if (!kw || !selectedFolder || currentKeywords.includes(kw)) { setKeywordInput(''); return; }
    const folder = folders.find((f) => f.id === selectedFolder);
    if (!folder) return;
    await fetch(`/api/folders.php?id=${selectedFolder}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: folder.name, order: folder.order ?? 0, parentId: folder.parentId ?? null, keywords: [...currentKeywords, kw] }),
    });
    setKeywordInput('');
    keywordInputRef.current?.focus();
    reload();
  };

  const handleRemoveKeyword = async (kw: string) => {
    if (!selectedFolder) return;
    const folder = folders.find((f) => f.id === selectedFolder);
    if (!folder) return;
    await fetch(`/api/folders.php?id=${selectedFolder}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: folder.name, order: folder.order ?? 0, parentId: folder.parentId ?? null, keywords: currentKeywords.filter((k) => k !== kw) }),
    });
    reload();
  };

  const rootFolders = sortedChildren(folders);
  const displayed = selectedFolder
    ? products.filter((p) => p.folderId === selectedFolder)
    : products;
  const subfolders = selectedFolder ? sortedChildren(folders, selectedFolder) : [];
  const totalCount = selectedFolder
    ? countAllProducts(selectedFolder, folders, products)
    : products.length;

  const rowProps: Omit<RowProps, 'folder' | 'depth'> = {
    folders,
    products,
    selectedFolder,
    renamingId,
    renameValue,
    addingSubfolderId,
    newSubfolderName,
    onSelect: setSelectedFolder,
    onStartRename: handleStartRename,
    onRenameChange: setRenameValue,
    onRenameSubmit: handleRenameSubmit,
    onRenameCancel: () => { setRenamingId(null); setRenameValue(''); },
    onStartSubfolder: (id) => { setAddingSubfolderId(id); setNewSubfolderName(''); setAddingFolder(false); },
    onSubNameChange: setNewSubfolderName,
    onSubfolderSubmit: handleAddSubfolder,
    onSubfolderCancel: () => setAddingSubfolderId(null),
    onDelete: handleDeleteFolder,
  };

  return (
    <div className="flex h-full">
      {/* Folder sidebar */}
      <aside style={{ width: sidebarWidth }} className="bg-white flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Pastas
            </span>
            <button
              onClick={() => { setAddingFolder(true); setAddingSubfolderId(null); }}
              title="Nova pasta"
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <FolderPlus className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {addingFolder && (
            <div className="mt-2 flex gap-1">
              <input
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddFolder();
                  if (e.key === 'Escape') setAddingFolder(false);
                }}
                placeholder="Nome da pasta"
                className="flex-1 px-2 py-1 text-xs border border-border rounded-md outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={handleAddFolder}
                className="px-2 py-1 text-xs bg-primary text-white rounded-md"
              >
                OK
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 p-2 space-y-0.5 overflow-auto">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
              selectedFolder === null
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-foreground hover:bg-gray-50'
            }`}
          >
            <FolderIcon className="w-4 h-4 shrink-0" />
            <span className="flex-1 truncate">Todos</span>
            <span className="text-xs text-muted-foreground">{products.length}</span>
          </button>

          {rootFolders.map((folder) => (
            <FolderRow key={folder.id} folder={folder} depth={0} {...rowProps} />
          ))}
        </div>
      </aside>

      {/* Resize divider */}
      <div
        onMouseDown={handleDividerMouseDown}
        className="w-1 shrink-0 bg-gray-200 hover:bg-primary/50 active:bg-primary cursor-col-resize transition-colors"
      />

      {/* Products grid */}
      <div className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {selectedFolder
                ? (folders.find((f) => f.id === selectedFolder)?.name ?? 'Produtos')
                : 'Todos os Produtos'}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalCount} produto{totalCount !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SeedButton onDone={reload} />
            <Link
              to={`/admin/products/new${selectedFolder ? `?folder=${selectedFolder}` : ''}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Novo Produto
            </Link>
          </div>
        </div>

        {/* Keywords editor — only when a folder is selected */}
        {selectedFolder && (
          <div className="mb-8 bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-primary/70 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Palavras-chave
              </span>
              <span className="text-xs text-muted-foreground font-normal normal-case tracking-normal">
                — ajudam usuários a encontrar esta categoria na busca
              </span>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {currentKeywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full"
                >
                  {kw}
                  <button
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-primary/60 hover:text-primary transition-colors"
                    aria-label={`Remover "${kw}"`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1.5">
                <input
                  ref={keywordInputRef}
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddKeyword();
                    if (e.key === 'Escape') setKeywordInput('');
                  }}
                  placeholder="Adicionar palavra-chave…"
                  className="px-3 py-1 text-xs border border-dashed border-border rounded-full outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 w-44 transition-all"
                />
                {keywordInput.trim() && (
                  <button
                    onClick={handleAddKeyword}
                    className="px-3 py-1 text-xs bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Adicionar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {subfolders.length === 0 && displayed.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-25" />
            <p className="font-medium">Nenhum produto</p>
            <p className="text-sm mt-1">Adicione um produto para começar.</p>
          </div>
        ) : (
          <>
            {subfolders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Subpastas
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {subfolders.map((subfolder) => {
                    const subCount = countAllProducts(subfolder.id, folders, products);
                    return (
                      <button
                        key={subfolder.id}
                        onClick={() => setSelectedFolder(subfolder.id)}
                        className="group bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 min-h-[120px] hover:shadow-md hover:border-primary/20 transition-all text-center"
                      >
                        <FolderIcon className="w-9 h-9 text-primary/40 group-hover:text-primary transition-colors" />
                        <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                          {subfolder.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {subCount} produto{subCount !== 1 ? 's' : ''}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {displayed.length > 0 && (
              <>
                {subfolders.length > 0 && (
                  <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    Produtos
                  </h2>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {displayed.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center overflow-hidden">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain p-3"
                          />
                        ) : (
                          <Package className="w-10 h-10 text-muted-foreground/30" />
                        )}
                      </div>

                      <div className="p-3">
                        <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{product.weight}</p>

                        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium bg-gray-100 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                          >
                            <Pencil className="w-3 h-3" />
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            disabled={deletingId === product.id}
                            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
