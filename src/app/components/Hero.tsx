'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from './ui/carousel';

const PHOTO_DURATION = 5000;

type Slide = { src: string; alt: string };

export default function Hero({ slides }: { slides: Slide[] }) {
  const [api, setApi]         = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const timerRef              = useRef<ReturnType<typeof setTimeout>>(undefined);

  const stopAutoplay = useCallback(() => clearTimeout(timerRef.current), []);

  const scheduleNext = useCallback(
    (_index: number) => {
      stopAutoplay();
      timerRef.current = setTimeout(() => { api?.scrollNext(); }, PHOTO_DURATION);
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

  if (slides.length === 0) {
    return <section id="home" className="relative h-screen bg-gray-900" />;
  }

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Carousel background */}
      <div className="absolute inset-0 z-0">
        <Carousel key={slides.length} setApi={setApi} opts={{ loop: true }} className="h-full w-full">
          <CarouselContent className="ml-0 h-screen">
            {slides.map((slide, i) => (
              <CarouselItem key={i} className="pl-0 h-screen">
                <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
              </CarouselItem>
            ))}
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
        />
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { api?.scrollTo(i); scheduleNext(i); }}
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
