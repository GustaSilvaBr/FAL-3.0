import { Link } from 'react-router';
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

const RADIUS = 200;
const CONTAINER = 500;
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
        className="absolute rounded-full border-2 border-dashed border-[#1B3A8F]/25"
        style={{ width: RADIUS * 2, height: RADIUS * 2 }}
      />

      {/* Center logo */}
      <div className="absolute z-10 flex items-center justify-center rounded-full bg-white shadow-xl" style={{ width: 168, height: 168 }}>
        <img src={nordesteLogo} alt="Nordeste Gravatá" className="w-36 h-36 object-contain p-1" />
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
              {/* Counter-rotation wrapper */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: DURATION, repeat: Infinity, ease: 'linear' }}
              >
                {/* Hover-scale wrapper — separate from rotation so overflow-hidden doesn't clip */}
                <motion.div
                  style={{ width: 103, height: 103 }}
                  whileHover={{ scale: 2.4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onHoverStart={() => setHoveredIdx(i)}
                  onHoverEnd={() => setHoveredIdx(null)}
                  className="cursor-pointer"
                  title={product.name}
                >
                  <div className="w-full h-full rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={product.name}
                        src={product.image}
                        alt={product.name}
                        className="w-[86px] h-[86px] object-contain"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.35 }}
                      />
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

export default function Brands() {
  return (
    <section id="brands" className="py-24 bg-[#FFFDE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="flex flex-col justify-center order-1">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-[#1B3A8F]" />
              <span className="text-[#1B3A8F] text-lg uppercase tracking-wider">Nosso Orgulho</span>
            </div>
            <h3 className="text-6xl md:text-7xl lg:text-8xl mb-6 text-[#1B3A8F] font-black">
              Nordeste Gravatá
            </h3>
            <p className="text-2xl md:text-3xl text-[#1B3A8F] mb-8">
              O Sabor Autêntico do Nordeste Brasileiro
            </p>
            <p className="text-xl text-[#1B3A8F]/75 mb-8 leading-relaxed">
              Nossa marca principal leva receitas tradicionais e qualidade premium para cada cozinha. Da nossa famosa pipoca a salgadinhos e doces irresistíveis, Nordeste Gravatá é sinônimo de sabor e tradição brasileiros autênticos.
            </p>
            <div>
              <Link
                to="/produtos"
                className="inline-block px-8 py-4 bg-[#1B3A8F] text-white font-black text-lg rounded-full hover:bg-[#152e72] hover:scale-105 transition-all duration-300 shadow-xl"
              >
                Conheça Nossos Produtos
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center order-2 py-8 lg:py-0">
            <ProductWheel />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
