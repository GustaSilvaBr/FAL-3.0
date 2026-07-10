import { useEffect, useState } from 'react';
import type { SectionBanners } from '../../lib/types';

const PHOTO_DURATION = 5000;
const SLIDE_VW = 62;
const GAP_VW   = 6;
const PEEK_VW  = 16;

type Slide = { src: string; alt: string };

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [displayIdx, setDisplayIdx] = useState(1); // position within extSlides
  const [animated, setAnimated]     = useState(true);

  useEffect(() => {
    fetch('/api/sections.php?id=banners')
      .then((r) => r.json())
      .then((data: SectionBanners) => {
        if (data.items?.length) {
          const items = data.items.map((b) => ({ src: b.imageUrl, alt: b.alt || 'Banner FAL' }));
          items.forEach(({ src }) => { new Image().src = src; });
          setSlides(items);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-advance
  useEffect(() => {
    if (slides.length < 2) return;
    const id = setTimeout(() => {
      setAnimated(true);
      setDisplayIdx((i) => i + 1);
    }, PHOTO_DURATION);
    return () => clearTimeout(id);
  }, [displayIdx, slides.length]);

  // Re-enable animation one frame after a silent jump
  useEffect(() => {
    if (!animated) {
      const frame = requestAnimationFrame(() => setAnimated(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [animated]);

  if (slides.length === 0) {
    return (
      <div id="home" className="w-full mt-4 animate-pulse rounded-2xl"
        style={{ height: `${SLIDE_VW * 9 / 16}vw` }} />
    );
  }

  // Extended track: [last, ...slides, first] for infinite loop
  const ext = [slides[slides.length - 1], ...slides, slides[0]];
  const realIdx = (displayIdx - 1 + slides.length) % slides.length; // 0-based dot index

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName !== 'transform') return;
    if (displayIdx >= ext.length - 1) {
      // Landed on clone of first → silently jump to real first
      setAnimated(false);
      setDisplayIdx(1);
    } else if (displayIdx <= 0) {
      // Landed on clone of last → silently jump to real last
      setAnimated(false);
      setDisplayIdx(slides.length);
    }
  };

  const translateX = PEEK_VW - displayIdx * (SLIDE_VW + GAP_VW);

  return (
    <div id="home" className="relative w-full mt-4 overflow-hidden"
      style={{ height: `${SLIDE_VW * 9 / 16}vw` }}>

      {/* Sliding track */}
      <div
        className={animated ? 'flex h-full transition-transform duration-700 ease-in-out' : 'flex h-full'}
        style={{ transform: `translateX(${translateX}vw)`, gap: `${GAP_VW}vw` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {ext.map((slide, i) => (
          <div
            key={i}
            onClick={() => {
              if (i < displayIdx) { setAnimated(true); setDisplayIdx((d) => d - 1); }
              else if (i > displayIdx) { setAnimated(true); setDisplayIdx((d) => d + 1); }
            }}
            className={`shrink-0 h-full rounded-2xl overflow-hidden ${animated ? 'transition-opacity duration-700' : ''} ${
              i !== displayIdx ? 'opacity-60 cursor-pointer' : 'cursor-default'
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

      {/* Dot indicators — centered over the main slide */}
      {slides.length > 1 && (
        <div
          className="absolute bottom-4 z-10 flex gap-2 items-center"
          style={{ left: `${PEEK_VW + SLIDE_VW / 2}vw`, transform: 'translateX(-50%)' }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setAnimated(true); setDisplayIdx(i + 1); }}
              aria-label={`Ir para slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === realIdx ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
