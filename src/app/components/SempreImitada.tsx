import { motion } from 'motion/react';

const mascotImg = new URL('../../assets/mascot.png', import.meta.url).href;
const heroImg = new URL('../../assets/hero.png', import.meta.url).href;

export default function SempreImitada() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent/20 to-primary/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="overflow-hidden rounded-3xl shadow-xl"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '260px' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Left column: phrase + mascot */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: 'linear-gradient(to bottom right, rgba(255,182,39,0.7), rgba(1,159,67,0.5))',
              borderTopRightRadius: '8% 50%',
              borderBottomRightRadius: '8% 50%',
            }}
          >
            {/* Phrase */}
            <div className="flex items-center justify-center px-8 py-8">
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
            <div className="flex items-end justify-center overflow-hidden">
              <motion.img
                src={mascotImg}
                alt="Mascote Pipoca Gravatá"
                className="object-contain drop-shadow-2xl"
                style={{ height: '115%', maxHeight: '280px' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
              />
            </div>
          </div>

          {/* Right column: hero image */}
          <div className="overflow-hidden">
            <img
              src={heroImg}
              alt="Pipoca Gravatá"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
