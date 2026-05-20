import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, X, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const heroUrl = new URL('../../assets/hero.png', import.meta.url).href;

const products = [
  // Amendoim
  { name: 'Amendoim', category: 'Amendoim', image: new URL('../../assets/products/Amendoim/amendoim.jpeg', import.meta.url).href },
  // Batata Chips
  { name: 'Batata Chips Original', category: 'Batata Chips', image: new URL('../../assets/products/Batata Chips/batatachips_original.jpeg', import.meta.url).href },
  { name: 'Batata Chips Cebola & Salsa', category: 'Batata Chips', image: new URL('../../assets/products/Batata Chips/batatachips_cebola_salsa.jpeg', import.meta.url).href },
  { name: 'Batata Chips Churrasco', category: 'Batata Chips', image: new URL('../../assets/products/Batata Chips/batatachips_churrasco.jpeg', import.meta.url).href },
  // Bolinhos de Goma
  { name: 'Bolinhos de Goma 50g', category: 'Bolinhos de Goma', image: new URL('../../assets/products/Bolinhos de Goma/bolinhos_De_goma_50g.png', import.meta.url).href },
  { name: 'Bolinhos de Goma 90g', category: 'Bolinhos de Goma', image: new URL('../../assets/products/Bolinhos de Goma/bolinhos_de_goma_90g.png', import.meta.url).href },
  // Paçoca
  { name: 'Paçoca', category: 'Paçoca', image: new URL('../../assets/products/Paçoca/paçoca.jpeg', import.meta.url).href },
  // Pipoca Gravatá — Amanteigadas
  { name: 'Pipoca Gravatá 10g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_yellow.jpeg', import.meta.url).href },
  { name: 'Pipoca Gravatá 10g Branca', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_white.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá 14g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_14g_0trans_white.jpeg', import.meta.url).href },
  { name: 'Pipoca Gravatá Sem Sal 10g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_sem_sal.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá 30g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_30g_0trans_white.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá 40g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_40g_0trans_white.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá 72g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_72g_0trans_white.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá 90g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_90g_0trans_white.jpeg', import.meta.url).href },
  // Pipoca Gravatá — Doces
  { name: 'Pipoca Gravatá Doce 10g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_10g_0trans_doce.jpeg', import.meta.url).href },
  { name: 'Pipoca Gravatá Doce 14g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_14g_0trans_doce.jpeg', import.meta.url).href },
  { name: 'Pipoca Gravatá Amendoim Doce 12g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_12g_0trans_amendoim_doce.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá Doce 30g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipocao_gravatá_30g_0trans_doce.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá Amendoim Doce 30g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipocao_gravatá_30g_0trans_amendoim_doce.jpeg', import.meta.url).href },
  // Pipoca Gravatá — Gourmet
  { name: 'Pipoca Gravatá Chocolate Gourmet 15g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Gourmet/pipoca_gravatá_15g_0trans_sabor_chocolate_gourmet.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá Chocolate Gourmet 45g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Gourmet/pipocao_gravatá_45g_0trans_chocolate_gourmet.jpeg', import.meta.url).href },
  // Pipoca Gravatá — Premium
  { name: 'Pipoca Gravatá Himalaia Premium 15g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Premium/pipoca_gravatá_15g_0trans_himalaia_premium.jpeg', import.meta.url).href },
  { name: 'Pipoca Gravatá Himalaia Premium 40g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Premium/pipoca_gravatá_40g_0trans_himalaia_premium.jpeg', import.meta.url).href },
  // Salgadinhos — Pipofloc's
  { name: "Pipofloc's Churrasco 13g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_churrasco_13g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Milho 13g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_milho_13g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Queijo 13g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_queijo_13g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Requeijão 13g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_requeijão_13g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Cebola 13g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_cebola_13g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Cebola & Salsa 20g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_cebola_salsa_20g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Churrasco 20g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_churrasco_20g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Queijo 20g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_queijo_20g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Requeijão 20g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_requeijão_20g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Cebola & Salsa 40g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_cebola_salsa_40g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Churrasco 40g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_churrasco_40g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Queijo 40g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_queijo_40g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Requeijão 40g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_requeijão_40g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Cebola 42g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_cebola_42g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Milho 42g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_milho_42g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Presunto 42g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_presunto_42g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Queijo 42g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_queijo_42g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Requeijão 42g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_requeijão_42g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Cebola 55g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_cebola_55g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Churrasco 55g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_churrasco_55g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Milho 55g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_milho_55g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Queijo 55g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_queijo_55g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Presunto 55g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_presunto_55g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Requeijão 55g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_requeijão_55g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Cebola & Salsa 50g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_cebola_salsa_50g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Churrasco Brasa 50g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_churrasco_brasa_50g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Churrasco 50g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_churrasco_50g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Queijo 50g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_queijo_50g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Requeijão 50g", category: 'Salgadinhos', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_requeijão_50g.jpeg", import.meta.url).href },
  // Salgadinhos — Iaê
  { name: 'Iaê Acebolado 30g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_acebolado_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Churrasco 30g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_churrasco_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Galinha 30g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_galinha_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Milho 30g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_milho_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Presunto 30g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_presunto_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Queijo Suíço 30g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_queijo_suiço_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Requeijão 30g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_requeijão_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Acebolado 60g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_acebolado_60g.jpeg', import.meta.url).href },
  { name: 'Iaê Costelinha com Limão 60g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_costelinha_limao_60g.jpeg', import.meta.url).href },
  { name: 'Iaê Milho 60g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_milho_60g.jpeg', import.meta.url).href },
  { name: 'Iaê Queijo Suíço 60g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_queijo_suiço_60g.jpeg', import.meta.url).href },
  { name: 'Iaê Requeijão 60g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_requeijão_60g.jpeg', import.meta.url).href },
  // Salgadinhos — Qi-Flocs
  { name: 'Qi-Flocs Milho 40g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Qi-Flocs/qi_flocs_milho_40g.jpeg', import.meta.url).href },
  { name: 'Qi-Flocs Cebola & Salsa 40g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Qi-Flocs/qi_flocs_cebola_salsa_40g.jpeg', import.meta.url).href },
  { name: 'Qi-Flocs Queijo 40g', category: 'Salgadinhos', image: new URL('../../assets/products/Salgadinhos/Qi-Flocs/qi_flocs_queijo_40g.jpeg', import.meta.url).href },
  // Salgadinhos de Trigo — Belleza
  { name: 'Belleza Cebola & Salsa 40g', category: 'Salgadinhos de Trigo', image: new URL('../../assets/products/Salgadinhos de Trigo/Belleza/belleza_cebola_salsa_40g.jpeg', import.meta.url).href },
  { name: 'Belleza Churrasco 40g', category: 'Salgadinhos de Trigo', image: new URL('../../assets/products/Salgadinhos de Trigo/Belleza/belleza_churrasco_40g.jpeg', import.meta.url).href },
  { name: 'Belleza Frango 40g', category: 'Salgadinhos de Trigo', image: new URL('../../assets/products/Salgadinhos de Trigo/Belleza/belleza_frango_40g.jpeg', import.meta.url).href },
  { name: 'Belleza Pimenta 40g', category: 'Salgadinhos de Trigo', image: new URL('../../assets/products/Salgadinhos de Trigo/Belleza/belleza_pimenta_40g.jpeg', import.meta.url).href },
  { name: 'Belleza Queijo 40g', category: 'Salgadinhos de Trigo', image: new URL('../../assets/products/Salgadinhos de Trigo/Belleza/belleza_queijo_40g.jpeg', import.meta.url).href },
  // Salgadinhos de Trigo — Good Fried / Pimentas
  { name: 'Good Fried Pimenta 12g', category: 'Salgadinhos de Trigo', image: new URL('../../assets/products/Salgadinhos de Trigo/Pimentas/good_fried_pimenta_12g.jpeg', import.meta.url).href },
  { name: 'Good Fried Queijo 12g', category: 'Salgadinhos de Trigo', image: new URL('../../assets/products/Salgadinhos de Trigo/Good Fried/good_fried_queijo_12g.jpeg', import.meta.url).href },
  // Torresminho
  { name: "Piggy's Bacon 30g", category: 'Torresminho', image: new URL('../../assets/products/Torresminho/piggys_bacon_30g.jpeg', import.meta.url).href },
  { name: "Piggy's Picanha 30g", category: 'Torresminho', image: new URL('../../assets/products/Torresminho/piggys_picanha_30g.jpeg', import.meta.url).href },
];

