'use client';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimationFrame } from 'motion/react';
import type { Variants } from 'motion/react';
import { useState, useEffect } from 'react';
import nordesteLogoImg from '../../assets/logo_nordeste_gravata.png';
import type { Product } from '../../lib/types';
import { useProductNavigation } from '../../lib/productNavigation';

const nordesteLogo = (nordesteLogoImg as unknown as { src: string }).src ?? nordesteLogoImg as unknown as string;

const RADIUS    = 200;
const CONTAINER = 500;
const DURATION  = 40;

const MAX_VISIBLE = 7;
const ROTATION_MS = 5000;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function useRotatingProducts(pool: Product[]): Product[] {
  const key = pool.map((p) => p.id).join(',');
  const [visible, setVisible] = useState<Product[]>(() => pool.slice(0, MAX_VISIBLE));

  useEffect(() => {
    setVisible(pool.slice(0, MAX_VISIBLE));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (pool.length <= MAX_VISIBLE) return;
    const timer = setInterval(() => {
      setVisible((prev) => {
        const prevIds = new Set(prev.map((p) => p.id));
        const hidden = pool.filter((p) => !prevIds.has(p.id));
        if (!hidden.length) return prev;
        const swapN = Math.min(3 + (Math.random() < 0.5 ? 0 : 1), hidden.length, prev.length);
        const outPositions = shuffle(prev.map((_, i) => i)).slice(0, swapN);
        const incoming = shuffle(hidden).slice(0, swapN);
        const next = [...prev];
        outPositions.forEach((pos, i) => { next[pos] = incoming[i]; });
        return next;
      });
    }, ROTATION_MS);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return visible;
}

const productVariants: Variants = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: { duration: 1.0, ease: [0.34, 1.56, 0.64, 1] },
  },
  exit: {
    scale: 0,
    transition: { duration: 0.6, ease: 'easeIn' },
  },
};

export function ProductWheel({ products, onProductClick }: { products: Product[]; onProductClick?: (p: Product) => void }) {
  const orbitAngle   = useMotionValue(0);
  const counterAngle = useTransform(orbitAngle, (v) => -v);

  useAnimationFrame((t) => {
    orbitAngle.set(((t / 1000) / DURATION * 360) % 360);
  });

  if (products.length === 0) return null;

  return (
    <div className="relative flex items-center justify-center" style={{ width: CONTAINER, height: CONTAINER }}>
      <div
        className="absolute rounded-full border-2 border-dashed border-primary/20"
        style={{ width: RADIUS * 2, height: RADIUS * 2 }}
      />

      <div className="absolute z-10 flex items-center justify-center rounded-full bg-white shadow-xl" style={{ width: 168, height: 168 }}>
        <img src={nordesteLogo} alt="Nordeste Gravatá" className="w-36 h-36 object-contain p-1" />
      </div>

      <motion.div className="absolute inset-0 overflow-visible" style={{ rotate: orbitAngle }}>
        {products.map((product, i) => {
          const angle = (i * 360) / products.length - 90;
          const rad   = (angle * Math.PI) / 180;
          const x     = Math.cos(rad) * RADIUS;
          const y     = Math.sin(rad) * RADIUS;

          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <motion.div style={{ rotate: counterAngle }}>
                <motion.div
                  style={{ width: 103, height: 103 }}
                  whileHover={{ scale: 1.5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="cursor-pointer"
                  title={product.name}
                  onClick={() => onProductClick?.(product)}
                >
                  <div className="w-full h-full rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {product.imageUrl ? (
                        <motion.img
                          key={product.id}
                          src={product.imageUrl}
                          alt={product.name}
                          variants={productVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="w-[86px] h-[86px] object-contain"
                        />
                      ) : (
                        <motion.span
                          key={product.id}
                          variants={productVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="text-2xl"
                        >
                          📦
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function Brands({ allProducts }: { allProducts: Product[] }) {
  const { navigateToProduct } = useProductNavigation();
  const products = useRotatingProducts(allProducts);

  return (
    <section id="brands" className="min-h-screen flex flex-col justify-center py-20 bg-gradient-to-br from-accent/20 to-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="flex flex-col justify-center order-1">
            <h3 className="text-5xl md:text-6xl lg:text-7xl mb-6 text-primary">
              Nordeste Gravatá
            </h3>
            <p className="text-2xl md:text-3xl mb-8" style={{ color: '#666' }}>
              O Sabor Autêntico do Nordeste Brasileiro
            </p>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Nossa marca principal leva receitas tradicionais e qualidade premium para cada cozinha. Da nossa famosa pipoca a salgadinhos e doces irresistíveis, Nordeste Gravatá é sinônimo de sabor e tradição brasileiros autênticos.
            </p>
            <div>
              <a
                href="#produtos"
                className="inline-block px-8 py-4 bg-primary text-white text-lg rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Conheça Nossos Produtos
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center order-2 py-8 lg:py-0">
            <ProductWheel products={products} onProductClick={navigateToProduct} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
