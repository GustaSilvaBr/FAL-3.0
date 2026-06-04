'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Upload, X, Loader2, FolderPlus } from 'lucide-react';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  getDocs,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import {
  type Folder,
  type Product,
  type NutritionTable,
  EMPTY_NUTRITION,
  NUTRITION_FIELDS,
} from '../../lib/types';

type FormState = {
  name: string;
  weight: string;
  folderId: string;
  nutrition: NutritionTable;
};

const EMPTY_FORM: FormState = {
  name: '',
  weight: '',
  folderId: '',
  nutrition: EMPTY_NUTRITION,
};

export default function ProductFormPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<FormState>({
    ...EMPTY_FORM,
    folderId: searchParams.get('folder') ?? '',
  });
  const [folders, setFolders] = useState<Folder[]>([]);
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New folder inline creation
  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load folders
  useEffect(() => {
    getDocs(query(collection(db, 'folders'), orderBy('name'))).then((snap) =>
      setFolders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Folder))),
    );
  }, []);

  // Flatten folder tree in display order for the select
  function flattenFolders(
    list: Folder[],
    parentId?: string,
    depth = 0,
  ): { folder: Folder; depth: number }[] {
    return list
      .filter((f) => (parentId ? f.parentId === parentId : !f.parentId))
      .sort((a, b) => a.name.localeCompare(b.name))
      .flatMap((f) => [
        { folder: f, depth },
        ...flattenFolders(list, f.id, depth + 1),
      ]);
  }

  // Load existing product
  useEffect(() => {
    if (!isEditing || !id) return;
    getDoc(doc(db, 'products', id)).then((snap) => {
      if (!snap.exists()) return;
      const p = { id: snap.id, ...snap.data() } as Product;
      setExistingProduct(p);
      setForm({
        name: p.name,
        weight: p.weight,
        folderId: p.folderId,
        nutrition: p.nutrition ?? EMPTY_NUTRITION,
      });
      if (p.imageUrl) setImagePreview(p.imageUrl);
    });
  }, [id, isEditing]);

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFileSelect(file);
  };

  const handleAddFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    const docRef = await addDoc(collection(db, 'folders'), {
      name,
      order: folders.length,
      createdAt: serverTimestamp(),
    });
    const newFolder: Folder = { id: docRef.id, name, order: folders.length };
    setFolders((prev) => [...prev, newFolder].sort((a, b) => a.name.localeCompare(b.name)));
    setForm((f) => ({ ...f, folderId: docRef.id }));
    setNewFolderName('');
    setAddingFolder(false);
  };

  const updateNutrition = (
    key: keyof NutritionTable,
    field: 'per100g' | 'per10g' | 'vd',
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      nutrition: {
        ...f.nutrition,
        [key]: { ...f.nutrition[key], [field]: value },
      },
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Nome é obrigatório.'); return; }
    if (!form.folderId)    { setError('Selecione uma pasta.'); return; }

    setSaving(true);
    setError('');

    try {
      const docRef = isEditing
        ? doc(db, 'products', id!)
        : doc(collection(db, 'products'));

      let imageUrl = existingProduct?.imageUrl ?? '';
      let imagePath = existingProduct?.imagePath ?? '';

      if (imageFile) {
        // Delete old image if it exists
        if (imagePath) {
          await deleteObject(ref(storage, imagePath)).catch(() => {});
        }
        const ext = imageFile.name.split('.').pop();
        imagePath = `products/${docRef.id}/image.${ext}`;
        const imgRef = ref(storage, imagePath);
        await uploadBytes(imgRef, imageFile);
        imageUrl = await getDownloadURL(imgRef);
      }

      await setDoc(
        docRef,
        {
          name: form.name.trim(),
          weight: form.weight.trim(),
          folderId: form.folderId,
          imageUrl,
          imagePath,
          nutrition: form.nutrition,
          ...(isEditing ? {} : { createdAt: serverTimestamp() }),
        },
        { merge: true },
      );

      router.push('/admin/products');
    } catch (e) {
      console.error(e);
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-muted-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          {isEditing ? 'Editar Produto' : 'Novo Produto'}
        </h1>
      </div>

      <div className="space-y-8">
        {/* ── Basic info ─────────────────────────────────────────────────── */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Informações básicas
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Nome do produto
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Pipoca Gravatá Himalaia Premium 15g"
                className="w-full px-3 py-2.5 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Peso
              </label>
              <input
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                placeholder="Ex: 15g"
                className="w-full px-3 py-2.5 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Pasta
              </label>
              {addingFolder ? (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddFolder();
                      if (e.key === 'Escape') setAddingFolder(false);
                    }}
                    placeholder="Nome da pasta"
                    className="flex-1 px-3 py-2.5 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={handleAddFolder}
                    className="px-3 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={form.folderId}
                    onChange={(e) => setForm((f) => ({ ...f, folderId: e.target.value }))}
                    className="flex-1 px-3 py-2.5 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                  >
                    <option value="">Selecione…</option>
                    {flattenFolders(folders).map(({ folder: f, depth }) => (
                      <option key={f.id} value={f.id}>
                        {'    '.repeat(depth)}{depth > 0 ? '↳ ' : ''}{f.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setAddingFolder(true)}
                    title="Nova pasta"
                    className="p-2.5 border border-border rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <FolderPlus className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Image ──────────────────────────────────────────────────────── */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Foto do produto
          </h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
          />

          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-48 object-contain rounded-xl bg-gradient-to-br from-accent/20 to-primary/10 p-4"
              />
              <button
                onClick={() => { setImageFile(null); setImagePreview(''); }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 w-full h-40 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                dragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Arraste uma imagem ou{' '}
                <span className="text-primary font-medium">clique para selecionar</span>
              </p>
            </div>
          )}
        </section>

        {/* ── Nutrition table ────────────────────────────────────────────── */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-5">
            Tabela Nutricional
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-foreground/20">
                  <th className="text-left py-2 pr-4 font-semibold text-foreground text-xs">
                    Nutriente
                  </th>
                  <th className="py-2 px-2 font-semibold text-foreground text-xs w-24 text-center">
                    Por 100g
                  </th>
                  <th className="py-2 px-2 font-semibold text-foreground text-xs w-24 text-center">
                    Por porção
                  </th>
                  <th className="py-2 pl-2 font-semibold text-foreground text-xs w-20 text-center">
                    %VD
                  </th>
                </tr>
              </thead>
              <tbody>
                {NUTRITION_FIELDS.map((field, i) => (
                  <tr
                    key={field.key}
                    className={`border-b border-border ${i % 2 === 0 ? 'bg-white' : 'bg-muted/10'}`}
                  >
                    <td className={`py-2 pr-4 text-xs text-foreground ${field.indent ? 'pl-5' : ''}`}>
                      {field.label}
                    </td>
                    <td className="py-1.5 px-2">
                      <input
                        value={form.nutrition[field.key].per100g}
                        onChange={(e) => updateNutrition(field.key, 'per100g', e.target.value)}
                        className="w-full px-2 py-1 border border-border rounded-md text-xs text-center outline-none focus:ring-1 focus:ring-primary/30"
                        placeholder="—"
                      />
                    </td>
                    <td className="py-1.5 px-2">
                      <input
                        value={form.nutrition[field.key].per10g}
                        onChange={(e) => updateNutrition(field.key, 'per10g', e.target.value)}
                        className="w-full px-2 py-1 border border-border rounded-md text-xs text-center outline-none focus:ring-1 focus:ring-primary/30"
                        placeholder="—"
                      />
                    </td>
                    <td className="py-1.5 pl-2">
                      {field.noVd ? (
                        <p className="text-xs text-center text-muted-foreground">—</p>
                      ) : (
                        <input
                          value={form.nutrition[field.key].vd}
                          onChange={(e) => updateNutrition(field.key, 'vd', e.target.value)}
                          className="w-full px-2 py-1 border border-border rounded-md text-xs text-center outline-none focus:ring-1 focus:ring-primary/30"
                          placeholder="—"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Salvando…' : isEditing ? 'Salvar alterações' : 'Criar produto'}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </div>
    </div>
  );
}
