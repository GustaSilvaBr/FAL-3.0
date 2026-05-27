import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const mascotImg = new URL('../../assets/mascot.png', import.meta.url).href;

type Variation = {
  id: string;
  name: string;
  tagline: string;
  cardBg: string;
  tagBg: string;
  images: string[];
};

const variations: Variation[] = [
  {
    id: 'amanteigadas',
    name: 'Amanteigadas',
    tagline: 'Crocante e irresistível',
    cardBg: 'from-amber-50 to-yellow-50',
    tagBg: 'bg-amber-400',
    images: [
      new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_yellow.png', import.meta.url).href,
      new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_white.png', import.meta.url).href,
      new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_40g_0trans_white.png', import.meta.url).href,
    ],
  },
  {
    id: 'doces',
    name: 'Doces',
    tagline: 'Sabor adocicado',
    cardBg: 'from-pink-50 to-rose-50',
    tagBg: 'bg-rose-400',
    images: [
      new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_10g_0trans_doce.png', import.meta.url).href,
      new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_12g_0trans_amendoim_doce.png', import.meta.url).href,
      new URL('../../assets/products/Pipoca Gravatá/Doces/pipocao_gravatá_30g_0trans_doce.png', import.meta.url).href,
    ],
  },
  {
    id: 'gourmet',
    name: 'Gourmet',
    tagline: 'Chocolate premium',
    cardBg: 'from-amber-900/10 to-stone-100',
    tagBg: 'bg-amber-800',
    images: [
      new URL('../../assets/products/Pipoca Gravatá/Gourmet/pipoca_gravatá_15g_0trans_sabor_chocolate_gourmet.png', import.meta.url).href,
      new URL('../../assets/products/Pipoca Gravatá/Gourmet/pipocao_gravatá_45g_0trans_chocolate_gourmet.png', import.meta.url).href,
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Sal do Himalaia',
    cardBg: 'from-sky-50 to-indigo-50',
    tagBg: 'bg-indigo-500',
    images: [
      new URL('../../assets/products/Pipoca Gravatá/Premium/pipoca_gravatá_15g_0trans_himalaia_premium.png', import.meta.url).href,
      new URL('../../assets/products/Pipoca Gravatá/Premium/pipoca_gravatá_40g_0trans_himalaia_premium.png', import.meta.url).href,
    ],
  },
];

// Stack positions per slot: [front, middle, back]
const STACK_CONFIGS = [
  { rotate: 7, x: 24, y: 0, scale: 1.0, zIndex: 30, opacity: 1 },
  { rotate: -1, x: -2, y: 5, scale: 0.92, zIndex: 20, opacity: 0.9 },
  { rotate: -9, x: -26, y: 10, scale: 0.84, zIndex: 10, opacity: 0.8 },
];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 160 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -160 }),
};

function VariationCard({ variation }: { variation: Variation }) {
  const imgs = variation.images.slice(0, 3);
  const styleKeys = imgs.length === 2 ? [0, 2] : [0, 1, 2];

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${variation.cardBg} p-5 flex flex-col items-center gap-5 shadow-md border border-white/60 h-full`}>
      {/* Stacked product images */}
      <div className="relative w-full h-36 flex items-center justify-center">
        {imgs.map((img, i) => {
          const cfg = STACK_CONFIGS[styleKeys[i]];
          return (
            <motion.img
              key={img}
              src={img}
              alt={variation.name}
              className="absolute w-20 h-32 object-contain drop-shadow-xl"
              style={{ zIndex: cfg.zIndex }}
              initial={{ opacity: 0, y: cfg.y + 24 }}
              animate={{
                opacity: cfg.opacity,
                x: cfg.x,
                y: cfg.y,
                rotate: cfg.rotate,
                scale: cfg.scale,
              }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
            />
          );
        })}
      </div>

      {/* Name + tagline */}
      <div className="text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${variation.tagBg} text-white mb-2 shadow-sm`}>
          {variation.name}
        </span>
        <p className="text-xs text-muted-foreground leading-snug">{variation.tagline}</p>
      </div>
    </div>
  );
}

const VISIBLE_COUNT = 3;
const PAGE_COUNT = Math.ceil(variations.length / VISIBLE_COUNT);

export default function QueridinhaPipoca() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => {
    setDirection(1);
    setPage(prev => (prev + 1) % PAGE_COUNT);
  };

  const prev = () => {
    setDirection(-1);
    setPage(prev => (prev - 1 + PAGE_COUNT) % PAGE_COUNT);
  };

  const visible = variations.slice(page * VISIBLE_COUNT, (page + 1) * VISIBLE_COUNT);

  return (
    <section className="py-8 bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Main layout: mascot (left) + products (right) */}
        <div className="flex items-end gap-6 lg:gap-10">

          {/* Mascot */}
          <motion.div
            className="hidden lg:block w-36 xl:w-44 shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.img
              src={mascotImg}
              alt="Mascote Pipoca Gravatá"
              className="w-full object-contain drop-shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
            />
          </motion.div>

          {/* Right column: title + cards + navigation */}
          <div className="flex-1 flex flex-col gap-4">

          {/* Header aligned to cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">A Queridinha</p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">Pipoca Gravatá</h2>
          </motion.div>

          {/* Variation cards + navigation */}
          <div className="flex items-center gap-4">

            {/* Animated card group */}
            <div className="flex-1 overflow-hidden relative" style={{ minHeight: '15rem' }}>
              <AnimatePresence mode="sync" custom={direction}>
                <motion.div
                  key={page}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="grid grid-cols-3 gap-4 absolute inset-0"
                >
                  {visible.map(variation => (
                    <VariationCard key={variation.id} variation={variation} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation arrows */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <button
                onClick={prev}
                aria-label="Variação anterior"
                className="p-3 rounded-full border-2 border-primary/20 hover:border-primary/60 text-primary/40 hover:text-primary transition-all hover:scale-110 active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                aria-label="Próxima variação"
                className="p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>

          </div>

          </div>{/* end right column */}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: PAGE_COUNT }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > page ? 1 : -1);
                setPage(i);
              }}
              aria-label={`Página ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === page
                  ? 'w-6 h-2 bg-primary'
                  : 'w-2 h-2 bg-primary/25 hover:bg-primary/50'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
