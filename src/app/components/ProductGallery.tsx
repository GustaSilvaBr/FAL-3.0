import { motion } from 'motion/react';

export default function ProductGallery() {
  const productImages = [
    {
      name: 'Pipoca',
      image: new URL('../imports/WhatsApp_Image_2026-05-05_at_8.00.17_AM__1_.jpeg', import.meta.url).href,
    },
    {
      name: 'Amendoim',
      image: new URL('../imports/WhatsApp_Image_2026-05-04_at_2.35.19_PM.jpeg', import.meta.url).href,
    },
    {
      name: 'Batata Chips',
      image: new URL('../imports/WhatsApp_Image_2026-05-04_at_2.51.45_PM.jpeg', import.meta.url).href,
    },
    {
      name: 'Paçoca',
      image: new URL('../imports/WhatsApp_Image_2026-05-04_at_3.00.46_PM.jpeg', import.meta.url).href,
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
