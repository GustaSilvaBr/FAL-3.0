import { motion } from 'motion/react';

export default function ProductGallery() {
  const productImages = [
    {
      name: 'Amendoim',
      image: new URL('../../assets/products/Amendoim/amendoim.jpeg', import.meta.url).href,
    },
    {
      name: 'Batata Chips',
      image: new URL('../../assets/products/Batata Chips/batatachips_original.jpeg', import.meta.url).href,
    },
    {
      name: 'Bolinhos de Goma',
      image: new URL('../../assets/products/Bolinhos de Goma/bolinhos_De_goma_50g.png', import.meta.url).href,
    },
    {
      name: 'Paçoca',
      image: new URL('../../assets/products/Paçoca/paçoca.jpeg', import.meta.url).href,
    },
    {
      name: 'Pipoca Gravatá',
      image: new URL('../../assets/products/Pipoca Gravatá/Amanteigadas/pipoca_gravatá_10g_0trans_yellow.jpeg', import.meta.url).href,
    },
    {
      name: 'Salgadinhos',
      image: new URL("../../assets/products/Salgadinhos/Pipofloc's/pipo_flocs_queijo_13g.jpeg", import.meta.url).href,
    },
    {
      name: 'Salgadinhos de Trigo',
      image: new URL('../../assets/products/Salgadinhos de Trigo/Belleza/belleza_queijo_40g.jpeg', import.meta.url).href,
    },
    {
      name: 'Torresminho',
      image: new URL('../../assets/products/Torresminho/piggys_bacon_30g.jpeg', import.meta.url).href,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl text-foreground mb-4">
            Variedade que Encanta
          </h3>
          <p className="text-lg text-muted-foreground">
            Conheça nossa linha completa de produtos
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {productImages.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-white p-6 hover:shadow-xl transition-all duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                <span className="text-white text-lg">{product.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
