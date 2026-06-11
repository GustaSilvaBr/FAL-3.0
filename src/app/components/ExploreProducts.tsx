import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, X, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { NUTRITION_FIELDS, type Product, type Folder } from '../../lib/types';
import { preloadImages } from '../../lib/imageCache';
import { useProductNavigation } from '../../lib/productNavigation';

const weightRanges = [
  { label: 'Até 15g',    min: 0,  max: 15 },
  { label: '16g – 40g', min: 16, max: 40 },
  { label: '41g – 60g', min: 41, max: 60 },
  { label: 'Acima de 60g', min: 61, max: Infinity },
];

function parseWeight(weight: string): number | null {
  const m = weight?.match(/(\d+)/);
  return m ? parseInt(m[1]) : null;
}

const ITEMS_PER_PAGE = 9;

export default function ExploreProducts({ onLoad }: { onLoad?: () => void }) {
  const [products, setProducts]             = useState<Product[]>([]);
  const [folders, setFolders]               = useState<Folder[]>([]);
  const [search, setSearch]                 = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen]       = useState(false);
  const [currentPage, setCurrentPage]       = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [freshFolder, setFreshFolder]         = useState<string | null>(null);
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);

  const { pendingProduct, clearPendingProduct } = useProductNavigation();

  const filterRef  = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef    = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // ── Fetch data once ──────────────────────────────────────────────────────────
  const loadReported = useRef(false);
  useEffect(() => {
    Promise.all([
      fetch('/api/folders.php').then((r) => r.json()),
      fetch('/api/products.php').then((r) => r.json()),
    ]).then(([folderRows, productRows]: [Folder[], Product[]]) => {
      setFolders([...folderRows].sort((a, b) => a.name.localeCompare(b.name)));
      const prods = [...productRows].sort((a, b) => a.name.localeCompare(b.name));
      setProducts(prods);
      if (!loadReported.current) {
        loadReported.current = true;
        preloadImages(prods.map((p) => p.imageUrl));
        onLoad?.();
      }
    }).catch(() => { onLoad?.(); });
  }, [onLoad]);

  // ── Tab scroll state ─────────────────────────────────────────────────────────
  const updateScrollState = () => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollTabs = (dir: 'left' | 'right') => {
    tabsRef.current?.scrollBy({ left: dir === 'left' ? -160 : 160, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', updateScrollState); ro.disconnect(); };
  }, []);

  // ── Click outside → close filter dropdown ───────────────────────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Keyboard: Escape closes modal ────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedProduct(null); };
    if (selectedProduct) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedProduct]);

  // ── Step-by-step product navigation ─────────────────────────────────────────
  useEffect(() => {
    if (!pendingProduct || !products.length || !folders.length) return;

    const folder      = folders.find((f) => f.id === pendingProduct.folderId);
    const topFolderId = folder?.parentId ?? folder?.id ?? null;

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    timeouts.push(setTimeout(() => {
      if (cancelled) return;
      setSelectedFolder(topFolderId);
      setFreshFolder(topFolderId);
      setSearch('');
      setSelectedWeight(null);

      timeouts.push(setTimeout(() => {
        if (cancelled) return;
        setHighlightedProductId(pendingProduct.id);

        timeouts.push(setTimeout(() => {
          if (cancelled) return;
          setSelectedProduct(pendingProduct);
          clearPendingProduct();
          timeouts.push(setTimeout(() => {
            setFreshFolder(null);
            setHighlightedProductId(null);
          }, 600));
        }, 420));
      }, 520));
    }, 900));

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingProduct]);

  // ── Derived data ─────────────────────────────────────────────────────────────
  const folderMap = useMemo<Record<string, string>>(
    () => Object.fromEntries(folders.map((f) => [f.id, f.name])),
    [folders],
  );

  const folderById = useMemo<Record<string, { keywords?: string[]; parentId?: string }>>(
    () => Object.fromEntries(folders.map((f) => [f.id, { keywords: f.keywords, parentId: f.parentId }])),
    [folders],
  );

  const childFolderIds = useMemo(() => {
    const map: Record<string, string[]> = {};
    folders.forEach((f) => {
      if (f.parentId) {
        (map[f.parentId] ??= []).push(f.id);
      }
    });
    return map;
  }, [folders]);

  const topLevelFolders = useMemo(
    () => folders.filter((f) => !f.parentId),
    [folders],
  );

  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    topLevelFolders.forEach((f) => {
      const allIds = [f.id, ...(childFolderIds[f.id] ?? [])];
      counts[f.id] = products.filter((p) => allIds.includes(p.folderId)).length;
    });
    return counts;
  }, [topLevelFolders, childFolderIds, products]);

  const sortedTopLevelFolders = useMemo(() => {
    return [...topLevelFolders].sort((a, b) => {
      const aIsPipoca   = a.name.toLowerCase().includes('pipoca');
      const bIsPipoca   = b.name.toLowerCase().includes('pipoca');
      const aIsSelected = a.id === selectedFolder;
      const bIsSelected = b.id === selectedFolder;
      if (aIsPipoca !== bIsPipoca) return aIsPipoca ? -1 : 1;
      if (!aIsPipoca && !bIsPipoca && aIsSelected !== bIsSelected) return aIsSelected ? -1 : 1;
      return (folderCounts[b.id] ?? 0) - (folderCounts[a.id] ?? 0);
    });
  }, [topLevelFolders, folderCounts, selectedFolder]);

  const filtered = useMemo(() => {
    setCurrentPage(1);
    const base = products.filter((p) => {
      if (search) {
        const term   = search.toLowerCase();
        const folder = folderById[p.folderId];
        const parent = folder?.parentId ? folderById[folder.parentId] : undefined;
        const keywords = [...(folder?.keywords ?? []), ...(parent?.keywords ?? [])];
        const matches  = p.name.toLowerCase().includes(term) ||
                         keywords.some((k) => k.includes(term));
        if (!matches) return false;
      }
      if (selectedFolder) {
        const allIds = [selectedFolder, ...(childFolderIds[selectedFolder] ?? [])];
        if (!allIds.includes(p.folderId)) return false;
      }
      if (selectedWeight) {
        const w = parseWeight(p.weight);
        const range = weightRanges.find((r) => r.label === selectedWeight);
        if (w !== null && range && (w < range.min || w > range.max)) return false;
      }
      return true;
    });
    if (highlightedProductId) {
      const idx = base.findIndex((p) => p.id === highlightedProductId);
      if (idx > 0) {
        const reordered = [...base];
        reordered.unshift(...reordered.splice(idx, 1));
        return reordered;
      }
    }
    return base;
  }, [search, selectedFolder, selectedWeight, products, childFolderIds, folderById, highlightedProductId]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const clearAll = () => { setSelectedFolder(null); setSelectedWeight(null); setSearch(''); };

  // ── Nutrition display rows for modal ─────────────────────────────────────────
  const nutritionRows = selectedProduct
    ? NUTRITION_FIELDS.map((field) => ({
        label:   field.label,
        per100g: selectedProduct.nutrition?.[field.key]?.per100g ?? '—',
        per10g:  selectedProduct.nutrition?.[field.key]?.per10g  ?? '—',
        vd:      field.noVd ? '—' : (selectedProduct.nutrition?.[field.key]?.vd ?? '—'),
        indent:  field.indent ?? false,
      }))
    : [];

  return (
    <>
      <section id="produtos" ref={sectionRef} className="bg-gradient-to-br from-accent/20 to-primary/10 py-16">
        <div className="w-full px-4 sm:px-8 lg:px-12">

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3">Nossos Produtos</h2>
            <p className="text-lg" style={{ color: '#666' }}>Explore o sabor autêntico do Nordeste.</p>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-3 py-4 border-b border-border mb-8 flex-wrap">

            {/* Search */}
            <div className="relative shrink-0 w-52">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar produtos"
                className="w-full pl-4 pr-9 py-2.5 rounded-full border border-border bg-white text-foreground placeholder-muted-foreground text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {search ? (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              )}
            </div>

            {/* Filters dropdown */}
            <div className="relative shrink-0" ref={filterRef}>
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide bg-primary text-white shadow-sm hover:shadow-md transition-all"
              >
                Filtros
                <SlidersHorizontal className="w-4 h-4" />
                {selectedWeight && (
                  <span className="ml-0.5 w-5 h-5 rounded-full bg-white/25 text-white text-xs font-bold flex items-center justify-center">1</span>
                )}
              </button>

              <AnimatePresence>
                {filtersOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-border z-30 p-5"
                  >
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Por Peso</h3>
                    <div className="flex flex-wrap gap-2">
                      {weightRanges.map((r) => (
                        <button
                          key={r.label}
                          onClick={() => setSelectedWeight(selectedWeight === r.label ? null : r.label)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            selectedWeight === r.label ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-muted/70'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                    {selectedWeight && (
                      <button
                        onClick={() => { setSelectedWeight(null); setFiltersOpen(false); }}
                        className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                      >
                        Limpar filtro de peso
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-7 bg-border shrink-0" />

            {/* Category chips */}
            <div className="relative flex items-center flex-1 min-w-0">
              {canScrollLeft && (
                <button
                  onClick={() => scrollTabs('left')}
                  className="shrink-0 z-10 bg-white border border-border rounded-full p-1.5 shadow-sm hover:shadow-md transition-all mr-1"
                >
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
              )}
              <div ref={tabsRef} className="flex items-center gap-2 overflow-x-auto flex-1" style={{ scrollbarWidth: 'none' }}>
                {/* "All" chip */}
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide whitespace-nowrap shrink-0 transition-all ${
                    selectedFolder === null ? 'bg-primary text-white shadow-sm' : 'bg-white border border-border text-foreground hover:border-primary/40'
                  }`}
                >
                  Todos
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.4rem] text-center ${selectedFolder === null ? 'bg-white/25 text-white' : 'bg-foreground/10 text-foreground/70'}`}>
                    {products.length}
                  </span>
                </button>

                {sortedTopLevelFolders.map((folder) => {
                  const isPipoca = folder.name.toLowerCase().includes('pipoca gravatá') || folder.name.toLowerCase().includes('pipoca gravata');
                  const isActive = selectedFolder === folder.id;
                  const isFresh  = freshFolder === folder.id;
                  return (
                    <motion.button
                      key={folder.id}
                      onClick={() => setSelectedFolder(isActive ? null : folder.id)}
                      animate={isFresh ? { scale: [1, 1.12, 1.06, 1] } : { scale: 1 }}
                      transition={{ duration: 0.45 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide whitespace-nowrap shrink-0 transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : isPipoca
                          ? 'bg-yellow-50 border border-yellow-300 text-foreground hover:bg-yellow-100'
                          : 'bg-white border border-border text-foreground hover:border-primary/40'
                      } ${isFresh ? 'ring-2 ring-accent shadow-lg shadow-accent/30' : ''}`}
                    >
                      {isPipoca && (
                        <Star className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'fill-white text-white' : 'fill-yellow-400 text-yellow-400'}`} />
                      )}
                      {folder.name}
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.4rem] text-center ${isActive ? 'bg-white/25 text-white' : 'bg-foreground/10 text-foreground/70'}`}>
                        {folderCounts[folder.id] ?? 0}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {canScrollRight && (
                <button
                  onClick={() => scrollTabs('right')}
                  className="shrink-0 z-10 bg-white border border-border rounded-full p-1.5 shadow-sm hover:shadow-md transition-all ml-1"
                >
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 text-muted-foreground">
              <p className="text-xl mb-4">
                {products.length === 0 ? 'Nenhum produto cadastrado ainda.' : 'Nenhum produto encontrado.'}
              </p>
              {products.length > 0 && (
                <button onClick={clearAll} className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Limpar filtros
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={search + String(selectedFolder) + String(selectedWeight) + currentPage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-3 gap-6 max-w-4xl mx-auto"
                >
                  {paginated.map((product, i) => {
                    const isHighlighted = highlightedProductId === product.id;
                    return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={isHighlighted
                        ? { opacity: 1, scale: [1, 1.06, 1.03, 1] }
                        : { opacity: 1, scale: 1 }}
                      transition={{ duration: isHighlighted ? 0.5 : 0.2, delay: isHighlighted ? 0 : i * 0.04 }}
                      onClick={() => setSelectedProduct(product)}
                      className={`bg-white rounded-2xl transition-all duration-300 flex flex-col p-3 gap-3 cursor-pointer hover:shadow-lg ${
                        isHighlighted ? 'ring-4 ring-accent shadow-xl shadow-accent/20' : ''
                      }`}
                    >
                      <div className="h-72 bg-gradient-to-br from-accent/20 to-primary/10 rounded-2xl p-4 flex items-center justify-center overflow-hidden group">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-4xl opacity-30">📦</span>
                        )}
                      </div>
                      <div className="px-2 pb-2 flex flex-col flex-1 gap-3">
                        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 text-center">
                          {product.name}
                        </h3>
                        <button className="mt-auto w-full py-2.5 px-3 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all duration-200">
                          Confira a tabela nutricional
                        </button>
                      </div>
                    </motion.div>
                  );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-border bg-white hover:border-primary/40 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                        currentPage === page ? 'bg-primary text-white shadow-sm' : 'bg-white border border-border text-foreground hover:border-primary/40'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border border-border bg-white hover:border-primary/40 disabled:opacity-30 transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              )}
            </>
          )}


        </div>
      </section>

      {/* ── Product detail modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedProduct(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-3xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Left — product image */}
              <div className="w-2/5 shrink-0 bg-gradient-to-br from-accent/30 to-primary/15 flex items-center justify-center p-10">
                {selectedProduct.imageUrl ? (
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="max-h-[65vh] w-full object-contain drop-shadow-xl"
                  />
                ) : (
                  <span className="text-6xl opacity-30">📦</span>
                )}
              </div>

              {/* Right — info + nutrition */}
              <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-3">
                      {folderMap[selectedProduct.folderId] ?? 'Produto'}
                    </span>
                    <h2 className="text-2xl font-bold text-foreground leading-tight">
                      {selectedProduct.name}
                    </h2>
                    {selectedProduct.weight && (
                      <p className="text-sm text-muted-foreground mt-1">{selectedProduct.weight}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="shrink-0 p-2 rounded-full hover:bg-muted transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Nutrition table */}
                <div className="border border-border rounded-xl overflow-hidden text-xs">
                  <div className="bg-foreground text-background px-4 py-2.5 text-center font-bold text-sm uppercase tracking-wider">
                    Informação Nutricional
                  </div>
                  <div className="px-4 py-2.5 border-b border-border bg-muted/30 space-y-0.5">
                    <p className="text-muted-foreground">Porção por embalagem: cerca de 4 porções</p>
                    <p className="font-semibold text-foreground">Porção: 10 g (1 xícara)</p>
                  </div>
                  <div className="grid grid-cols-[1fr_3rem_3rem_3rem] border-b-2 border-foreground/20 bg-muted/20">
                    <div className="px-4 py-2" />
                    <div className="py-2 text-center font-bold text-foreground">100g</div>
                    <div className="py-2 text-center font-bold text-foreground">10g</div>
                    <div className="py-2 text-center font-bold text-foreground">%VD*</div>
                  </div>
                  {nutritionRows.map((row, i) => (
                    <div
                      key={row.label}
                      className={`grid grid-cols-[1fr_3rem_3rem_3rem] border-b border-border last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-muted/15'}`}
                    >
                      <div className={`px-4 py-2 font-medium text-foreground ${row.indent ? 'pl-8 text-muted-foreground' : ''}`}>
                        {row.label}
                      </div>
                      <div className="py-2 text-center text-muted-foreground">{row.per100g}</div>
                      <div className="py-2 text-center font-semibold text-foreground">{row.per10g}</div>
                      <div className="py-2 text-center text-muted-foreground">{row.vd}</div>
                    </div>
                  ))}
                  <div className="px-4 py-2.5 bg-muted/10 border-t border-border text-muted-foreground italic">
                    *Percentual de valores diários fornecidos pela porção
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
