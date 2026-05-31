import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from './ui/carousel';
import copa from '../../assets/hero/copa_1200x600px.jpg';
import saoJoao from '../../assets/hero/sao-joao_1200x600px.jpg.jpg';
import sempreImitada from '../../assets/hero/Sempre_imitada.jpg';

const PHOTO_DURATION = 5000;

const slides = [
  { type: 'image' as const, src: copa, alt: 'Copa FAL' },
  { type: 'image' as const, src: saoJoao, alt: 'São João FAL' },
  { type: 'image' as const, src: sempreImitada, alt: 'Sempre Imitada FAL' },
];

function durationFor(_index: number) {
  return PHOTO_DURATION;
}

export default function Hero() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const stopAutoplay = useCallback(() => clearTimeout(timerRef.current), []);

  const scheduleNext = useCallback(
    (index: number) => {
      stopAutoplay();
      timerRef.current = setTimeout(() => {
        api?.scrollNext();
      }, durationFor(index));
    },
    [api, stopAutoplay],
  );

  useEffect(() => {
    if (!api) return;
    const snap = api.selectedScrollSnap();
    setCurrent(snap);
    scheduleNext(snap);

    api.on('select', () => {
      const next = api.selectedScrollSnap();
      setCurrent(next);
      scheduleNext(next);
    });

    return stopAutoplay;
  }, [api, scheduleNext, stopAutoplay]);

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Carousel background */}
      <div className="absolute inset-0 z-0">
        <Carousel setApi={setApi} opts={{ loop: true }} className="h-full w-full">
          <CarouselContent className="ml-0 h-screen">
            {slides.map((slide, i) =>
              slide.type === 'image' ? (
                <CarouselItem key={i} className="pl-0 h-screen">
                  <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
                </CarouselItem>
              ) : (
                <CarouselItem key={i} className="pl-0 h-screen">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                  >
                    <source src={slide.src} type="video/mp4" />
                  </video>
                </CarouselItem>
              ),
            )}
          </CarouselContent>
        </Carousel>

      </div>

      {/* Title */}
      <div className="relative z-10 flex items-start justify-center h-full pt-32">
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl text-white text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
        </motion.h1>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              api?.scrollTo(i);
              scheduleNext(i);
            }}
            aria-label={`Ir para slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white cursor-pointer z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown size={40} />
      </motion.a>
    </section>
  );
}
