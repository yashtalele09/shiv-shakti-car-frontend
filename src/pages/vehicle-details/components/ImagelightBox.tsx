import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  altPrefix?: string;
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&q=90',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=90',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=90',
];

const fallback = (i: number) => FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];

// ─── Component ────────────────────────────────────────────────────────────────

const ImageLightbox = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  altPrefix = 'Image',
}: ImageLightboxProps) => {
  const [current, setCurrent] = useState(initialIndex);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  // Sync initial index when opening
  useEffect(() => {
    if (isOpen) setCurrent(initialIndex);
  }, [isOpen, initialIndex]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!thumbnailRef.current) return;
    const active = thumbnailRef.current.querySelector<HTMLButtonElement>(
      '[data-active="true"]'
    );
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [current]);

  // ── navigation ──

  const goTo = useCallback(
    (index: number, dir: 'left' | 'right') => {
      if (animating || index === current) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
        setDirection(null);
      }, 200);
    },
    [animating, current]
  );

  const next = useCallback(
    () => goTo((current + 1) % images.length, 'right'),
    [current, goTo, images.length]
  );

  const prev = useCallback(
    () => goTo((current - 1 + images.length) % images.length, 'left'),
    [current, goTo, images.length]
  );

  // ── keyboard ──

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [isOpen, next, prev, onClose]);

  if (!isOpen) return null;

  // ── animation classes ──

  const imgClass = animating
    ? direction === 'right'
      ? 'opacity-0 -translate-x-4'
      : 'opacity-0 translate-x-4'
    : 'opacity-100 translate-x-0';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Blur overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      />

      {/* ── Top bar ── */}
      <div className="flex flex-shrink-0 items-center justify-between px-4 py-3">
        <span className="text-xs font-medium tracking-widest uppercase text-white/40">
          {current + 1} / {images.length}
        </span>

        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-200 hover:border-[#FF7272] hover:bg-[#FF7272]/20 active:scale-95"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Main image ── */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14">
        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-200 hover:border-[#FF7272] hover:bg-[#FF7272]/20 active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Image */}
        <div className="flex h-full w-full items-center justify-center">
          <img
            key={current}
            src={images[current]}
            alt={`${altPrefix} ${current + 1}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallback(current);
            }}
            className={`max-h-full max-w-full select-none rounded-xl object-contain shadow-2xl transition-all duration-200 ${imgClass}`}
          />
        </div>

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-200 hover:border-[#FF7272] hover:bg-[#FF7272]/20 active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {images.length > 1 && (
        <div className="relative flex-shrink-0 pb-5 pt-3">
          {/* Edge fades */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)' }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8"
            style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.8), transparent)' }}
          />

          <div
            ref={thumbnailRef}
            className="flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((img, i) => (
              <button
                key={i}
                data-active={i === current}
                onClick={() => goTo(i, i > current ? 'right' : 'left')}
                aria-label={`Go to image ${i + 1}`}
                className={[
                  'relative h-12 min-w-[4rem] flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200',
                  i === current
                    ? 'scale-110 border-[#FF7272] opacity-100'
                    : 'border-white/10 opacity-50 hover:border-white/30 hover:opacity-75',
                ].join(' ')}
                style={
                  i === current
                    ? { boxShadow: '0 0 0 1px rgba(255,114,114,0.4), 0 4px 16px rgba(255,114,114,0.3)' }
                    : {}
                }
              >
                <img
                  src={img}
                  alt=""
                  aria-hidden="true"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallback(i);
                  }}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;