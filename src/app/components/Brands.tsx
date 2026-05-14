import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function Brands() {
  const brands = [
    {
      name: 'Nordeste Gravatá',
      tagline: 'O Sabor Autêntico do Nordeste Brasileiro',
      description: 'Nossa marca principal leva receitas tradicionais e qualidade premium para cada cozinha. Da nossa famosa pipoca a salgadinhos e doces irresistíveis, Nordeste Gravatá é sinônimo de sabor e tradição brasileiros autênticos.',
      image: new URL('../imports/WhatsApp_Image_2026-05-05_at_8.00.17_AM__1_.jpeg', import.meta.url).href,
      featured: true,
    },
  ];

  return (
    <section id="brands" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Nossas Marcas
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma família de marcas unidas pela qualidade, tradição e o sabor autêntico do Brasil.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-primary/10 to-accent/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-16">
            <div className="flex flex-col justify-center order-1">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-8 h-8 text-accent" />
                <span className="text-accent text-lg uppercase tracking-wider">Nosso Orgulho</span>
              </div>
              <h3 className="text-5xl md:text-6xl lg:text-7xl mb-6 text-foreground">
                Nordeste Gravatá
              </h3>
              <p className="text-2xl md:text-3xl text-primary mb-8">
                O Sabor Autêntico do Nordeste Brasileiro
              </p>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Nossa marca principal leva receitas tradicionais e qualidade premium para cada cozinha. Da nossa famosa pipoca a salgadinhos e doces irresistíveis, Nordeste Gravatá é sinônimo de sabor e tradição brasileiros autênticos.
              </p>
              <div>
                <a
                  href="#products"
                  className="inline-block px-8 py-4 bg-primary text-white text-lg rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Conheça Nossos Produtos
                </a>
              </div>
            </div>
            <div className="relative h-96 lg:h-auto order-2">
              <img
                src={new URL('../imports/WhatsApp_Image_2026-05-05_at_8.00.17_AM__1_.jpeg', import.meta.url).href}
                alt="Nordeste Gravatá Products"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
