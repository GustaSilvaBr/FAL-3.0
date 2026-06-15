import { useEffect, useState } from 'react';
import type { SectionBanners } from '../../lib/types';

const PHOTO_DURATION = 5000;
const SLIDE_VW = 72;   // slide width as % of viewport
const GAP_VW   = 3;    // gap between slides
const PEEK_VW  = 14;   // visible peek on each side

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

  if (slides.length === 0) {
    return (
      <div id="home" className="w-full my-10 bg-gray-200 animate-pulse rounded-2xl"
        style={{ height: `${SLIDE_VW * 9 / 16}vw` }} />
    );
  }

  const translateX = PEEK_VW - current * (SLIDE_VW + GAP_VW);

  return (
    <div id="home" className="relative w-full my-10 overflow-hidden"
      style={{ height: `${SLIDE_VW * 9 / 16}vw` }}>

      {/* Sliding track */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(${translateX}vw)`, gap: `${GAP_VW}vw` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            onClick={() => setCurrent(i)}
            className={`shrink-0 h-full rounded-2xl overflow-hidden shadow-lg transition-all duration-700 ${
              i !== current ? 'opacity-60 cursor-pointer' : 'cursor-default'
            }`}
            style={{ width: `${SLIDE_VW}vw` }}
          >
            <div
              aria-label={slide.alt}
              className="w-full h-full bg-center bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${slide.src})` }}
            />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 items-center"
          style={{ marginLeft: `${-translateX / 2}vw` }}>
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
    </div>
  );
}
