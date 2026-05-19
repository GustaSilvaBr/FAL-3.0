import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Novidades from './components/Novidades';
import PipocaGravata from './components/PipocaGravata';
import Brands from './components/Brands';
import ProductCatalog from './components/ProductCatalog';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Novidades />
      <PipocaGravata />
      <Brands />
      <ProductCatalog />
      <Footer />
    </div>
  );
}