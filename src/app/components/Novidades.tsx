import { useState, useEffect } from 'react';
import { preloadImages } from '../../lib/imageCache';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Product, SectionNovidades, NovidadesItem } from '../../lib/types';

type DisplayItem = {
  image: string;
  tag?: string;
  title: string;
  description: string;
};

function toDisplayItem(item: NovidadesItem, product: Product | undefined): DisplayItem {
  return {
    image: product?.imageUrl ?? '',
    tag: item.tag || undefined,
    title: product?.name ?? '',
    description: item.description,
  };
}

export default function Novidades({ onLoad }: { onLoad?: () => void }) {
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const sectionSnap = await getDoc(doc(db, 'sections', 'novidades'));
      if (!sectionSnap.exists()) { onLoad?.(); return; }

      const section = sectionSnap.data() as SectionNovidades;
      if (!section.items?.length) { onLoad?.(); return; }

      const productIds = [...new Set(section.items.map((i) => i.productId))];
      const productMap: Record<string, Product> = {};

      await Promise.all(
        productIds.map(async (pid) => {
          const snap = await getDoc(doc(db, 'products', pid));
          if (snap.exists()) productMap[pid] = { id: snap.id, ...snap.data() } as Product;
        }),
      );

      const displayItems = section.items.map((item) => toDisplayItem(item, productMap[item.productId]));
      await preloadImages(displayItems.map((i) => i.image));
      setItems(displayItems);
      onLoad?.();
    }

    load();
  }, [onLoad]);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(timer);
  }, [items]);

  if (items.length === 0) return null;

  const featured = items[index];
  const sidebar  = items.filter((_, i) => i !== index);

  return (
    <section id="novidades" className="min-h-screen flex flex-col justify-center py-20 bg-gradient-to-br from-accent/20 to-primary/10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <motion.h2
          className="text-5xl md:text-6xl lg:text-7xl font-black text-center mb-8 text-primary"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Novidades
        </motion.h2>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex">

            {/* Featured */}
            <div className="flex w-[62%] p-[25px]">
              <div className="flex w-full">

                {/* Product image */}
                <div className="w-[44%] shrink-0 relative overflow-hidden flex items-center justify-center h-[380px] bg-gradient-to-br from-accent/20 to-primary/10 rounded-2xl m-4">
                  <AnimatePresence mode="wait">
                    {featured.image && (
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
                    )}
                  </AnimatePresence>

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

                {/* Text */}
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
                        <h3
                          className="font-black uppercase leading-tight text-foreground mb-3"
                          style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}
                        >
                          {featured.title}
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          {featured.description}
                        </p>
                      </div>
                      <Link
                        to="/produtos"
                        className="inline-flex items-center gap-2 self-start px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-wider bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
                      >
                        Ver Produto <ArrowRight size={15} />
                      </Link>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col justify-between w-[38%] p-8 border-l border-primary/20">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                Também em destaque
              </p>
              <div className="flex flex-col flex-1 divide-y divide-primary/10">
                {sidebar.map((item, i) => (
                  <Link
                    key={item.title + i}
                    to="/produtos"
                    className="flex items-center gap-4 py-4 first:pt-0 group cursor-pointer"
                  >
                    <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-accent/25 to-primary/15 flex items-center justify-center">
                      {item.image && (
                        <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold uppercase text-xs leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs mt-1.5 font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver produto <ArrowRight size={11} />
                      </span>
                    </div>
                    <span className="text-xs font-black text-primary/30 tabular-nums shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                to="/produtos"
                className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-primary hover:text-primary/70 transition-colors mt-6 underline underline-offset-4"
              >
                Ver todos os produtos <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
