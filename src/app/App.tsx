import { useState, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Novidades from './components/Novidades';
import About from './components/About';
import PipocaGravata from './components/PipocaGravata';
import Brands from './components/Brands';
import ExploreProducts from './components/ExploreProducts';
import Contact from './components/Contact';
import InstagramSection from './components/InstagramSection';
import Footer from './components/Footer';
import { ProductNavigationProvider } from '../lib/productNavigation';

// Hero + Novidades + PipocaGravata + Brands
// ExploreProducts carrega via IntersectionObserver (abaixo do fold)
const TOTAL_ASYNC = 4;

export default function App() {
  const [readyCount, setReadyCount] = useState(0);
  const onSectionLoad = useCallback(() => setReadyCount((c) => c + 1), []);

  const allReady = readyCount >= TOTAL_ASYNC;
  const progress = (readyCount / TOTAL_ASYNC) * 100;

  return (
    <ProductNavigationProvider>
      <AnimatePresence>
        {!allReady && <LoadingScreen key="loading" progress={progress} />}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-accent/20 to-primary/10">
        <Navigation />
        <Hero onLoad={onSectionLoad} />
        <Novidades onLoad={onSectionLoad} />
        <PipocaGravata onLoad={onSectionLoad} />
        <Brands onLoad={onSectionLoad} />
        <About />
        <ExploreProducts />
        <InstagramSection />
        <Contact />
        <Footer />
      </div>
    </ProductNavigationProvider>
  );
}
