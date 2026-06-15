import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SectionBanners } from '../../lib/types';

const PHOTO_DURATION = 5000;

type Slide = { src: string; alt: string };

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/sections.php?id=banners')
      .then((r) => r.json())
      .then((data: SectionBanners) => {
        if (data.items?.length) {
          setSlides(data.items.map((b) => ({ src: b.imageUrl, alt: b.alt || 'Banner FAL' })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const id = setTimeout(() => setCurrent((c) => (c + 1) % slides.length), PHOTO_DURATION);
    return () => clearTimeout(id);
  }, [current, slides.length]);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  if (slides.length === 0) {
    return <section id="home" className="w-[60%] mx-auto my-6 rounded-2xl bg-gray-200 animate-pulse" style={{ aspectRatio: '16/9' }} />;
  }

  return (
    <section id="home" className="relative w-[60%] mx-auto my-6 rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '16/9' }}>

      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          aria-label={slide.alt}
          className="absolute inset-0 transition-opacity duration-700 bg-center bg-contain bg-no-repeat"
          style={{
            backgroundImage: `url(${slide.src})`,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Arrow — prev */}
      {slides.length > 1 && (
        <button
          onClick={prev}
          aria-label="Slide anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition"
        >
          <ChevronLeft size={22} className="text-gray-800" />
        </button>
      )}

      {/* Arrow — next */}
      {slides.length > 1 && (
        <button
          onClick={next}
          aria-label="Próximo slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition"
        >
          <ChevronRight size={22} className="text-gray-800" />
        </button>
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir para slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
