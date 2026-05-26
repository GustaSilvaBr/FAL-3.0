import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

const SLOT = 260;
const CARD_W = 210;
const CARD_H = 270;
const IMG_W = 135;
const IMG_H = 185;

const categories = [
  {
    label: 'Amanteigadas',
    subtitle: 'A linha clássica',
    images: [
      new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_yellow.jpeg', import.meta.url).href,
      new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_40g_0trans_white.jpeg', import.meta.url).href,
      new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_90g_0trans_white.jpeg', import.meta.url).href,
    ],
  },
  {
    label: 'Doces',
    subtitle: 'Pura delícia',
    images: [
      new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_10g_0trans_doce.jpeg', import.meta.url).href,
      new URL('../../assets/products/Pipoca Gravatá/Doces/pipocao_gravatá_30g_0trans_doce.jpeg', import.meta.url).href,
      new URL('../../assets/products/Pipoca Gravatá/Doces/pipocao_gravatá_30g_0trans_amendoim_doce.jpeg', import.meta.url).href,
    ],
  },
  {
    label: 'Premium',
    subtitle: 'Sal do Himalaia',
    images: [
      new URL('../../assets/products/Pipoca Gravatá/Premium/pipoca_gravatá_15g_0trans_himalaia_premium.jpeg', import.meta.url).href,
      new URL('../../assets/products/Pipoca Gravatá/Premium/pipoca_gravatá_40g_0trans_himalaia_premium.jpeg', import.meta.url).href,
    ],
  },
  {
    label: 'Gourmet',
    subtitle: 'Sabor chocolate',
    images: [
      new URL('../../assets/products/Pipoca Gravatá/Gourmet/pipoca_gravatá_15g_0trans_sabor_chocolate_gourmet.jpeg', import.meta.url).href,
      new URL('../../assets/products/Pipoca Gravatá/Gourmet/pipocao_gravatá_45g_0trans_chocolate_gourmet.jpeg', import.meta.url).href,
    ],
  },
];

// Fan offsets per total count: index 0 = front image
// Large tx so back bags are clearly visible (Cheetos style), minimal rotation
const FAN: Record<number, { rotate: number; tx: number; ty: number; scale: number }[]> = {
  1: [{ rotate: 0, tx: 0, ty: 0, scale: 1 }],
  2: [
    { rotate:  0, tx: -18, ty: 0, scale: 1    }, // front
    { rotate:  4, tx:  68, ty: 0, scale: 0.94 }, // back, peeking right
  ],
  3: [
    { rotate:  0, tx:   0, ty: 0, scale: 1    }, // front
    { rotate:  4, tx:  72, ty: 0, scale: 0.92 }, // middle, peeking right
    { rotate: -4, tx: -68, ty: 0, scale: 0.87 }, // back, peeking left
  ],
};

function ProductStack({ images }: { images: string[] }) {
  const shown = images.slice(0, 3);
  const offsets = FAN[shown.length];

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
              top: `calc(50% - ${IMG_H / 2}px + ${off.ty}px)`,
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
  const abs = Math.abs(offset);
  return {
    x: offset * SLOT - CARD_W / 2,
    y: -CARD_H / 2,
    scale: Math.max(0.48, 0.82 - abs * 0.20),
    opacity: abs > 2 ? 0 : Math.max(0.2, 1 - abs * 0.38),
    zIndex: 10 - abs * 2,
  };
}

export default function PipocaGravata() {
  const [current, setCurrent] = useState(Math.floor((categories.length - 1) / 2));

  const hasPrev = current > 0;
  const hasNext = current < categories.length - 1;

  const prev = () => { if (hasPrev) setCurrent(i => i - 1); };
  const next = () => { if (hasNext) setCurrent(i => i + 1); };

  return (
    <section className="py-12 bg-gray-50" id="brands">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
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
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Quatro linhas, um só sabor autêntico. Encontre a sua preferida.
          </p>
        </motion.div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden px-6 py-8">

        {/* Carousel */}
        <div className="relative h-[320px] overflow-hidden">
          {categories.map((cat, i) => {
            const p = getSlideProps(i, current);
            return (
              <motion.div
                key={cat.label}
                className="absolute left-1/2 cursor-pointer"
                style={{ top: '50%', zIndex: p.zIndex, width: CARD_W }}
                animate={{ x: p.x, y: p.y, scale: p.scale, opacity: p.opacity }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                onClick={() => setCurrent(i)}
              >
                <ProductStack images={cat.images} />
                <div className="text-center mt-2">
                  <p className="font-bold text-foreground text-xl">{cat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.subtitle}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Left arrow */}
          {hasPrev && (
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 border border-primary/10 transition-all hover:scale-110"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}

          {/* Right arrow */}
          {hasNext && (
            <button
              onClick={next}
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

        </div>{/* end card */}
      </div>
    </section>
  );
}
