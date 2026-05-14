import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import heroImage from '../../assets/hero.png';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-gradient-to-br from-primary/90 via-accent/80 to-secondary/90"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full text-center px-4 max-w-5xl mx-auto w-full py-24">
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Petiscos & Tradição
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Da nossa famosa pipoca à tradicional paçoca e salgadinhos, levamos o sabor autêntico de Gravatá para as famílias de todo o Brasil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#brands"
              className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Conheça Nossas Marcas
            </a>
            <a
              href="#about"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              Nossa História
            </a>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown size={40} />
      </motion.a>
    </section>
  );
}
