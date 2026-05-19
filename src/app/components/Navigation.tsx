import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import falLogo from '../../assets/FAL_LOGO.png';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Início', href: 'home' },
    { label: 'Sobre', href: 'about' },
    { label: 'Nordeste Gravatá', href: 'brands' },
    { label: 'Produtos', href: 'products' },
    { label: 'Contato', href: 'contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <img src={falLogo} alt="FAL Logo" className="h-12 w-auto" />
          </div>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                className="text-foreground hover:text-primary transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
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
            className="md:hidden bg-white border-t border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={`#${item.href}`}
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
