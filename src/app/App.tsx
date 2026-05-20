import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Novidades from './components/Novidades';
import About from './components/About';
import PipocaGravata from './components/PipocaGravata';
import Brands from './components/Brands';
import ExploreProducts from './components/ExploreProducts';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Novidades />

      <PipocaGravata />
      <Brands />
      <About />
      <ExploreProducts />
      <Contact />
      <Footer />
    </div>
  );
}