import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const categories = [
  'Todos',
  'Amendoim',
  'Batata Chips',
  'Bolinhos de Goma',
  'Paçoca',
  'Pipoca Gravatá',
  'Salgadinhos',
  'Salgadinhos de Trigo',
  'Torresminho',
];

const products = [
  // Amendoim
  { name: 'Amendoim', category: 'Amendoim', description: 'Torrado e salgado sem pele', image: new URL('../../assets/products/Amendoim/amendoim.jpeg', import.meta.url).href },
  // Batata Chips
  { name: 'Batata Chips Original', category: 'Batata Chips', description: 'Sabor original crocante', image: new URL('../../assets/products/Batata Chips/batatachips_original.jpeg', import.meta.url).href },
  { name: 'Batata Chips Cebola & Salsa', category: 'Batata Chips', description: 'Sabor cebola e salsa', image: new URL('../../assets/products/Batata Chips/batatachips_cebola_salsa.jpeg', import.meta.url).href },
  { name: 'Batata Chips Churrasco', category: 'Batata Chips', description: 'Sabor churrasco', image: new URL('../../assets/products/Batata Chips/batatachips_churrasco.jpeg', import.meta.url).href },
  // Bolinhos de Goma
  { name: 'Bolinhos de Goma 50g', category: 'Bolinhos de Goma', description: 'Tradicional', image: new URL('../../assets/products/Bolinhos de Goma/bolinhos_De_goma_50g.png', import.meta.url).href },
  { name: 'Bolinhos de Goma 90g', category: 'Bolinhos de Goma', description: 'Tradicional', image: new URL('../../assets/products/Bolinhos de Goma/bolinhos_de_goma_90g.png', import.meta.url).href },
  // Paçoca
  { name: 'Paçoca', category: 'Paçoca', description: 'Doce de amendoim tradicional', image: new URL('../../assets/products/Paçoca/paçoca.jpeg', import.meta.url).href },
  // Pipoca Gravatá - Amanteigadas
  { name: 'Pipoca Gravatá 10g', category: 'Pipoca Gravatá', description: 'Amanteigada 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_yellow.jpeg', import.meta.url).href },
  { name: 'Pipoca Gravatá 10g', category: 'Pipoca Gravatá', description: 'Amanteigada 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_white.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá 14g', category: 'Pipoca Gravatá', description: 'Amanteigada 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_14g_0trans_white.jpeg', import.meta.url).href },
  { name: 'Pipoca Gravatá Sem Sal 10g', category: 'Pipoca Gravatá', description: 'Amanteigada sem sal 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_sem_sal.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá 30g', category: 'Pipoca Gravatá', description: 'Amanteigada 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_30g_0trans_white.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá 40g', category: 'Pipoca Gravatá', description: 'Amanteigada 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_40g_0trans_white.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá 72g', category: 'Pipoca Gravatá', description: 'Amanteigada 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_72g_0trans_white.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá 90g', category: 'Pipoca Gravatá', description: 'Amanteigada 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_90g_0trans_white.jpeg', import.meta.url).href },
  // Pipoca Gravatá - Doces
  { name: 'Pipoca Gravatá Doce 10g', category: 'Pipoca Gravatá', description: 'Doce 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_10g_0trans_doce.jpeg', import.meta.url).href },
  { name: 'Pipoca Gravatá Doce 14g', category: 'Pipoca Gravatá', description: 'Doce 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_14g_0trans_doce.jpeg', import.meta.url).href },
  { name: 'Pipoca Gravatá Amendoim Doce 12g', category: 'Pipoca Gravatá', description: 'Amendoim doce 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_12g_0trans_amendoim_doce.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá Doce 30g', category: 'Pipoca Gravatá', description: 'Doce 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipocao_gravatá_30g_0trans_doce.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá Amendoim Doce 30g', category: 'Pipoca Gravatá', description: 'Amendoim doce 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipocao_gravatá_30g_0trans_amendoim_doce.jpeg', import.meta.url).href },
  // Pipoca Gravatá - Gourmet
  { name: 'Pipoca Gravatá Chocolate Gourmet 15g', category: 'Pipoca Gravatá', description: 'Sabor chocolate gourmet 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Gourmet/pipoca_gravatá_15g_0trans_sabor_chocolate_gourmet.jpeg', import.meta.url).href },
  { name: 'Pipocão Gravatá Chocolate Gourmet 45g', category: 'Pipoca Gravatá', description: 'Sabor chocolate gourmet 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Gourmet/pipocao_gravatá_45g_0trans_chocolate_gourmet.jpeg', import.meta.url).href },
  // Pipoca Gravatá - Premium
  { name: 'Pipoca Gravatá Himalaia Premium 15g', category: 'Pipoca Gravatá', description: 'Sal do Himalaia premium 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Premium/pipoca_gravatá_15g_0trans_himalaia_premium.jpeg', import.meta.url).href },
  { name: 'Pipoca Gravatá Himalaia Premium 40g', category: 'Pipoca Gravatá', description: 'Sal do Himalaia premium 0% Trans', image: new URL('../../assets/products/Pipoca Gravatá/Premium/pipoca_gravatá_40g_0trans_himalaia_premium.jpeg', import.meta.url).href },
  // Salgadinhos - Pipofloc's
  { name: "Pipofloc's Churrasco 13g", category: 'Salgadinhos', description: 'Sabor churrasco', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_churrasco_13g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Milho 13g", category: 'Salgadinhos', description: 'Sabor milho', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_milho_13g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Queijo 13g", category: 'Salgadinhos', description: 'Sabor queijo', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_queijo_13g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Requeijão 13g", category: 'Salgadinhos', description: 'Sabor requeijão', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_requeijão_13g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Cebola 13g", category: 'Salgadinhos', description: 'Sabor cebola', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_cebola_13g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Cebola & Salsa 20g", category: 'Salgadinhos', description: 'Sabor cebola e salsa', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_cebola_salsa_20g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Churrasco 20g", category: 'Salgadinhos', description: 'Sabor churrasco', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_churrasco_20g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Queijo 20g", category: 'Salgadinhos', description: 'Sabor queijo', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_queijo_20g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Requeijão 20g", category: 'Salgadinhos', description: 'Sabor requeijão', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_requeijão_20g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Cebola & Salsa 40g", category: 'Salgadinhos', description: 'Sabor cebola e salsa', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_cebola_salsa_40g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Churrasco 40g", category: 'Salgadinhos', description: 'Sabor churrasco', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_churrasco_40g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Queijo 40g", category: 'Salgadinhos', description: 'Sabor queijo', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_queijo_40g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Requeijão 40g", category: 'Salgadinhos', description: 'Sabor requeijão', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_requeijão_40g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Cebola 42g", category: 'Salgadinhos', description: 'Sabor cebola', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_cebola_42g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Milho 42g", category: 'Salgadinhos', description: 'Sabor milho', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_milho_42g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Presunto 42g", category: 'Salgadinhos', description: 'Sabor presunto', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_presunto_42g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Queijo 42g", category: 'Salgadinhos', description: 'Sabor queijo', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_queijo_42g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Requeijão 42g", category: 'Salgadinhos', description: 'Sabor requeijão', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_requeijão_42g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Cebola 55g", category: 'Salgadinhos', description: 'Sabor cebola', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_cebola_55g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Churrasco 55g", category: 'Salgadinhos', description: 'Sabor churrasco', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_churrasco_55g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Milho 55g", category: 'Salgadinhos', description: 'Sabor milho', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_milho_55g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Queijo 55g", category: 'Salgadinhos', description: 'Sabor queijo', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_queijo_55g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Presunto 55g", category: 'Salgadinhos', description: 'Sabor presunto', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_presunto_55g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Requeijão 55g", category: 'Salgadinhos', description: 'Sabor requeijão', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_requeijão_55g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Cebola & Salsa 50g", category: 'Salgadinhos', description: 'Sabor cebola e salsa', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_cebola_salsa_50g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Churrasco Brasa 50g", category: 'Salgadinhos', description: 'Sabor churrasco brasa', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_churrasco_brasa_50g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Churrasco 50g", category: 'Salgadinhos', description: 'Sabor churrasco', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_churrasco_50g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Queijo 50g", category: 'Salgadinhos', description: 'Sabor queijo', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_queijo_50g.jpeg", import.meta.url).href },
  { name: "Pipofloc's Requeijão 50g", category: 'Salgadinhos', description: 'Sabor requeijão', image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_requeijão_50g.jpeg", import.meta.url).href },
  // Salgadinhos - Salgadinhos iaê
  { name: 'Iaê Acebolado 30g', category: 'Salgadinhos', description: 'Sabor acebolado', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_acebolado_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Churrasco 30g', category: 'Salgadinhos', description: 'Sabor churrasco', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_churrasco_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Galinha 30g', category: 'Salgadinhos', description: 'Sabor galinha', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_galinha_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Milho 30g', category: 'Salgadinhos', description: 'Sabor milho', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_milho_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Presunto 30g', category: 'Salgadinhos', description: 'Sabor presunto', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_presunto_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Queijo Suíço 30g', category: 'Salgadinhos', description: 'Sabor queijo suíço', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_queijo_suiço_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Requeijão 30g', category: 'Salgadinhos', description: 'Sabor requeijão', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_requeijão_30g.jpeg', import.meta.url).href },
  { name: 'Iaê Acebolado 60g', category: 'Salgadinhos', description: 'Sabor acebolado', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_acebolado_60g.jpeg', import.meta.url).href },
  { name: 'Iaê Costelinha com Limão 60g', category: 'Salgadinhos', description: 'Sabor costelinha com limão', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_costelinha_limao_60g.jpeg', import.meta.url).href },
  { name: 'Iaê Milho 60g', category: 'Salgadinhos', description: 'Sabor milho', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_milho_60g.jpeg', import.meta.url).href },
  { name: 'Iaê Queijo Suíço 60g', category: 'Salgadinhos', description: 'Sabor queijo suíço', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_queijo_suiço_60g.jpeg', import.meta.url).href },
  { name: 'Iaê Requeijão 60g', category: 'Salgadinhos', description: 'Sabor requeijão', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_requeijão_60g.jpeg', import.meta.url).href },
  // Salgadinhos - Qi-Flocs
  { name: 'Qi-Flocs Milho 40g', category: 'Salgadinhos', description: 'Sabor milho', image: new URL('../../assets/products/Salgadinhos/Qi-Flocs/qi_flocs_milho_40g.jpeg', import.meta.url).href },
  { name: 'Qi-Flocs Cebola & Salsa 40g', category: 'Salgadinhos', description: 'Sabor cebola e salsa', image: new URL('../../assets/products/Salgadinhos/Qi-Flocs/qi_flocs_cebola_salsa_40g.jpeg', import.meta.url).href },
  { name: 'Qi-Flocs Queijo 40g', category: 'Salgadinhos', description: 'Sabor queijo', image: new URL('../../assets/products/Salgadinhos/Qi-Flocs/qi_flocs_queijo_40g.jpeg', import.meta.url).href },
  // Salgadinhos de Trigo - Belleza
  { name: 'Belleza Cebola & Salsa 40g', category: 'Salgadinhos de Trigo', description: 'Sabor cebola e salsa', image: new URL('../../assets/products/Salgadinhos de Trigo/Belleza/belleza_cebola_salsa_40g.jpeg', import.meta.url).href },
  { name: 'Belleza Churrasco 40g', category: 'Salgadinhos de Trigo', description: 'Sabor churrasco', image: new URL('../../assets/products/Salgadinhos de Trigo/Belleza/belleza_churrasco_40g.jpeg', import.meta.url).href },
  { name: 'Belleza Frango 40g', category: 'Salgadinhos de Trigo', description: 'Sabor frango', image: new URL('../../assets/products/Salgadinhos de Trigo/Belleza/belleza_frango_40g.jpeg', import.meta.url).href },
  { name: 'Belleza Pimenta 40g', category: 'Salgadinhos de Trigo', description: 'Sabor pimenta', image: new URL('../../assets/products/Salgadinhos de Trigo/Belleza/belleza_pimenta_40g.jpeg', import.meta.url).href },
  { name: 'Belleza Queijo 40g', category: 'Salgadinhos de Trigo', description: 'Sabor queijo', image: new URL('../../assets/products/Salgadinhos de Trigo/Belleza/belleza_queijo_40g.jpeg', import.meta.url).href },
  // Salgadinhos de Trigo - Good Fried
  { name: 'Good Fried Pimenta 12g', category: 'Salgadinhos de Trigo', description: 'Sabor pimenta', image: new URL('../../assets/products/Salgadinhos de Trigo/Pimentas/good_fried_pimenta_12g.jpeg', import.meta.url).href },
  { name: 'Good Fried Queijo 12g', category: 'Salgadinhos de Trigo', description: 'Sabor queijo', image: new URL('../../assets/products/Salgadinhos de Trigo/Good Fried/good_fried_queijo_12g.jpeg', import.meta.url).href },
  // Torresminho
  { name: "Piggy's Bacon 30g", category: 'Torresminho', description: 'Sabor bacon', image: new URL('../../assets/products/Torresminho/piggys_bacon_30g.jpeg', import.meta.url).href },
  { name: "Piggy's Picanha 30g", category: 'Torresminho', description: 'Sabor picanha', image: new URL('../../assets/products/Torresminho/piggys_picanha_30g.jpeg', import.meta.url).href },
];

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = activeCategory === 'Todos'
    ? products
    : products.filter(p => p.category === activeCategory);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-accent/20 to-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Nossos Produtos
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra nossa diversificada linha de petiscos e doces brasileiros autênticos, feitos com tradição e cuidado.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-3 rounded-full transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-foreground hover:bg-white/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + currentPage}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {paginatedProducts.map((product, index) => (
              <motion.div
                key={product.name + index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-muted to-white p-8">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl mb-2 text-foreground">{product.name}</h3>
                  <p className="text-muted-foreground mb-4 text-base">{product.description}</p>
                  <button className="text-primary hover:text-primary/80 transition-colors font-medium">
                    Saiba Mais →
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-white shadow-sm disabled:opacity-30 hover:bg-white/80 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full text-sm transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-foreground hover:bg-white/80 shadow-sm'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-white shadow-sm disabled:opacity-30 hover:bg-white/80 transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
