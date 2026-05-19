import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Novidades from './components/Novidades';
import QueridinhaPipoca from './components/QueridinhaPipoca';
import SempreImitada from './components/SempreImitada';
import PipocaShowcase from './components/PipocaShowcase';
import ProductGallery from './components/ProductGallery';
import About from './components/About';
import Brands from './components/Brands';
import Products from './components/Products';
import ProductCatalog from './components/ProductCatalog';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Novidades />
      <QueridinhaPipoca />
      <SempreImitada />
      <ProductGallery />
      <Brands />
      <About />
      <ProductCatalog />
      <Footer />
    </div>
  );
}