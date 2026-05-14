import Navigation from './components/Navigation';
import Hero from './components/Hero';
import PipocaShowcase from './components/PipocaShowcase';
import ProductGallery from './components/ProductGallery';
import About from './components/About';
import Brands from './components/Brands';
import Products from './components/Products';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <PipocaShowcase />
      <ProductGallery />
      <About />
      <Brands />
      <Products />
      <Footer />
    </div>
  );
}