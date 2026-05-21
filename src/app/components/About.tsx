import { motion } from 'motion/react';
import { Heart, Award, Users, Leaf } from 'lucide-react';
import falCompany from '@/assets/FAL_COMPANY.png';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Paixão',
      description: 'Cada produto é feito com amor e dedicação aos sabores autênticos do Brasil.',
    },
    {
      icon: Award,
      title: 'Qualidade',
      description: 'Mantemos os mais altos padrões em cada etapa do nosso processo de produção.',
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Apoiamos produtores locais e unimos famílias por meio da comida.',
    },
    {
      icon: Leaf,
      title: 'Sustentabilidade',
      description: 'Comprometidos com práticas ambientalmente responsáveis e ingredientes naturais.',
    },
  ];

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      <img
        src={falCompany}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
      />
      <div className="absolute inset-0 bg-background/75" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Nossa História
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Há mais de três décadas fabricamos petiscos brasileiros autênticos em Gravatá. Da nossa famosa pipoca à tradicional
            paçoca, amendoim e salgadinhos, levamos o verdadeiro sabor do Nordeste brasileiro para famílias de todo o país.
            Nosso compromisso com a qualidade, a tradição e os sabores autênticos permanece inabalável.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-16 h-16 bg-[#FFE800] rounded-full flex items-center justify-center mb-6">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl mb-3 text-foreground">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

  );
}
