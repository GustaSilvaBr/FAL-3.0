import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const truckImg      = new URL('../../assets/nossa_historia/truck.png', import.meta.url).href;
const nordesteImg   = new URL('../../assets/nossa_historia/nordeste_gravatá.jpg', import.meta.url).href;
const pipocaImg     = new URL('../../assets/nossa_historia/pipoca_inclusão.png', import.meta.url).href;

const panels = [
  {
    img: truckImg,
    fit: 'cover' as const,
    alt: 'Caminhão FAL na estrada',
    num: '01',
    title: 'Na Estrada Desde o Início',
    text: 'Com nosso caminhão, levamos o sabor nordestino de Gravatá para todo o Brasil. Cada entrega é uma promessa de qualidade e tradição.',
  },
  {
    img: nordesteImg,
    fit: 'cover' as const,
    alt: 'Fachada Nordeste Gravatá — Desde 1971',
    num: '02',
    title: 'Gravatá, Nossa Origem',
    text: 'Fundada em 1971 no coração de Pernambuco, nossa fábrica carrega décadas de receitas autênticas e o orgulho de uma tradição que resistiu ao tempo.',
  },
  {
    img: pipocaImg,
    fit: 'contain' as const,
    alt: 'Pipoca Gravatá — linha inclusiva',
    num: '03',
    title: 'Pipoca para Todos',
    text: 'Acreditamos que o bom sabor não tem barreiras. Nossa linha inclusiva celebra a diversidade e garante que todos possam saborear o melhor do Nordeste.',
  },
] as const;

export default function About() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section id="about" className="overflow-hidden bg-white">

      {/* ── Section header ── */}
      {/* <div className="py-16 text-center px-4">
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Nossa História
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          Tradição, sabor e paixão que atravessam gerações — essa é a história da FAL.
        </motion.p>
      </div> */}

      {/* ── Diagonal panels ── */}
      <div
        className="flex"
        style={{ flexDirection: isDesktop ? 'row' : 'column', height: isDesktop ? '620px' : 'auto' }}
      >
        {panels.map((panel, i) => {
          const isLast = i === panels.length - 1;

          const panelStyle = isDesktop
            ? {
                clipPath: isLast
                  ? undefined
                  : 'polygon(0 0, calc(100% - 3.5rem) 0, 100% 100%, 0 100%)',
                marginLeft: i > 0 ? '-3.5rem' : undefined,
                zIndex: panels.length - i,
              }
            : { zIndex: panels.length - i };

          return (
            <motion.div
              key={panel.title}
              className="relative flex-1"
              style={{ ...panelStyle, minHeight: isDesktop ? 0 : '360px' }}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.14 }}
            >
              {/* ── Background image ── */}
              <img
                src={panel.img}
                alt={panel.alt}
                className="absolute inset-0 w-full h-full"
                style={{
                  objectFit: panel.fit,
                  objectPosition: 'center',
                  padding: panel.fit === 'contain' ? '1.5rem' : undefined,
                }}
              />

              {/* ── Text area: frosted glass with brand gradient ── */}
              <div
                className="absolute inset-x-0 bottom-0 backdrop-blur-md p-7 md:p-8 text-white"
                style={{
                  background: 'linear-gradient(135deg, color-mix(in srgb,var(--accent) 72%,transparent) 0%, color-mix(in srgb,var(--primary) 78%,transparent) 100%)',
                  paddingLeft: isDesktop && i > 0 ? '5rem' : undefined,
                }}
              >
                <span className="block text-[0.65rem] font-black uppercase tracking-[0.35em] opacity-60 mb-2">
                  {panel.num}
                </span>
                <h3 className="text-xl md:text-[1.35rem] font-black leading-tight mb-2">
                  {panel.title}
                </h3>
                <p className="text-[0.82rem] md:text-sm leading-relaxed" style={{ opacity: 0.9 }}>
                  {panel.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
