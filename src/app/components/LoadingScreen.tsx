import { useEffect } from 'react';
import { motion } from 'motion/react';
import { preloadImages } from '../../lib/imageCache';

const falLogo = new URL('../../assets/FAL_LOGO.png', import.meta.url).href;

// Static assets preloaded in background as soon as the screen mounts
const STATIC_ASSETS = [
  falLogo,
  new URL('../../assets/hero/copa_1200x600px.jpg', import.meta.url).href,
  new URL('../../assets/hero/sao-joao_1200x600px.jpg.jpg', import.meta.url).href,
  new URL('../../assets/logo_nordeste_gravata.png', import.meta.url).href,
];

export default function LoadingScreen({ progress }: { progress: number }) {
  useEffect(() => {
    preloadImages(STATIC_ASSETS);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <motion.img
        src={falLogo}
        alt="FAL"
        className="w-28 object-contain mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      />
      <div className="w-44 h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${Math.max(4, progress)}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
