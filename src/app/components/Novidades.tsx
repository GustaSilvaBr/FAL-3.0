import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';

const nordesteLogo = new URL('../../assets/logo_nordeste_gravata.png', import.meta.url).href;

type Product = {
  image: string;
  tag?: string;
  title: string;
  description: string;
  link: string;
};

const initialProducts: Product[] = [
  {
    image: new URL('../../assets/products/Pipoca Gravatá/Premium/pipoca_gravatá_15g_0trans_himalaia_premium.jpeg', import.meta.url).href,
    tag: 'LANÇAMENTO',
    title: 'PIPOCA HIMALAIA PREMIUM 15G',
    description: 'Sabor único com sal do Himalaia. Crocante, leve e com 0% gordura trans.',
    link: '#products',
  },
  {
    image: new URL('../../assets/products/Pipoca Gravatá/Gourmet/pipoca_gravatá_15g_0trans_sabor_chocolate_gourmet.jpeg', import.meta.url).href,
    title: 'PIPOCA CHOCOLATE GOURMET 15G',
    description: 'A irresistível combinação de pipoca crocante com chocolate.',
    link: '#products',
  },
];

export default function Novidades() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const rotate = () =>
    setProducts(prev => {
      const [featured, ...rest] = prev;
      return [...rest, featured];
    });

  useEffect(() => {
    const timer = setInterval(rotate, 5000);
    return () => clearInterval(timer);
  }, []);

  const featured = products[0];
  const sidebar = products.slice(1);

  return (
    <section className="py-24 bg-[#FFFDE7] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <img src={nordesteLogo} alt="Nordeste Gravatá" className="h-14 object-contain" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#1B3A8F]">Nordeste Gravatá</p>
              <h2 className="text-3xl font-black uppercase tracking-wide text-[#1B3A8F]">Novidades</h2>
            </div>
          </div>
          <Link
            to="/produtos"
            className="hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1B3A8F] hover:text-[#CC1122] transition-colors"
          >
            Ver todos os produtos <ArrowRight size={15} />
          </Link>
        </div>

        <div className="flex">

          {/* ── Featured ─────────────────────────────────── */}
          <div className="flex w-[62%]">

            {/* Product image */}
            <div className="w-[44%] shrink-0 relative overflow-hidden flex items-center justify-center h-[380px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={featured.image}
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-contain p-8 drop-shadow-2xl"
                  initial={{ opacity: 0, scale: 0.92, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -16 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                />
              </AnimatePresence>

              {/* Tag badge */}
              {featured.tag && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featured.tag}
                    className="absolute top-5 left-5 flex items-center gap-1.5 bg-accent px-3 py-1.5 rounded-full shadow-lg"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Star size={11} className="fill-foreground text-foreground" />
                    <span className="text-xs font-black uppercase tracking-widest text-foreground">
                      {featured.tag}
                    </span>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Text content */}
            <div className="flex flex-col justify-center gap-6 p-10 lg:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={featured.title}
                  className="flex flex-col gap-5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#1B3A8F] mb-3">
                      Nordeste Gravatá
                    </p>
                    <h3 className="font-black uppercase leading-tight text-[#1B3A8F] mb-3" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}>
                      {featured.title}
                    </h3>
                    <p className="text-base text-[#1B3A8F]/65 leading-relaxed">
                      {featured.description}
                    </p>
                  </div>

                  <Link
                    to="/produtos"
                    className="inline-flex items-center gap-2 self-start px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-wider bg-[#FFE800] text-[#1B3A8F] shadow-lg hover:bg-[#FFD000] transition-all hover:scale-105"
                  >
                    Ver Produto <ArrowRight size={15} />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────── */}
          <div className="flex flex-col justify-between w-[38%] p-8 border-l border-[#1B3A8F]/15">

            <p className="text-xs font-bold uppercase tracking-widest text-[#1B3A8F] mb-4">
              Também em destaque
            </p>

            <div className="flex flex-col flex-1 divide-y divide-[#1B3A8F]/10">
              {sidebar.map((item, i) => (
                <Link
                  key={item.title}
                  to="/produtos"
                  className="flex items-center gap-4 py-4 first:pt-0 group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-1.5"
                    />
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold uppercase text-xs leading-snug text-[#1B3A8F] group-hover:text-[#CC1122] transition-colors line-clamp-2">
                      {item.title}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs mt-1.5 font-semibold text-[#CC1122] opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver produto <ArrowRight size={11} />
                    </span>
                  </div>

                  {/* Position number */}
                  <span className="text-xs font-black text-[#1B3A8F]/30 tabular-nums shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </Link>
              ))}
            </div>

            <Link
              to="/produtos"
              className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-[#1B3A8F] hover:text-[#CC1122] transition-colors mt-6 underline underline-offset-4"
            >
              Ver todos os produtos <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
