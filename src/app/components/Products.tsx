import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const featuredProduct = {
  name: 'Pipoca Nordeste Gravatá',
  description: 'Nossa pipoca especial — crocante, amanteigada e irresistivelmente deliciosa. Feita com grãos selecionados e 0% de gordura trans. O favorito das famílias brasileiras!',
  variants: ['Crocantes e Amanteigadas', 'Natural'],
};

const featuredImages = [
  new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_yellow.png', import.meta.url).href,
  new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_white.png', import.meta.url).href,
  new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_40g_0trans_white.png', import.meta.url).href,
  new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_72g_0trans_white.png', import.meta.url).href,
  new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_90g_0trans_white.png', import.meta.url).href,
];

export default function Products() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  const prevIdx = (currentIdx - 1 + featuredImages.length) % featuredImages.length;
  const nextIdx = (currentIdx + 1) % featuredImages.length;

  const navigateTo = (newIdx: number, dir: number) => {
    setDirection(dir);
    setCurrentIdx(newIdx);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIdx(prev => (prev + 1) % featuredImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-accent/20 to-primary/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="absolute top-6 left-6 z-10">
            <div className="flex items-center gap-2 bg-accent px-4 py-2 rounded-full shadow-lg">
              <Star className="w-5 h-5 text-foreground fill-foreground" />
              <span className="text-foreground uppercase tracking-wider">Mais Vendido</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-12 lg:p-16">
            <div className="flex flex-col justify-center">
              <h3 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
                {featuredProduct.name}
              </h3>
              <p className="text-xl md:text-2xl text-primary mb-8 leading-relaxed">
                {featuredProduct.description}
              </p>
              <div className="mb-6">
                <h4 className="text-lg mb-3 text-muted-foreground">Disponível em:</h4>
                <div className="flex flex-wrap gap-3">
                  {featuredProduct.variants.map((variant) => (
                    <span key={variant} className="px-4 py-2 bg-white rounded-lg text-foreground shadow-sm">
                      {variant}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <a
                  href="#products"
                  className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Ver Detalhes
                </a>
              </div>
            </div>
            <div className="relative flex items-center justify-center overflow-hidden min-h-[24rem] py-8">

              {/* Three-image stage */}
              <div className="flex items-center justify-center w-full px-4">

                {/* Previous image */}
                <motion.div
                  initial={{ x: -60, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  style={{ position: 'relative', zIndex: 1, marginRight: '-80px', flexShrink: 0 }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.button
                      key={prevIdx}
                      onClick={() => navigateTo(prevIdx, -1)}
                      initial={{ opacity: 0 }}
                      animate={{ scale: 0.82, rotate: -12, opacity: 0.88 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 0.9, opacity: 1 }}
                      transition={{ duration: 0.35 }}
                    >
                      <img
                        src={featuredImages[prevIdx]}
                        alt="Anterior"
                        className="w-36 h-36 lg:w-52 lg:h-52 object-contain drop-shadow-xl"
                      />
                    </motion.button>
                  </AnimatePresence>
                </motion.div>

                {/* Center/main image */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{ position: 'relative', zIndex: 3, flexShrink: 0 }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
                    transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
                  >
                    <div style={{ position: 'relative', width: 208, height: 208 }} className="lg:w-72 lg:h-72 overflow-hidden">
                      <AnimatePresence initial={false} custom={direction}>
                        <motion.img
                          key={currentIdx}
                          src={featuredImages[currentIdx]}
                          alt={featuredProduct.name}
                          className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
                          custom={direction}
                          initial={(dir: number) => ({ x: dir > 0 ? 160 : -160, opacity: 0 })}
                          animate={{ x: 0, opacity: 1 }}
                          exit={(dir: number) => ({ x: dir > 0 ? -160 : 160, opacity: 0 })}
                          transition={{ x: { type: 'spring', stiffness: 350, damping: 35 }, opacity: { duration: 0.25 } }}
                        />
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Next image */}
                <motion.div
                  initial={{ x: 60, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  style={{ position: 'relative', zIndex: 1, marginLeft: '-80px', flexShrink: 0 }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.button
                      key={nextIdx}
                      onClick={() => navigateTo(nextIdx, 1)}
                      initial={{ opacity: 0 }}
                      animate={{ scale: 0.82, rotate: 12, opacity: 0.88 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 0.9, opacity: 1 }}
                      transition={{ duration: 0.35 }}
                    >
                      <img
                        src={featuredImages[nextIdx]}
                        alt="Próximo"
                        className="w-36 h-36 lg:w-52 lg:h-52 object-contain drop-shadow-xl"
                      />
                    </motion.button>
                  </AnimatePresence>
                </motion.div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
