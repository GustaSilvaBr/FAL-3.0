import { useState, useEffect } from 'react';
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
    title: 'PIPOCA HIMALAIA PREMIUM',
    description: 'Sabor único com sal do Himalaia. Crocante, leve e com 0% gordura trans.',
    link: '#products',
  },
  {
    image: new URL('../../assets/products/Pipoca Gravatá/Gourmet/pipoca_gravatá_15g_0trans_sabor_chocolate_gourmet.jpeg', import.meta.url).href,
    title: 'PIPOCA CHOCOLATE GOURMET',
    description: 'A irresistível combinação de pipoca crocante com chocolate.',
    link: '#products',
  },
  {
    image: new URL('../../assets/products/Batata Chips/batatachips_churrasco.jpeg', import.meta.url).href,
    title: 'BATATA CHIPS CHURRASCO',
    description: 'O autêntico sabor de churrasco em cada fatia crocante.',
    link: '#products',
  },
  {
    image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_requeijão_60g.jpeg', import.meta.url).href,
    title: 'IAÊ REQUEIJÃO 60G',
    description: 'Salgadinho cremoso com sabor de requeijão irresistível.',
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
    <section className="py-20 bg-muted px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <img src={nordesteLogo} alt="Nordeste Gravatá" className="h-14 object-contain" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Nordeste Gravatá</p>
              <h2 className="text-3xl font-black uppercase tracking-wide text-foreground">Novidades</h2>
            </div>
          </div>
          <a
            href="#products"
            className="hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary hover:text-primary/70 transition-colors"
          >
            Ver todos os produtos <ArrowRight size={15} />
          </a>
        </div>

        {/* Card */}
        <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-accent/20 to-primary/10 flex">

          {/* ── Featured ─────────────────────────────────── */}
          <div className="flex w-[62%]">

            {/* Product image */}
            <div className="w-[44%] shrink-0 relative overflow-hidden bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={featured.image}
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-contain p-8 drop-shadow-2xl"
                  style={{ minHeight: '380px' }}
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
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                      Nordeste Gravatá
                    </p>
                    <h3 className="font-black uppercase leading-tight text-foreground mb-3" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}>
                      {featured.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {featured.description}
                    </p>
                  </div>

                  <a
                    href={featured.link}
                    className="inline-flex items-center gap-2 self-start px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-wider bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
                  >
                    Ver Produto <ArrowRight size={15} />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────── */}
          <div className="flex flex-col justify-between w-[38%] p-8 border-l border-primary/10">

            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
              Também em destaque
            </p>

            <div className="flex flex-col flex-1 divide-y divide-primary/10">
              {sidebar.map((item, i) => (
                <motion.a
                  key={item.title}
                  href={item.link}
                  layout
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="flex items-center gap-4 py-4 first:pt-0 group cursor-pointer"
                  onClick={e => { e.preventDefault(); rotate(); }}
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-accent/25 to-primary/15 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-1.5"
                    />
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold uppercase text-xs leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs mt-1.5 font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver produto <ArrowRight size={11} />
                    </span>
                  </div>

                  {/* Position number */}
                  <span className="text-xs font-black text-primary/30 tabular-nums shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </motion.a>
              ))}
            </div>

            <a
              href="#products"
              className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-primary hover:text-primary/70 transition-colors mt-6 underline underline-offset-4"
            >
              Ver todos os produtos <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
