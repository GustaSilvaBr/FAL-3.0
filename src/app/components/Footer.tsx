import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gradient-to-br from-foreground via-foreground to-primary/20 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-primary">Nordeste</span>
              <span className="ml-1 text-3xl font-bold text-secondary">Food</span>
            </div>
            <p className="text-white/80 mb-6">
              Levando o sabor autêntico do Nordeste brasileiro para famílias de todo o país desde 1990.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-white/80 hover:text-primary transition-colors">Sobre Nós</a></li>
              <li><a href="#brands" className="text-white/80 hover:text-primary transition-colors">Nossas Marcas</a></li>
              <li><a href="#products" className="text-white/80 hover:text-primary transition-colors">Produtos</a></li>
              <li><a href="#" className="text-white/80 hover:text-primary transition-colors">Trabalhe Conosco</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl mb-6">Informações</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/80 hover:text-primary transition-colors">Sustentabilidade</a></li>
              <li><a href="#" className="text-white/80 hover:text-primary transition-colors">Padrões de Qualidade</a></li>
              <li><a href="#" className="text-white/80 hover:text-primary transition-colors">Imprensa</a></li>
              <li><a href="#" className="text-white/80 hover:text-primary transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl mb-6">Fale Conosco</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-white/80">Rua Principal, 123<br />Gravatá, PE - Brazil</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary flex-shrink-0" />
                <span className="text-white/80">+55 (81) 3000-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary flex-shrink-0" />
                <span className="text-white/80">contact@nordestefood.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60">
          <p>&copy; {currentYear} Nordeste Food. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
