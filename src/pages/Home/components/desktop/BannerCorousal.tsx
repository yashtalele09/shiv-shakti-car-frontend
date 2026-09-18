import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface HeroSlide {
  id: string;
  image: string;
  /** short label above the title, e.g. "CERTIFIED PRE-OWNED" */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  /** ms between auto-advances. Default 6000. */
  intervalMs?: number;
  /** Renders a search/filter bar under the title. Optional. */
  onSearch?: (query: string) => void;
}

const AUTOPLAY_MS_DEFAULT = 3000;

export default function HeroCarousel({
  slides,
  intervalMs = AUTOPLAY_MS_DEFAULT,
}: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = slides.length;

  const navigate = useNavigate();

  const goTo = useCallback(
    (next: number, dir: 1 | -1) => {
      setDirection(dir);
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  // Autoplay
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (isPaused || prefersReducedMotion || count <= 1) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % count);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, intervalMs, count]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  const slide = slides[index];

  const slideVariants = {
    enter: (_dir: 1 | -1) => ({ opacity: 0, scale: 1.06 }),
    center: { opacity: 1, scale: 1 },
    exit: (_dir: 1 | -1) => ({ opacity: 0, scale: 1.0 }),
  };

  return (
    <section
      className="relative h-[95vh] w-full overflow-hidden bg-slate-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured vehicles"
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Top-to-middle dark shadow: keeps headline/search legible on any photo */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
        style={{
          background:
            'linear-gradient(to bottom, rgba(2,6,23,0.75) 0%, rgba(2,6,23,0.45) 45%, rgba(2,6,23,0) 100%)',
        }}
      />

      {/* Soft rise from the bottom: keeps arrows/dots readable */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            'linear-gradient(to top, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0) 100%)',
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex h-full w-full flex-col items-start justify-center px-6 text-left sm:px-12 lg:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + '-copy'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-xl pl-5"
          >
            <h1 className="text-4xl leading-tight font-bold text-balance text-white drop-shadow-md sm:text-5xl md:text-6xl">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="mt-4 max-w-lg text-base text-slate-200/90 sm:text-lg">
                {slide.subtitle}
              </p>
            )}
            {slide.ctaLabel && (
              <button
                onClick={() => navigate('/vehicle')}
                className="mt-5 rounded-full bg-gradient-to-r from-[#2D1E4A] to-[#4B3A73] px-6 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105"
              >
                Explore Cars
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Optional search bar */}
      </div>

      {/* Prev / Next arrows, pinned to left/right edges */}
      {count > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="group absolute top-1/2 left-3 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 p-2.5 text-white backdrop-blur-md transition-all hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 sm:left-6 sm:p-3"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={goNext}
            aria-label="Next slide"
            className="group absolute top-1/2 right-3 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 p-2.5 text-white backdrop-blur-md transition-all hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 sm:right-6 sm:p-3"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </>
      )}

      {/* Dot indicators + autoplay progress */}
      {count > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className="relative h-1.5 overflow-hidden rounded-full bg-white/30 transition-all"
              style={{ width: i === index ? 32 : 8 }}
            >
              {i === index && !isPaused && (
                <motion.span
                  key={slide.id + '-progress'}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: intervalMs / 1000, ease: 'linear' }}
                  className="absolute inset-0 origin-left bg-indigo-400"
                />
              )}
              {i === index && isPaused && (
                <span className="absolute inset-0 bg-indigo-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
