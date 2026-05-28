import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Product, SectionBrands } from '../../lib/types';

const nordesteLogo = new URL('../../assets/logo_nordeste_gravata.png', import.meta.url).href;

const RADIUS    = 200;
const CONTAINER = 500;
const DURATION  = 40;

function ProductWheel({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="relative flex items-center justify-center" style={{ width: CONTAINER, height: CONTAINER }}>
      {/* Dashed orbit ring */}
      <div
        className="absolute rounded-full border-2 border-dashed border-primary/20"
        style={{ width: RADIUS * 2, height: RADIUS * 2 }}
      />

      {/* Center logo */}
      <div className="absolute z-10 flex items-center justify-center rounded-full bg-white shadow-xl" style={{ width: 168, height: 168 }}>
        <img src={nordesteLogo} alt="Nordeste Gravatá" className="w-36 h-36 object-contain p-1" />
      </div>

      {/* Rotating orbit */}
      <motion.div
        className="absolute inset-0 overflow-visible"
        animate={{ rotate: 360 }}
        transition={{ duration: DURATION, repeat: Infinity, ease: 'linear' }}
      >
        {products.map((product, i) => {
          const angle = (i * 360) / products.length - 90;
          const rad   = (angle * Math.PI) / 180;
          const x     = Math.cos(rad) * RADIUS;
          const y     = Math.sin(rad) * RADIUS;

          return (
            <div
              key={product.id}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: DURATION, repeat: Infinity, ease: 'linear' }}
              >
                <motion.div
                  style={{ width: 103, height: 103 }}
                  whileHover={{ scale: 1.5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="cursor-pointer"
                  title={product.name}
                >
                  <div className="w-full h-full rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-[86px] h-[86px] object-contain"
                      />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
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

export default function Brands() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'sections', 'brands'));
      if (!snap.exists()) return;

      const data = snap.data() as SectionBrands;
      const ids  = data.productIds ?? [];

      const loaded = await Promise.all(
        ids.map(async (id) => {
          const pSnap = await getDoc(doc(db, 'products', id));
          return pSnap.exists() ? ({ id: pSnap.id, ...pSnap.data() } as Product) : null;
        }),
      );

      setProducts(loaded.filter(Boolean) as Product[]);
    }

    load();
  }, []);

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
              <Link
                to="/produtos"
                className="inline-block px-8 py-4 bg-primary text-white text-lg rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Conheça Nossos Produtos
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center order-2 py-8 lg:py-0">
            <ProductWheel products={products} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
