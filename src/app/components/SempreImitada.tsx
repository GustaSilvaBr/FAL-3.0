import { motion } from 'motion/react';

const mascotImg = new URL('../../assets/mascot.png', import.meta.url).href;
const heroImg = new URL('../../assets/hero.png', import.meta.url).href;

export default function SempreImitada() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="relative overflow-hidden rounded-3xl shadow-xl"
          style={{ minHeight: '220px' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Hero image — constrained to the right portion so object-center is accurate */}
          <div className="absolute top-0 bottom-0 right-0" style={{ left: '54%' }}>
            <img
              src={heroImg}
              alt="Pipoca Gravatá"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Orange section — SVG defines the curved right boundary */}
          <div
            className="relative flex items-stretch"
            style={{ width: '62%', minHeight: '220px', zIndex: 10 }}
          >
            {/* SVG-defined orange background with convex curve on the right */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M 0 0 L 90 0 Q 95 50 90 100 L 0 100 Z" fill="#E8640A" />
            </svg>

            {/* Text */}
            <div className="relative flex items-center justify-center px-8 py-8 z-10" style={{ width: '46%' }}>
              <p
                className="uppercase font-black leading-none text-left"
                style={{
                  color: '#5C2A00',
                  fontSize: 'clamp(1.3rem, 2.8vw, 2.4rem)',
                  fontFamily: "'Impact', 'Arial Black', sans-serif",
                  letterSpacing: '-0.01em',
                }}
              >
                Sempre imitada,<br />nunca igualada
              </p>
            </div>

            {/* Mascot */}
            <div className="relative flex items-end justify-center flex-1 z-10">
              <motion.img
                src={mascotImg}
                alt="Mascote Pipoca Gravatá"
                className="object-contain drop-shadow-2xl"
                style={{ height: '115%', maxHeight: '270px', marginBottom: '-4px' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
