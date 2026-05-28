import { useState, useEffect } from 'react';
import { preloadImages } from '../../lib/imageCache';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Product, SectionPipoca, PipocaCategory } from '../../lib/types';

const SLOT  = 260;
const CARD_W = 210;
const CARD_H = 270;
const IMG_W  = 135;
const IMG_H  = 185;

const FAN: Record<number, { rotate: number; tx: number; ty: number; scale: number }[]> = {
  1: [{ rotate: 0, tx: 0, ty: 0, scale: 1 }],
  2: [
    { rotate:  0, tx: -18, ty: 0, scale: 1    },
    { rotate:  4, tx:  68, ty: 0, scale: 0.94 },
  ],
  3: [
    { rotate:  0, tx:   0, ty: 0, scale: 1    },
    { rotate:  4, tx:  72, ty: 0, scale: 0.92 },
    { rotate: -4, tx: -68, ty: 0, scale: 0.87 },
  ],
};

function ProductStack({ images }: { images: string[] }) {
  const shown   = images.slice(0, 3);
  const offsets = FAN[shown.length] ?? FAN[1];

  return (
    <div className="relative mx-auto" style={{ width: CARD_W, height: IMG_H + 20 }}>
      {[...shown].reverse().map((src, ri) => {
        const frontIdx = shown.length - 1 - ri;
        const off = offsets[frontIdx];
        return (
          <img
            key={ri}
            src={src}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              width: IMG_W,
              height: IMG_H,
              top:  `calc(50% - ${IMG_H / 2}px + ${off.ty}px)`,
              left: `calc(50% - ${IMG_W / 2}px + ${off.tx}px)`,
              transform: `rotate(${off.rotate}deg) scale(${off.scale})`,
              transformOrigin: 'center center',
              objectFit: 'contain',
              filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.16))',
            }}
          />
        );
      })}
    </div>
  );
}

function getSlideProps(index: number, current: number) {
  const offset = index - current;
  const abs    = Math.abs(offset);
  return {
    x:       offset * SLOT - CARD_W / 2,
    y:       -CARD_H / 2,
    scale:   Math.max(0.48, 0.82 - abs * 0.20),
    opacity: abs > 2 ? 0 : Math.max(0.2, 1 - abs * 0.38),
    zIndex:  10 - abs * 2,
  };
}

export default function PipocaGravata({ onLoad }: { onLoad?: () => void }) {
  const [categories, setCategories] = useState<PipocaCategory[]>([]);
  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  const [current, setCurrent]       = useState(0);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'sections', 'pipoca-gravata'));
      if (!snap.exists()) { onLoad?.(); return; }

      const data = snap.data() as SectionPipoca;
      const cats = data.categories ?? [];
      setCategories(cats);
      setCurrent(Math.floor((cats.length - 1) / 2));

      const allIds = [...new Set(cats.flatMap((c) => c.productIds))];
      const map: Record<string, Product> = {};
      await Promise.all(
        allIds.map(async (pid) => {
          const pSnap = await getDoc(doc(db, 'products', pid));
          if (pSnap.exists()) map[pid] = { id: pSnap.id, ...pSnap.data() } as Product;
        }),
      );
      await preloadImages(Object.values(map).map((p) => p.imageUrl));
      setProductMap(map);
      onLoad?.();
    }

    load();
  }, [onLoad]);

  if (categories.length === 0) return null;

  const hasPrev = current > 0;
  const hasNext = current < categories.length - 1;

  return (
    <section className="py-12 bg-gray-50" id="pipoca-gravata">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3">
            Pipocas Gravatá
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: '#666' }}>
            Quatro linhas, um só sabor autêntico. Encontre a sua preferida.
          </p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden px-6 py-8">

          {/* Carousel */}
          <div className="relative h-[320px] overflow-hidden">
            {categories.map((cat, i) => {
              const p = getSlideProps(i, current);
              const images = cat.productIds
                .map((id) => productMap[id]?.imageUrl)
                .filter(Boolean) as string[];
              return (
                <motion.div
                  key={cat.id}
                  className="absolute left-1/2 cursor-pointer"
                  style={{ top: '50%', zIndex: p.zIndex, width: CARD_W }}
                  animate={{ x: p.x, y: p.y, scale: p.scale, opacity: p.opacity }}
                  transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                  onClick={() => setCurrent(i)}
                >
                  <ProductStack images={images} />
                  <div className="text-center mt-2">
                    <p className="font-bold text-foreground text-xl">{cat.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.subtitle}</p>
                  </div>
                </motion.div>
              );
            })}

            {hasPrev && (
              <button
                onClick={() => setCurrent((i) => i - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 border border-primary/10 transition-all hover:scale-110"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={() => setCurrent((i) => i + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 border border-primary/10 transition-all hover:scale-110"
                aria-label="Próximo"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            )}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-2">
            {categories.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Categoria ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-primary' : 'w-1.5 bg-primary/30 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-5">
            <Link
              to="/produtos"
              className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              Ver todos os produtos →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
