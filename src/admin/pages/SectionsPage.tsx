import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Plus, X, Search, Loader2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from '../../lib/firebase';
import type {
  Product,
  SectionNovidades,
  SectionPipoca,
  SectionBrands,
  NovidadesItem,
  PipocaCategory,
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
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const TABS = ['Novidades', 'Pipoca Gravatá', 'Brands'] as const;
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

      {activeTab === 'Novidades'      && <NovidadesTab products={products} />}
      {activeTab === 'Pipoca Gravatá' && <PipocaTab    products={products} />}
      {activeTab === 'Brands'         && <BrandsTab    products={products} />}
    </div>
  );
}
