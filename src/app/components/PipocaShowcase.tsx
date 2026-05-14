import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';

export default function PipocaShowcase() {
  const benefits = [
    '0% Trans Fat',
    'Crocante e Amanteigada',
    'Produto 100% Natural',
    'Tradicional Nordestino',
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-accent/30 via-white to-primary/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-accent" />
              <span className="text-accent text-lg uppercase tracking-wider">Nossa Estrela</span>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl text-foreground mb-6">
              Pipoca<br />
              <span className="text-primary">Nordeste Gravatá</span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              A pipoca que conquistou o coração dos brasileiros. Crocante, saborosa e feita com ingredientes selecionados,
              nossa pipoca é perfeita para qualquer momento.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#products"
                className="px-8 py-4 bg-primary text-white text-lg text-center rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Ver Todas as Variedades
              </a>
              <a
                href="#contact"
                className="px-8 py-4 bg-white text-primary text-lg text-center border-2 border-primary rounded-lg hover:bg-primary/5 transition-all duration-200"
              >
                Entre em Contato
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <img
                  src={new URL('../imports/WhatsApp_Image_2026-05-05_at_8.00.17_AM__1_.jpeg', import.meta.url).href}
                  alt="Pipoca Nordeste Gravatá"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