function parseWeight(name: string): number | null {
  const m = name.match(/(\d+)g/);
  return m ? parseInt(m[1]) : null;
}

const weightRanges = [
  { label: 'Até 15g', min: 0, max: 15 },
  { label: '16g – 40g', min: 16, max: 40 },
  { label: '41g – 60g', min: 41, max: 60 },
  { label: 'Acima de 60g', min: 61, max: Infinity },
];

const typeCategories = [
  'Pipoca Gravatá',
  'Amendoim',
  'Batata Chips',
  'Bolinhos de Goma',
  'Paçoca',
  'Salgadinhos',
  'Salgadinhos de Trigo',
  'Torresminho',
];

const ITEMS_PER_PAGE = 9;

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Pipoca Gravatá');
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const filterRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fixed counts per category (independent of current filters)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    typeCategories.forEach((cat) => {
      counts[cat] = products.filter((p) => p.category === cat).length;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    setCurrentPage(1);
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedWeight) {
        const w = parseWeight(p.name);
        const range = weightRanges.find((r) => r.label === selectedWeight);
        if (w !== null && range && (w < range.min || w > range.max)) return false;
      }
      return true;
    });
  }, [search, selectedCategory, selectedWeight]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const clearAll = () => {
    setSelectedCategory(null);
    setSelectedWeight(null);
    setSearch('');
  };

  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-white">

        {/* ── Hero banner ── */}
        <div className="relative h-[75vh] overflow-hidden">
          <img
            src={heroUrl}
            alt="FAL produtos"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* ── Top bar: search + filtros button + category chips ── */}
        <div className="flex items-center gap-3 px-8 lg:px-16 py-4 border-b border-border bg-white">

          {/* Search input */}
          <div className="relative shrink-0 w-52">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos"
              className="w-full pl-4 pr-9 py-2.5 rounded-full border border-border bg-white text-foreground placeholder-muted-foreground text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {search ? (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            )}
          </div>

          {/* Filtros button + dropdown (Por Peso) */}
          <div className="relative shrink-0" ref={filterRef}>
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-150 ${
                filtersOpen || selectedWeight
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-primary text-white shadow-sm hover:shadow-md'
              }`}
            >
              Filtros
              <SlidersHorizontal className="w-4 h-4" />
              {selectedWeight && (
                <span className="ml-0.5 w-5 h-5 rounded-full bg-white/25 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
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
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Por Peso
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {weightRanges.map((r) => (
                      <button
                        key={r.label}
                        onClick={() => setSelectedWeight(selectedWeight === r.label ? null : r.label)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                          selectedWeight === r.label
                            ? 'bg-primary text-white'
                            : 'bg-muted text-foreground hover:bg-muted/70'
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

          {/* Vertical divider */}
          <div className="w-px h-7 bg-border shrink-0" />

          {/* Category chips — horizontally scrollable */}
          <div className="flex items-center gap-2 overflow-x-auto flex-1" style={{ scrollbarWidth: 'none' }}>
            {/* Todos */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide whitespace-nowrap shrink-0 transition-all duration-150 ${
                selectedCategory === null
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-border text-foreground hover:border-primary/40'
              }`}
            >
              Todos
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.4rem] text-center ${
                selectedCategory === null ? 'bg-white/25 text-white' : 'bg-foreground/10 text-foreground/70'
              }`}>
                {products.length}
              </span>
            </button>

            {typeCategories.map((cat) => {
              const isPipoca = cat === 'Pipoca Gravatá';
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isActive ? null : cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide whitespace-nowrap shrink-0 transition-all duration-150 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : isPipoca
                      ? 'bg-yellow-50 border border-yellow-300 text-foreground hover:bg-yellow-100'
                      : 'bg-white border border-border text-foreground hover:border-primary/40'
                  }`}
                >
                  {isPipoca && (
                    <Star
                      className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'fill-white text-white' : 'fill-yellow-400 text-yellow-400'}`}
                    />
                  )}
                  {cat}
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.4rem] text-center ${
                    isActive ? 'bg-white/25 text-white' : 'bg-foreground/10 text-foreground/70'
                  }`}>
                    {categoryCounts[cat]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Products grid ── */}
        <div ref={gridRef} className="py-8">
          <div className="max-w-4xl mx-auto px-8">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-muted-foreground"
            >
              <p className="text-xl mb-4">Nenhum produto encontrado.</p>
              <button onClick={clearAll} className="text-primary hover:text-primary/80 transition-colors font-medium">
                Limpar filtros
              </button>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={search + String(selectedCategory) + String(selectedWeight) + currentPage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-3 gap-6"
                >
                  {paginated.map((product, i) => (
                    <motion.div
                      key={product.name + i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                      className="bg-white rounded-2xl transition-shadow duration-300 flex flex-col p-3 gap-3"
                    >
                      {/* Image row */}
                      <div className="h-80 bg-gradient-to-br from-accent/20 to-primary/10 rounded-2xl p-6 flex items-center justify-center overflow-hidden group cursor-pointer">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      {/* Info row */}
                      <div className="px-2 pb-2 flex flex-col flex-1 gap-3">
                        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 text-center">
                          {product.name}
                        </h3>
                        <button className="mt-auto w-full py-2.5 px-3 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all duration-200">
                          Confira a tabela nutricional
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
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
                        currentPage === page
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-white border border-border text-foreground hover:border-primary/40'
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
        </div>

        <Footer />
      </div>
    </>
  );
}
