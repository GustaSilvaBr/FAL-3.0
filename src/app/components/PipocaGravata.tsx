import { motion } from 'motion/react';
import { Sparkles, Star, Crown } from 'lucide-react';

const products = {
  amanteigadas: [
    new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_yellow.jpeg', import.meta.url).href,
    new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_white.jpeg', import.meta.url).href,
    new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_40g_0trans_white.jpeg', import.meta.url).href,
    new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipocao_gravatá_72g_0trans_white.jpeg', import.meta.url).href,
  ],
  doces: [
    new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_10g_0trans_doce.jpeg', import.meta.url).href,
    new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_14g_0trans_doce.jpeg', import.meta.url).href,
    new URL('../../assets/products/Pipoca Gravatá/Doces/pipoca_gravatá_12g_0trans_amendoim_doce.jpeg', import.meta.url).href,
    new URL('../../assets/products/Pipoca Gravatá/Doces/pipocao_gravatá_30g_0trans_doce.jpeg', import.meta.url).href,
  ],
  premium: [
    new URL('../../assets/products/Pipoca Gravatá/Premium/pipoca_gravatá_15g_0trans_himalaia_premium.jpeg', import.meta.url).href,
    new URL('../../assets/products/Pipoca Gravatá/Premium/pipoca_gravatá_40g_0trans_himalaia_premium.jpeg', import.meta.url).href,
  ],
  gourmet: [
    new URL('../../assets/products/Pipoca Gravatá/Gourmet/pipoca_gravatá_15g_0trans_sabor_chocolate_gourmet.jpeg', import.meta.url).href,
    new URL('../../assets/products/Pipoca Gravatá/Gourmet/pipocao_gravatá_45g_0trans_chocolate_gourmet.jpeg', import.meta.url).href,
  ],
};

const themeUrl = new URL('../../assets/theme_1.png', import.meta.url).href;

const cards = [
  {
    title: 'Doces',
    subtitle: 'Pura delícia',
    images: products.doces,
    icon: Star,
    iconColor: 'text-accent',
    badge: 'bg-accent/20 text-accent-foreground',
    center: false,
  },
  {
    title: 'Amanteigadas',
    subtitle: 'A linha clássica',
    images: products.amanteigadas,
    icon: Sparkles,
    iconColor: 'text-primary',
    badge: 'bg-primary/15 text-primary',
    center: true,
  },
  {
    title: 'Gourmet & Premium',
    subtitle: 'Experiência única',
    images: [...products.premium, ...products.gourmet],
    icon: Crown,
    iconColor: 'text-secondary',
    badge: 'bg-secondary/15 text-secondary',
    center: false,
  },
];

export default function PipocaGravata() {
  return (
    <section
      className="py-10 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-semibold uppercase tracking-widest text-xs mb-2">
            Nordeste Gravatá
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Pipocas Gravatá
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Quatro linhas, um só sabor autêntico. Encontre a sua preferida.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          {cards.map((card, i) => {
            const Icon = card.icon;
            const isCenter = card.center;

            const cardMotionProps = isCenter
              ? {
                  animate: { scale: [1, 1.025, 1] },
                  transition: {
                    scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                    opacity: { duration: 0.5, delay: i * 0.12 },
                    y: { duration: 0.5, delay: i * 0.12 },
                  },
                }
              : {
                  whileHover: { y: -3 },
                  transition: { duration: 0.5, delay: i * 0.12 },
                };

            return (
              <motion.div
                key={card.title}
                className={`relative rounded-2xl bg-gradient-to-br from-accent/20 to-primary/10 overflow-hidden flex flex-col ${isCenter ? 'shadow-xl' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                {...cardMotionProps}
              >
                {/* Product images grid */}
                <div className={`grid grid-cols-2 pb-0 ${isCenter ? 'gap-1.5 p-3' : 'gap-1 p-2'}`}>
                  {card.images.slice(0, 4).map((src, j) => (
                    <div
                      key={j}
                      className={`aspect-square overflow-hidden bg-white shadow-sm ${isCenter ? 'rounded-xl' : 'rounded-lg'}`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                {/* Text content */}
                <div className={`flex flex-col ${isCenter ? 'px-4 py-3 gap-2' : 'px-3 py-2 gap-1.5'}`}>
                  <div className={`self-start flex items-center gap-1 font-semibold uppercase tracking-wider rounded-full ${card.badge} ${isCenter ? 'text-xs px-2.5 py-0.5' : 'text-[10px] px-2 py-0.5'}`}>
                    <Icon className={`${card.iconColor} ${isCenter ? 'w-3 h-3' : 'w-2.5 h-2.5'}`} strokeWidth={2.5} />
                    {card.subtitle}
                  </div>
                  <h3 className={`font-bold text-foreground ${isCenter ? 'text-lg' : 'text-base'}`}>{card.title}</h3>
                  <a
                    href="#products"
                    className={`self-start font-semibold text-primary hover:text-primary/70 transition-colors underline underline-offset-2 ${isCenter ? 'text-xs' : 'text-[10px]'}`}
                  >
                    Ver produtos →
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
