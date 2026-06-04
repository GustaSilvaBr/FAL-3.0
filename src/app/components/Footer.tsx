'use client';
import { Facebook, Instagram, Mail, Phone, MapPin, Clock } from 'lucide-react';
import falLogoImg from '../../assets/FAL_LOGO.png';

const falLogo = (falLogoImg as unknown as { src: string }).src ?? falLogoImg as unknown as string;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative z-0" style={{ backgroundColor: '#FFE800' }}>

      {/* Faixa Gravatá recreada em SVG */}
      <div className="w-full" style={{ lineHeight: 0 }}>
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          style={{ height: '160px' }}
        >
          {/* Área branca acima da faixa – afunila no centro onde a onda desce */}
          <path
            d="M0,0 H1440 V12 Q720,232 0,12 Z"
            fill="white"
          />
          {/* Listra azul (topo) */}
          <path
            d="M0,20 Q720,240 1440,20"
            fill="none"
            stroke="#1B3A8F"
            strokeWidth="16"
          />
          {/* Listra branca (meio) */}
          <path
            d="M0,33 Q720,253 1440,33"
            fill="none"
            stroke="white"
            strokeWidth="12"
          />
          {/* Listra vermelha (base) */}
          <path
            d="M0,44 Q720,264 1440,44"
            fill="none"
            stroke="#CC1122"
            strokeWidth="12"
          />
        </svg>
      </div>

      {/* Conteúdo na área amarela */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Marca + Links */}
          <div>
            <div className="mb-6">
              <img src={falLogo} alt="FAL Alimentos" className="h-16 object-contain" />
            </div>
            <p className="text-gray-800 mb-6 text-base leading-relaxed">
              Levando o sabor autêntico do Nordeste brasileiro para famílias de todo o país.
            </p>
            <div className="flex gap-4 mb-8">
              <a
                href="#"
                className="w-10 h-10 bg-black/10 hover:bg-[#1B3A8F] hover:text-white text-gray-900 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-black/10 hover:bg-[#1B3A8F] hover:text-white text-gray-900 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
            <h4 className="text-xs font-bold mb-4 text-[#1B3A8F] uppercase tracking-widest">Links Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-gray-800 hover:text-[#1B3A8F] font-medium transition-colors">Sobre Nós</a></li>
              <li><a href="#brands" className="text-gray-800 hover:text-[#1B3A8F] font-medium transition-colors">Nossas Marcas</a></li>
              <li><a href="#produtos" className="text-gray-800 hover:text-[#1B3A8F] font-medium transition-colors">Produtos</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-xs font-bold mb-6 text-[#1B3A8F] uppercase tracking-widest">Contato</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#CC1122] mt-1 shrink-0" />
                <span className="text-gray-800 leading-relaxed">
                  Avenida Brasil, 27/61<br />
                  Alpes Suíços — Gravatá-PE<br />
                  CEP: 55.645-220
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#CC1122] shrink-0" />
                <span className="text-gray-800">(81) 3533-0595</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#CC1122] shrink-0" />
                <span className="text-gray-800">fal@alimentos.ind.br</span>
              </li>
            </ul>
          </div>

          {/* Loja de Fábrica */}
          <div>
            <h4 className="text-xs font-bold mb-6 text-[#1B3A8F] uppercase tracking-widest">Loja de Fábrica</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#CC1122] shrink-0" />
                <span className="text-gray-800">(81) 9 9705-0409</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-[#CC1122] mt-1 shrink-0" />
                <div className="text-gray-800 leading-relaxed">
                  <p className="text-gray-900 font-bold mb-1">Segunda a Sexta</p>
                  <p>07h às 11h</p>
                  <p>13h às 16h45</p>
                  <p className="text-gray-900 font-bold mt-3 mb-1">Sábados</p>
                  <p>07h às 10h45</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Trabalhe Conosco + Setor Comercial */}
          <div className="space-y-8">
            <div>
              <h4 className="text-xs font-bold mb-4 text-[#1B3A8F] uppercase tracking-widest">Trabalhe Conosco</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-[#CC1122] shrink-0" />
                  <span className="text-gray-800">(81) 9 9515-6083</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-[#CC1122] shrink-0 mt-0.5" />
                  <span className="text-gray-800 break-all">dep.pessoal.fal@alimentos.ind.br</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold mb-4 text-[#1B3A8F] uppercase tracking-widest">Setor Comercial</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-[#CC1122] shrink-0" />
                  <span className="text-gray-800">(81) 9 9515-6265</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-[#CC1122] shrink-0 mt-0.5" />
                  <span className="text-gray-800 break-all">vendas.fal@alimentos.ind.br</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div className="border-t border-black/20 mt-12 pt-8 text-center text-gray-700">
          <p>&copy; {currentYear} FAL Alimentos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
