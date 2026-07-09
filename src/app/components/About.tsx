import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const truckImg      = new URL('../../assets/nossa_historia/truck.png', import.meta.url).href;
const nordesteImg   = new URL('../../assets/nossa_historia/nordeste_gravatá.png', import.meta.url).href;
const pipocaImg     = new URL('../../assets/nossa_historia/pipoca_inclusão.jpeg', import.meta.url).href;

const panels = [
  {
    img: truckImg,
    bgSize: 'cover',
    bgPosition: '70% center',
    alt: 'Caminhão FAL na estrada',
    num: '',
    title: 'FROTA PRÓPRIA',
    text: 'MUITO MAIS DO QUE TRANSPORTAR PRODUTOS, LEVAMOS HISTÓRIAS, SABORES E TRADIÇÕES QUE CONECTAM GERAÇÕES.',
  },
  {
    img: nordesteImg,
    bgSize: 'cover',
    bgPosition: 'center',
    alt: 'Fachada Nordeste Gravatá — Desde 1971',
    num: '',
    title: 'NOSSA ORIGEM',
    text: 'DESDE 1971, SEGUIMOS COMPROMETIDOS COM A QUALIDADE, PRESERVANDO TRADIÇÃO E VALORES QUE FAZEM PARTE DO NOSSO LEGADO.',
  },
  {
    img: pipocaImg,
    bgSize: 'cover',
    bgPosition: 'center',
    alt: 'Pipoca Gravatá — linha inclusiva',
    num: '',
    title: 'EMPRESA INCLUSIVA',
    text: 'APOIAMOS INICIATIVAS QUE INCENTIVAM A CONSCIENTIZAÇÃO, O RESPEITO E A INCLUSÃO.',
  },
];

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
              style={{
                ...panelStyle,
                minHeight: isDesktop ? 0 : '360px',
                backgroundImage: `url(${panel.img})`,
                backgroundSize: panel.bgSize,
                backgroundPosition: panel.bgPosition,
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#111',
              }}
              aria-label={panel.alt}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.14 }}
            >
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
