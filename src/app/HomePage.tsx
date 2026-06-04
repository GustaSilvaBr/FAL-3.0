'use client';
import { ProductNavigationProvider } from '../lib/productNavigation';
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
import type { NovidadesDisplayItem, BannerSlide } from '../../lib/data';
import type { PipocaCategory, Product, Folder, InstagramPost } from '../lib/types';

type HomePageProps = {
  bannerSlides: BannerSlide[];
  novidadesItems: NovidadesDisplayItem[];
  pipocaCategories: PipocaCategory[];
  pipocaProductMap: Record<string, Product>;
  brandsProducts: Product[];
  instagramPosts: InstagramPost[];
  products: Product[];
  folders: Folder[];
};

export default function HomePage({
  bannerSlides,
  novidadesItems,
  pipocaCategories,
  pipocaProductMap,
  brandsProducts,
  instagramPosts,
  products,
  folders,
}: HomePageProps) {
  return (
    <ProductNavigationProvider>
      <div className="min-h-screen">
        <Navigation />
        <Hero slides={bannerSlides} />
        <Novidades items={novidadesItems} />
        <PipocaGravata categories={pipocaCategories} productMap={pipocaProductMap} />
        <Brands allProducts={brandsProducts} />
        <About />
        <ExploreProducts products={products} folders={folders} />
        <Contact />
        <InstagramSection posts={instagramPosts} />
        <Footer />
      </div>
    </ProductNavigationProvider>
  );
}
