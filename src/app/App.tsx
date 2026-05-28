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
import Footer from './components/Footer';

// Sections that report when they finish loading: Novidades, PipocaGravata, Brands, ExploreProducts
const TOTAL_ASYNC = 4;

export default function App() {
  const [readyCount, setReadyCount] = useState(0);
  const onSectionLoad = useCallback(() => setReadyCount((c) => c + 1), []);

  const allReady  = readyCount >= TOTAL_ASYNC;
  const progress  = (readyCount / TOTAL_ASYNC) * 100;

  return (
    <>
      <AnimatePresence>
        {!allReady && <LoadingScreen key="loading" progress={progress} />}
      </AnimatePresence>

      <div className="min-h-screen">
        <Navigation />
        <Hero />
        <Novidades    onLoad={onSectionLoad} />
        <PipocaGravata onLoad={onSectionLoad} />
        <Brands        onLoad={onSectionLoad} />
        <About />
        <ExploreProducts onLoad={onSectionLoad} />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
