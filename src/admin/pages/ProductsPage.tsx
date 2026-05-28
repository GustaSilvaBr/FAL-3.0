import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
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

  const [newFolderName, setNewFolderName] = useState('');
  const [addingFolder, setAddingFolder] = useState(false);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const [addingSubfolderId, setAddingSubfolderId] = useState<string | null>(null);
  const [newSubfolderName, setNewSubfolderName] = useState('');

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'folders'), orderBy('name')),
      (snap) => setFolders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Folder))),
    );
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'products'), orderBy('name')),
      (snap) => setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product))),
    );
    return unsub;
  }, []);

  const handleAddFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    await addDoc(collection(db, 'folders'), {
      name,
      order: folders.length,
      createdAt: serverTimestamp(),
    });
    setNewFolderName('');
    setAddingFolder(false);
  };

  const handleAddSubfolder = async () => {
    const name = newSubfolderName.trim();
    if (!name || !addingSubfolderId) return;
    await addDoc(collection(db, 'folders'), {
      name,
      parentId: addingSubfolderId,
      order: folders.length,
      createdAt: serverTimestamp(),
    });
    setNewSubfolderName('');
    setAddingSubfolderId(null);
  };

  const handleStartRename = (folder: Folder) => {
    setRenamingId(folder.id);
    setRenameValue(folder.name);
    setAddingSubfolderId(null);
  };

  const handleRenameSubmit = async () => {
    const name = renameValue.trim();
    if (name && renamingId) {
      await updateDoc(doc(db, 'folders', renamingId), { name });
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
    await deleteDoc(doc(db, 'folders', folder.id));
    if (selectedFolder === folder.id) setSelectedFolder(null);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Excluir "${product.name}"?`)) return;
    setDeletingId(product.id);
    try {
      if (product.imagePath) {
        await deleteObject(ref(storage, product.imagePath)).catch(() => {});
      }
      await deleteDoc(doc(db, 'products', product.id));
    } finally {
      setDeletingId(null);
    }
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
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
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
            <SeedButton />
            <Link
              to={`/admin/products/new${selectedFolder ? `?folder=${selectedFolder}` : ''}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Novo Produto
            </Link>
          </div>
        </div>

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
