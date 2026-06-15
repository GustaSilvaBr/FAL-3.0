import { useEffect, useState } from 'react';
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

  const prevIdx = (current - 1 + slides.length) % slides.length;
  const nextIdx = (current + 1) % slides.length;

  if (slides.length === 0) {
    return <div id="home" className="w-full my-6 bg-gray-200 animate-pulse rounded-2xl" style={{ aspectRatio: '16/9' }} />;
  }

  return (
    <div id="home" className="flex items-stretch w-full my-10">

      {/* Peek — slide anterior */}
      {slides.length > 1 && (
        <button
          onClick={() => setCurrent(prevIdx)}
          aria-label="Slide anterior"
          className="w-[5%] shrink-0 rounded-r-2xl overflow-hidden opacity-50 hover:opacity-70 transition-opacity shadow-md"
          style={{
            backgroundImage: `url(${slides[prevIdx].src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
          }}
        />
      )}

      {/* Gap esquerdo */}
      <div className="w-[14%] shrink-0" />

      {/* Slide principal */}
      <section
        className="flex-1 relative overflow-hidden rounded-2xl shadow-lg"
        style={{ aspectRatio: '16/9' }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            aria-label={slide.alt}
            className="absolute inset-0 transition-opacity duration-700 bg-center bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${slide.src})`, opacity: i === current ? 1 : 0 }}
          />
        ))}

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

      {/* Gap direito */}
      <div className="w-[14%] shrink-0" />

      {/* Peek — próximo slide */}
      {slides.length > 1 && (
        <button
          onClick={() => setCurrent(nextIdx)}
          aria-label="Próximo slide"
          className="w-[5%] shrink-0 rounded-l-2xl overflow-hidden opacity-50 hover:opacity-70 transition-opacity shadow-md"
          style={{
            backgroundImage: `url(${slides[nextIdx].src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
          }}
        />
      )}

    </div>
  );
}
