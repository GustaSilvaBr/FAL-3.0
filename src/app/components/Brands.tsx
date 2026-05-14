import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const nordesteLogo = new URL('../../assets/logo_nordeste_gravata.png', import.meta.url).href;

type WheelProduct = { name: string; image: string; category: string };

const allByCategory: Record<string, WheelProduct[]> = {
  'Amendoim': [
    { name: 'Amendoim', category: 'Amendoim', image: new URL('../../assets/products/Amendoim/amendoim.jpeg', import.meta.url).href },
  ],
  'Batata Chips': [
    { name: 'Batata Chips Original', category: 'Batata Chips', image: new URL('../../assets/products/Batata Chips/batatachips_original.jpeg', import.meta.url).href },
    { name: 'Batata Chips Cebola & Salsa', category: 'Batata Chips', image: new URL('../../assets/products/Batata Chips/batatachips_cebola_salsa.jpeg', import.meta.url).href },
    { name: 'Batata Chips Churrasco', category: 'Batata Chips', image: new URL('../../assets/products/Batata Chips/batatachips_churrasco.jpeg', import.meta.url).href },
  ],
  'Bolinho de Goma': [
    { name: 'Bolinho de Goma 50g', category: 'Bolinho de Goma', image: new URL('../../assets/products/Bolinhos de Goma/bolinhos_De_goma_50g.png', import.meta.url).href },
    { name: 'Bolinho de Goma 90g', category: 'Bolinho de Goma', image: new URL('../../assets/products/Bolinhos de Goma/bolinhos_de_goma_90g.png', import.meta.url).href },
  ],
  'Paçoca': [
    { name: 'Paçoca', category: 'Paçoca', image: new URL('../../assets/products/Paçoca/paçoca.jpeg', import.meta.url).href },
  ],
  'Pipoca Gravatá': [
    { name: 'Pipoca Gravatá 10g Amarela', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_yellow.jpeg', import.meta.url).href },
    { name: 'Pipoca Gravatá 10g Branca', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_white.jpeg', import.meta.url).href },
    { name: 'Pipocão Gravatá 40g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_40g_0trans_white.jpeg', import.meta.url).href },
    { name: 'Pipocão Gravatá 72g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_72g_0trans_white.jpeg', import.meta.url).href },
    { name: 'Pipoca Himalaia Premium 15g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Premium/pipoca_gravatá_15g_0trans_himalaia_premium.jpeg', import.meta.url).href },
    { name: 'Pipoca Chocolate Gourmet 15g', category: 'Pipoca Gravatá', image: new URL('../../assets/products/Pipoca Gravatá/Gourmet/pipoca_gravatá_15g_0trans_sabor_chocolate_gourmet.jpeg', import.meta.url).href },
  ],
  'Pipoca Gravatá Doce': [
    { name: 'Pipoca Gravatá Doce 10g', category: 'Pipoca Gravatá Doce', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_10g_0trans_doce.jpeg', import.meta.url).href },
    { name: 'Pipoca Gravatá Doce 14g', category: 'Pipoca Gravatá Doce', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_14g_0trans_doce.jpeg', import.meta.url).href },
    { name: 'Pipoca Amendoim Doce 12g', category: 'Pipoca Gravatá Doce', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_12g_0trans_amendoim_doce.jpeg', import.meta.url).href },
    { name: 'Pipocão Gravatá Doce 30g', category: 'Pipoca Gravatá Doce', image: new URL('../../assets/products/Pipoca Gravatá/Doces/pipocao_gravatá_30g_0trans_doce.jpeg', import.meta.url).href },
  ],
  'Salgadinho Iaê': [
    { name: 'Iaê Acebolado 30g', category: 'Salgadinho Iaê', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_acebolado_30g.jpeg', import.meta.url).href },
    { name: 'Iaê Churrasco 30g', category: 'Salgadinho Iaê', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_churrasco_30g.jpeg', import.meta.url).href },
    { name: 'Iaê Galinha 30g', category: 'Salgadinho Iaê', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_galinha_30g.jpeg', import.meta.url).href },
    { name: 'Iaê Milho 30g', category: 'Salgadinho Iaê', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_milho_30g.jpeg', import.meta.url).href },
    { name: 'Iaê Queijo Suíço 60g', category: 'Salgadinho Iaê', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_queijo_suiço_60g.jpeg', import.meta.url).href },
    { name: 'Iaê Requeijão 60g', category: 'Salgadinho Iaê', image: new URL('../../assets/products/Salgadinhos/Salgadinhos iaê/iae_requeijão_60g.jpeg', import.meta.url).href },
  ],
};

const initialWheelItems: WheelProduct[] = [
  allByCategory['Amendoim'][0],
  allByCategory['Batata Chips'][0],
  allByCategory['Bolinho de Goma'][0],
  allByCategory['Paçoca'][0],
  allByCategory['Pipoca Gravatá'][0],
  allByCategory['Pipoca Gravatá Doce'][0],
  allByCategory['Salgadinho Iaê'][0],
];

const RADIUS = 168;
const CONTAINER = 420;
const DURATION = 40;

function ProductWheel() {
  const [wheelItems, setWheelItems] = useState<WheelProduct[]>(initialWheelItems);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setWheelItems(prev => {
        const next = [...prev];
        const shuffled = Array.from({ length: next.length }, (_, i) => i).sort(() => Math.random() - 0.5);
        for (const idx of shuffled.slice(0, 2)) {
          const current = next[idx];
          const options = allByCategory[current.category].filter(p => p.name !== current.name);
          if (options.length > 0) {
            next[idx] = options[Math.floor(Math.random() * options.length)];
          }
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: CONTAINER, height: CONTAINER }}>
      {/* Dashed orbit ring */}
      <div
        className="absolute rounded-full border-2 border-dashed border-primary/20"
        style={{ width: RADIUS * 2, height: RADIUS * 2 }}
      />

      {/* Center logo */}
      <div className="absolute z-10 flex items-center justify-center rounded-full bg-white shadow-xl" style={{ width: 140, height: 140 }}>
        <img src={nordesteLogo} alt="Nordeste Gravatá" className="w-32 h-32 object-contain p-1" />
      </div>

      {/* Rotating orbit container */}
      <motion.div
        className="absolute inset-0 overflow-visible"
        animate={{ rotate: 360 }}
        transition={{ duration: DURATION, repeat: Infinity, ease: 'linear' }}
      >
        {wheelItems.map((product, i) => {
          const angle = (i * 360) / wheelItems.length - 90;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * RADIUS;
          const y = Math.sin(rad) * RADIUS;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                zIndex: hoveredIdx === i ? 30 : 1,
              }}
            >
              <motion.div
                className="flex items-center justify-center bg-white rounded-full shadow-lg overflow-hidden cursor-pointer"
                style={{ width: 86, height: 86 }}
                animate={{ rotate: -360 }}
                transition={{ duration: DURATION, repeat: Infinity, ease: 'linear' }}
                whileHover={{ scale: 2.4 }}
                onHoverStart={() => setHoveredIdx(i)}
                onHoverEnd={() => setHoveredIdx(null)}
                title={product.name}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={product.name}
                    src={product.image}
                    alt={product.name}
                    className="w-[72px] h-[72px] object-contain"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.35 }}
                  />
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function Brands() {
  return (
    <section id="brands" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Nossas Marcas
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma família de marcas unidas pela qualidade, tradição e o sabor autêntico do Brasil.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-primary/10 to-accent/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-16">
            <div className="flex flex-col justify-center order-1">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-8 h-8 text-accent" />
                <span className="text-accent text-lg uppercase tracking-wider">Nosso Orgulho</span>
              </div>
              <h3 className="text-5xl md:text-6xl lg:text-7xl mb-6 text-foreground">
                Nordeste Gravatá
              </h3>
              <p className="text-2xl md:text-3xl text-primary mb-8">
                O Sabor Autêntico do Nordeste Brasileiro
              </p>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Nossa marca principal leva receitas tradicionais e qualidade premium para cada cozinha. Da nossa famosa pipoca a salgadinhos e doces irresistíveis, Nordeste Gravatá é sinônimo de sabor e tradição brasileiros autênticos.
              </p>
              <div>
                <a
                  href="#products"
                  className="inline-block px-8 py-4 bg-primary text-white text-lg rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Conheça Nossos Produtos
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center order-2 py-8 lg:py-0">
              <ProductWheel />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
