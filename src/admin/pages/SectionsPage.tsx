import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Plus, X, Search, Loader2, GripVertical, ImagePlus, Trash2, Instagram } from 'lucide-react';
import { db, storage } from '../../lib/firebase';
import { ProductWheel } from '../../app/components/Brands';
import type {
  Product,
  SectionNovidades,
  SectionPipoca,
  SectionBrands,
  SectionBanners,
  BannerItem,
  NovidadesItem,
  PipocaCategory,
  InstagramPost,
  SectionInstagram,
} from '../../lib/types';

// ── Product picker dialog ─────────────────────────────────────────────────────

function ProductPicker({
  products,
  onSelect,
  onClose,
  title = 'Selecionar produto',
}: {
  products: Product[];
  onSelect: (p: Product) => void;
  onClose: () => void;
  title?: string;
}) {
  const [search, setSearch] = useState('');
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto…"
              className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 grid grid-cols-3 gap-3">
          {filtered.length === 0 ? (
            <p className="col-span-3 text-center py-8 text-sm text-muted-foreground">
              Nenhum produto encontrado.
            </p>
          ) : (
            filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => { onSelect(p); onClose(); }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl flex items-center justify-center overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <p className="text-xs font-medium text-foreground leading-tight text-center line-clamp-2">
                  {p.name}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Previews ──────────────────────────────────────────────────────────────────

function NovidadesPreview({ items, products }: { items: NovidadesItem[]; products: Product[] }) {
  const [index, setIndex] = useState(0);
  const get = (id: string) => products.find((p) => p.id === id);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;

  const featured = items[index];
  const fp = get(featured.productId);
  const sidebar = items.filter((_, i) => i !== index);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="flex min-h-[170px]">
        <div className="flex flex-1 p-4 gap-4">
          <div className="w-28 shrink-0 bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl overflow-hidden flex items-center justify-center">
            {fp?.imageUrl && <img src={fp.imageUrl} alt={fp.name} className="w-full h-full object-contain p-3" />}
          </div>
          <div className="flex flex-col justify-center gap-1.5">
            {featured.tag && (
              <span className="text-xs font-black uppercase tracking-widest bg-accent text-foreground px-2 py-0.5 rounded-full w-fit">
                {featured.tag}
              </span>
            )}
            <p className="font-black text-sm text-foreground uppercase leading-tight">{fp?.name}</p>
            {featured.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">{featured.description}</p>
            )}
          </div>
        </div>
        {sidebar.length > 0 && (
          <div className="w-44 shrink-0 border-l border-primary/10 p-4 flex flex-col gap-3 justify-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Também em destaque</p>
            {sidebar.slice(0, 3).map((item, i) => {
              const p = get(item.productId);
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-9 h-9 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
                    {p?.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain p-0.5" />}
                  </div>
                  <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">{p?.name}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 py-2 border-t border-gray-100">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-primary' : 'w-1.5 bg-primary/30'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PipocaPreview({ categories, products }: { categories: PipocaCategory[]; products: Product[] }) {
  const [current, setCurrent] = useState(0);
  const get = (id: string) => products.find((p) => p.id === id);

  if (categories.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat, i) => {
          const imgs = cat.productIds.map((id) => get(id)?.imageUrl).filter(Boolean) as string[];
          return (
            <button
              key={cat.id}
              onClick={() => setCurrent(i)}
              className={`flex-none flex flex-col items-center gap-2 p-3 rounded-xl transition-all min-w-[90px] ${
                i === current ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative h-14 w-16 flex items-end justify-center">
                {imgs.slice(0, 3).map((src, ri) => (
                  <img
                    key={ri}
                    src={src}
                    alt=""
                    className="absolute object-contain"
                    style={{
                      width: 34,
                      height: 46,
                      left: `${ri * 13}px`,
                      bottom: 0,
                      transform: `rotate(${(ri - 1) * 6}deg)`,
                      zIndex: 3 - ri,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                    }}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-foreground text-center leading-tight">{cat.label}</p>
              {cat.subtitle && <p className="text-xs text-muted-foreground text-center leading-tight">{cat.subtitle}</p>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Novidades tab ─────────────────────────────────────────────────────────────

function NovidadesTab({ products }: { products: Product[] }) {
  const [items, setItems] = useState<NovidadesItem[]>([]);
  const [picker, setPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'sections', 'novidades')).then((snap) => {
      if (snap.exists()) setItems((snap.data() as SectionNovidades).items ?? []);
    });
  }, []);

  const getProduct = (id: string) => products.find((p) => p.id === id);

  const addItem = (p: Product) => {
    setItems((prev) => [...prev, { productId: p.id, tag: '', description: '' }]);
  };

  const removeItem = (i: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i));

  const updateItem = (i: number, patch: Partial<NovidadesItem>) =>
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));

  const handleSave = async () => {
    setSaving(true);
    await setDoc(doc(db, 'sections', 'novidades'), { items });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Produtos exibidos na seção de novidades (máx. recomendado: 4).
      </p>

      {items.map((item, i) => {
        const p = getProduct(item.productId);
        return (
          <div key={i} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 items-start">
            <GripVertical className="w-4 h-4 text-muted-foreground mt-2 shrink-0 cursor-grab" />

            <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl overflow-hidden flex items-center justify-center">
              {p?.imageUrl && (
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain p-1" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-foreground">{p?.name ?? item.productId}</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={item.tag ?? ''}
                  onChange={(e) => updateItem(i, { tag: e.target.value })}
                  placeholder="Tag (ex: LANÇAMENTO)"
                  className="px-3 py-1.5 border border-border rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  value={item.description}
                  onChange={(e) => updateItem(i, { description: e.target.value })}
                  placeholder="Descrição do produto"
                  className="px-3 py-1.5 border border-border rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <button
              onClick={() => removeItem(i)}
              className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}

      <button
        onClick={() => setPicker(true)}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-border hover:border-primary/40 rounded-2xl text-sm text-muted-foreground hover:text-primary transition-colors w-full justify-center"
      >
        <Plus className="w-4 h-4" />
        Adicionar produto
      </button>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        {saved ? 'Salvo!' : saving ? 'Salvando…' : 'Salvar'}
      </button>

      {picker && (
        <ProductPicker products={products} onSelect={addItem} onClose={() => setPicker(false)} />
      )}

      {items.length > 0 && (
        <div className="pt-6 border-t border-gray-100 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pré-visualização</p>
          <NovidadesPreview items={items} products={products} />
        </div>
      )}
    </div>
  );
}

// ── Pipoca Gravatá tab ────────────────────────────────────────────────────────

function PipocaTab({ products }: { products: Product[] }) {
  const [categories, setCategories] = useState<PipocaCategory[]>([]);
  const [picker, setPicker] = useState<{ catIdx: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'sections', 'pipoca-gravata')).then((snap) => {
      if (snap.exists()) setCategories((snap.data() as SectionPipoca).categories ?? []);
    });
  }, []);

  const getProduct = (id: string) => products.find((p) => p.id === id);

  const addCategory = () =>
    setCategories((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: '', subtitle: '', productIds: [] },
    ]);

  const removeCategory = (i: number) =>
    setCategories((prev) => prev.filter((_, idx) => idx !== i));

  const updateCategory = (i: number, patch: Partial<PipocaCategory>) =>
    setCategories((prev) =>
      prev.map((cat, idx) => (idx === i ? { ...cat, ...patch } : cat)),
    );

  const addProductToCategory = (catIdx: number, p: Product) => {
    setCategories((prev) =>
      prev.map((cat, idx) => {
        if (idx !== catIdx) return cat;
        if (cat.productIds.includes(p.id)) return cat;
        return { ...cat, productIds: [...cat.productIds.slice(0, 2), p.id] };
      }),
    );
  };

  const removeProductFromCategory = (catIdx: number, productId: string) =>
    setCategories((prev) =>
      prev.map((cat, idx) =>
        idx === catIdx
          ? { ...cat, productIds: cat.productIds.filter((id) => id !== productId) }
          : cat,
      ),
    );

  const handleSave = async () => {
    setSaving(true);
    await setDoc(doc(db, 'sections', 'pipoca-gravata'), { categories });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Categorias exibidas no carrossel de Pipoca Gravatá (até 3 produtos por categoria).
      </p>

      {categories.map((cat, i) => (
        <div key={cat.id} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input
                value={cat.label}
                onChange={(e) => updateCategory(i, { label: e.target.value })}
                placeholder="Nome da categoria (ex: Amanteigadas)"
                className="px-3 py-2 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                value={cat.subtitle}
                onChange={(e) => updateCategory(i, { subtitle: e.target.value })}
                placeholder="Subtítulo (ex: A linha clássica)"
                className="px-3 py-2 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              onClick={() => removeCategory(i)}
              className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {cat.productIds.map((pid) => {
              const p = getProduct(pid);
              return (
                <div key={pid} className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl overflow-hidden flex items-center justify-center">
                    {p?.imageUrl && (
                      <img src={p.imageUrl} alt={p?.name} className="w-full h-full object-contain p-1" />
                    )}
                  </div>
                  <button
                    onClick={() => removeProductFromCategory(i, pid)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-border rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              );
            })}

            {cat.productIds.length < 3 && (
              <button
                onClick={() => setPicker({ catIdx: i })}
                className="w-16 h-16 border-2 border-dashed border-border hover:border-primary/40 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={addCategory}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-border hover:border-primary/40 rounded-2xl text-sm text-muted-foreground hover:text-primary transition-colors w-full justify-center"
      >
        <Plus className="w-4 h-4" />
        Adicionar categoria
      </button>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        {saved ? 'Salvo!' : saving ? 'Salvando…' : 'Salvar'}
      </button>

      {picker && (
        <ProductPicker
          products={products}
          title="Adicionar produto à categoria"
          onSelect={(p) => { addProductToCategory(picker.catIdx, p); setPicker(null); }}
          onClose={() => setPicker(null)}
        />
      )}

      {categories.length > 0 && (
        <div className="pt-6 border-t border-gray-100 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pré-visualização</p>
          <PipocaPreview categories={categories} products={products} />
        </div>
      )}
    </div>
  );
}

// ── Brands tab ────────────────────────────────────────────────────────────────

function BrandsTab({ products }: { products: Product[] }) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [picker, setPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'sections', 'brands')).then((snap) => {
      if (snap.exists()) setProductIds((snap.data() as SectionBrands).productIds ?? []);
    });
  }, []);

  const getProduct = (id: string) => products.find((p) => p.id === id);

  const addProduct = (p: Product) => {
    if (!productIds.includes(p.id)) setProductIds((prev) => [...prev, p.id]);
  };

  const removeProduct = (id: string) =>
    setProductIds((prev) => prev.filter((pid) => pid !== id));

  const handleSave = async () => {
    setSaving(true);
    await setDoc(doc(db, 'sections', 'brands'), { productIds });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Produtos exibidos na órbita da seção Nordeste Gravatá.
      </p>

      <div className="flex flex-wrap gap-3">
        {productIds.map((pid) => {
          const p = getProduct(pid);
          return (
            <div key={pid} className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/10 rounded-2xl overflow-hidden flex items-center justify-center">
                {p?.imageUrl ? (
                  <img src={p.imageUrl} alt={p?.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-xs text-muted-foreground text-center p-1">{p?.name}</span>
                )}
              </div>
              <button
                onClick={() => removeProduct(pid)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-border rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          );
        })}

        <button
          onClick={() => setPicker(true)}
          className="w-20 h-20 border-2 border-dashed border-border hover:border-primary/40 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        {saved ? 'Salvo!' : saving ? 'Salvando…' : 'Salvar'}
      </button>

      {picker && (
        <ProductPicker
          products={products}
          onSelect={(p) => { addProduct(p); setPicker(false); }}
          onClose={() => setPicker(false)}
        />
      )}

      {productIds.length > 0 && (() => {
        const wheelProducts = productIds
          .map((id) => products.find((p) => p.id === id))
          .filter((p): p is Product => p !== undefined)
          .slice(0, 7);
        return (
          <div className="pt-6 border-t border-gray-100 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pré-visualização</p>
            <div style={{ width: 350, height: 350, overflow: 'hidden', margin: '0 auto', position: 'relative' }}>
              <div style={{ transform: 'scale(0.7)', transformOrigin: 'top left', width: 500, height: 500, position: 'absolute' }}>
                <ProductWheel products={wheelProducts} />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── Banner preview ────────────────────────────────────────────────────────────

function BannerPreview({ items }: { items: BannerItem[] }) {
  const [index, setIndex]   = useState(0);
  const timerRef            = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (items.length < 2) return;
    const tick = () => {
      setIndex((i) => (i + 1) % items.length);
      timerRef.current = setTimeout(tick, 3500);
    };
    timerRef.current = setTimeout(tick, 3500);
    return () => clearTimeout(timerRef.current);
  }, [items.length]);

  useEffect(() => { setIndex(0); }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-black relative select-none" style={{ aspectRatio: '2/1' }}>
      {items.map((item, i) => (
        <img
          key={item.id}
          src={item.imageUrl}
          alt={item.alt || 'Banner'}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}

      {/* overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      {/* dots */}
      {items.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); clearTimeout(timerRef.current); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* slide counter */}
      <span className="absolute top-3 right-3 text-xs text-white/80 font-semibold bg-black/30 px-2 py-0.5 rounded-full">
        {index + 1} / {items.length}
      </span>
    </div>
  );
}

// ── Banners tab ───────────────────────────────────────────────────────────────

function BannersTab() {
  const [items, setItems]     = useState<BannerItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const fileInputRef          = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getDoc(doc(db, 'sections', 'banners')).then((snap) => {
      if (snap.exists()) setItems((snap.data() as SectionBanners).items ?? []);
    });
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newItems: BannerItem[] = [];
    for (const file of Array.from(files)) {
      const id  = crypto.randomUUID();
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `banners/${id}/image.${ext}`;
      const sRef = storageRef(storage, path);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      newItems.push({ id, imageUrl: url, imagePath: path, alt: '' });
    }
    setItems((prev) => [...prev, ...newItems]);
    setUploading(false);
  };

  const handleRemove = async (item: BannerItem) => {
    if (!confirm(`Remover este banner?`)) return;
    await deleteObject(storageRef(storage, item.imagePath)).catch(() => {});
    setItems((prev) => prev.filter((b) => b.id !== item.id));
  };

  const updateAlt = (id: string, alt: string) =>
    setItems((prev) => prev.map((b) => (b.id === id ? { ...b, alt } : b)));

  const handleSave = async () => {
    setSaving(true);
    await setDoc(doc(db, 'sections', 'banners'), { items });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Imagens exibidas no carrossel da seção principal (Hero). A ordem de upload determina a ordem de exibição.
      </p>

      {/* Banner list */}
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 items-center">
          <div
            className="w-36 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center"
            style={{ aspectRatio: '2/1' }}
          >
            <img src={item.imageUrl} alt={item.alt} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-1.5">
            <p className="text-xs text-muted-foreground font-mono truncate">{item.imagePath}</p>
            <input
              value={item.alt}
              onChange={(e) => updateAlt(item.id, e.target.value)}
              placeholder="Texto alternativo (ex: São João FAL)"
              className="w-full px-3 py-1.5 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            onClick={() => handleRemove(item)}
            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            title="Remover banner"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Upload button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-border hover:border-primary/40 rounded-2xl text-sm text-muted-foreground hover:text-primary transition-colors w-full justify-center disabled:opacity-50"
      >
        {uploading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Enviando…</>
        ) : (
          <><ImagePlus className="w-4 h-4" /> Adicionar imagem</>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving || uploading}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        {saved ? 'Salvo!' : saving ? 'Salvando…' : 'Salvar'}
      </button>

      {/* Preview */}
      {items.length > 0 && (
        <div className="pt-6 border-t border-gray-100 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pré-visualização</p>
          <BannerPreview items={items} />
        </div>
      )}
    </div>
  );
}

// ── Instagram helpers ─────────────────────────────────────────────────────────

function extractShortcode(input: string): { shortcode: string; type: 'post' | 'reel' } | null {
  const trimmed = input.trim();
  const postMatch = trimmed.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/);
  if (postMatch) return { shortcode: postMatch[1], type: 'post' };
  const reelMatch = trimmed.match(/instagram\.com\/reels?\/([A-Za-z0-9_-]+)/);
  if (reelMatch) return { shortcode: reelMatch[1], type: 'reel' };
  if (/^[A-Za-z0-9_-]+$/.test(trimmed)) return { shortcode: trimmed, type: 'post' };
  return null;
}

// ── Instagram tab ─────────────────────────────────────────────────────────────

function InstagramTab() {
  const [posts, setPosts]     = useState<InstagramPost[]>([]);
  const [input, setInput]     = useState('');
  const [error, setError]     = useState('');
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'sections', 'instagram')).then((snap) => {
      if (snap.exists()) setPosts((snap.data() as SectionInstagram).posts ?? []);
    });
  }, []);

  const handleAdd = () => {
    const result = extractShortcode(input);
    if (!result) {
      setError('URL inválida. Cole o link completo do post ou reel do Instagram.');
      return;
    }
    const { shortcode, type } = result;
    if (posts.some((p) => p.shortcode === shortcode)) {
      setError('Este post já foi adicionado.');
      return;
    }
    const path = type === 'reel' ? 'reel' : 'p';
    const url = `https://www.instagram.com/${path}/${shortcode}/`;
    setPosts((prev) => [...prev, { id: crypto.randomUUID(), shortcode, url, type }]);
    setInput('');
    setError('');
  };

  const handleRemove = (id: string) =>
    setPosts((prev) => prev.filter((p) => p.id !== id));

  const handleSave = async () => {
    setSaving(true);
    await setDoc(doc(db, 'sections', 'instagram'), { posts });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Posts do Instagram exibidos na seção da página inicial. Cole o link do post para adicionar.
      </p>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="https://www.instagram.com/p/ABC123/"
          className="flex-1 px-3 py-2 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Post list */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-border rounded-2xl text-muted-foreground text-sm gap-2">
          <Instagram className="w-6 h-6" />
          <p>Nenhum post adicionado ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden"
            >
              {/* URL row */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs font-bold text-muted-foreground w-5 text-center shrink-0">{index + 1}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  post.type === 'reel'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {post.type === 'reel' ? 'Reel' : 'Post'}
                </span>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm text-primary hover:underline font-mono truncate"
                >
                  {post.url}
                </a>
                <button
                  onClick={() => handleRemove(post.id)}
                  className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="Remover post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Inline embed preview */}
              <div className="border-t border-gray-100 overflow-hidden" style={{ height: 360 }}>
                <iframe
                  src={`https://www.instagram.com/${post.type === 'reel' ? 'reel' : 'p'}/${post.shortcode}/embed/`}
                  style={{ width: '100%', height: '600px', border: 'none', display: 'block' }}
                  scrolling="no"
                  allowTransparency
                  loading="lazy"
                  title={`Preview ${post.type} ${post.shortcode}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        {saved ? 'Salvo!' : saving ? 'Salvando…' : 'Salvar'}
      </button>

    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const TABS = ['Novidades', 'Pipocas Gravatá', 'Nordeste Gravatá', 'Banners', 'Instagram'] as const;
type Tab = typeof TABS[number];

export default function SectionsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Novidades');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'products'), orderBy('name')),
      (snap) => setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product))),
    );
    return unsub;
  }, []);

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-2">Seções</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Configure os grupos de produtos exibidos em cada seção do site.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Novidades'       && <NovidadesTab products={products} />}
      {activeTab === 'Pipocas Gravatá' && <PipocaTab    products={products} />}
      {activeTab === 'Nordeste Gravatá'&& <BrandsTab    products={products} />}
      {activeTab === 'Banners'         && <BannersTab />}
      {activeTab === 'Instagram'       && <InstagramTab />}
    </div>
  );
}
