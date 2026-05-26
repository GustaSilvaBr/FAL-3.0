import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router';
import falLogo from '../../assets/FAL_LOGO.png';


export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < lastScrollY.current || currentY < 10);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const anchorItems = [
    { label: 'Início', anchor: 'home' },
    { label: 'Sobre', anchor: 'about' },
    { label: 'Nordeste Gravatá', anchor: 'brands' },
    { label: 'Contato', anchor: 'contact' },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 shadow-md"
      animate={{ y: visible ? 0 : '-110%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/10 bg-white/90 backdrop-blur-sm" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-24 gap-4">

          {/* Logo — left */}
          <div className="flex items-center gap-2 shrink-0">
            <img src={falLogo} alt="FAL Logo" className="h-14 w-auto" />
          </div>

          {/* Nav links — center */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-8">
            {anchorItems.map((item) => {
              const isHighlight = item.anchor === 'brands';
              const href = isHome ? `#${item.anchor}` : `/#${item.anchor}`;
              return (
                <a
                  key={item.anchor}
                  href={href}
                  className={`relative group whitespace-nowrap transition-colors duration-200 ${
                    isHighlight
                      ? 'text-primary font-bold text-lg hover:text-primary/80'
                      : 'text-foreground font-medium hover:text-primary'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full ${isHighlight ? 'bg-primary h-[2.5px]' : 'bg-primary'}`} />
                </a>
              );
            })}
            <Link
              to="/produtos"
              className={`relative group whitespace-nowrap transition-colors duration-200 font-medium ${
                location.pathname === '/produtos'
                  ? 'text-primary'
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Produtos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
            </Link>
          </div>

          {/* Search bar — right */}
          <div className="hidden md:flex items-center shrink-0">
            <div className="flex items-center gap-2 bg-white/50 hover:bg-white/70 transition-colors rounded-full px-4 py-2 border border-primary/10">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar produtos..."
                className="bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none w-40 focus:w-52 transition-all duration-300"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden ml-auto p-2 rounded-md text-foreground hover:bg-white/30 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="relative md:hidden border-t border-primary/10"
          >
            <div className="px-4 py-4 space-y-3">
              {anchorItems.map((item) => (
                <a
                  key={item.anchor}
                  href={isHome ? `#${item.anchor}` : `/#${item.anchor}`}
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/produtos"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Produtos
              </Link>
              <div className="flex items-center gap-2 bg-white/50 rounded-full px-4 py-2 mt-2 border border-primary/10">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
