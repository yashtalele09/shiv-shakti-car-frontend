import { useState } from 'react';
import Card from '../../../../assets/banner.png';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Fuel,
  Gauge,
  Calendar,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Star,
} from 'lucide-react';

interface CarCardProps {
  vehicle_id: string;
  title: string;
  price: string;
  fuel: string;
  transmission: string;
  km: string;
  year: string;
  media?: string[];
  featured?: boolean;
}

// ─── Featured ribbon — shares the visual language of the main CarCard ─────────
const FeaturedRibbon = () => (
  <div className="relative flex items-center gap-1 overflow-hidden rounded-r-full bg-gradient-to-r from-[#FF7272] via-[#ff8a5c] to-[#ffab5c] py-1 pr-3.5 pl-3 text-[10px] font-bold tracking-wide text-white uppercase shadow-[0_4px_14px_rgba(255,114,114,0.5)]">
    <Star size={11} className="fill-white text-white" strokeWidth={0} />
    <span>Featured</span>
    {/* diagonal shine sweep */}
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-8 -skew-x-12 bg-white/40"
      animate={{ x: ['-2rem', '9rem'] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        repeatDelay: 2.2,
        ease: 'easeInOut',
      }}
    />
    {/* little fold shadow so it reads as a flag, not a pill */}
    <span
      aria-hidden
      className="absolute -bottom-1.5 left-0 h-1.5 w-2 bg-[#b23f3f]/70"
      style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
    />
  </div>
);
const CarCard = ({
  vehicle_id,
  title,
  price,
  fuel,
  km,
  year,
  media = [],
}: CarCardProps) => {
  const [liked, setLiked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();

  const isVideo = (url: string) =>
    url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');

  const hasMedia = media.length > 0;
  const currentMedia = hasMedia ? media[currentIndex] : Card;
  const isCurrentLoaded = loadedMap[currentIndex] ?? false;

  const markLoaded = (index: number) =>
    setLoadedMap((prev) => ({ ...prev, [index]: true }));

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const goToDetails = () =>
    navigate(`/vehicle-details?vehicle_id=${vehicle_id}`);

  return (
    <div
      onClick={goToDetails}
      className="group w-[210px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-[#ede8f5] bg-white shadow-[0_4px_16px_rgba(46,5,78,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(46,5,78,0.14)]"
    >
      {/* ── Media ── */}
      <div className="relative h-[128px] overflow-hidden bg-[#f5f0fb]">
        {/* Skeleton shimmer — shown until media loads */}
        {!isCurrentLoaded && (
          <div className="absolute inset-0 z-10 overflow-hidden">
            <div className="h-full w-full bg-[#f0ebfa]" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s infinite',
              }}
            />
          </div>
        )}

        {/* Preload all images in background so navigation is instant */}
        {media.map((src, i) =>
          !isVideo(src) ? (
            <img
              key={i}
              src={src}
              alt=""
              className="hidden"
              onLoad={() => markLoaded(i)}
            />
          ) : null
        )}

        {isVideo(currentMedia) ? (
          <video
            src={currentMedia}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
              isCurrentLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => markLoaded(currentIndex)}
          />
        ) : (
          <img
            src={currentMedia}
            alt={title}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
              isCurrentLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => markLoaded(currentIndex)}
          />
        )}

        {/* Soft bottom gradient so dots/counter stay legible over bright photos */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {/* Top-left badge stack — Featured ribbon + slide counter, no more overlap hacks */}
        <div className="absolute top-2.5 left-0 z-20 flex flex-col items-start gap-1">
          <FeaturedRibbon />
          {media.length > 1 && isCurrentLoaded && (
            <span className="ml-2 rounded-full bg-black/50 px-1.5 py-0.5 text-[9.5px] font-medium text-white backdrop-blur-sm">
              {currentIndex + 1}/{media.length}
            </span>
          )}
        </div>

        {/* Arrows — visible on hover (desktop), tappable always (touch) */}
        {media.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous media"
              className="absolute top-1/2 left-2 z-20 flex h-6.5 w-6.5 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 opacity-100 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft
                size={13}
                strokeWidth={2.5}
                className="text-[#2e054e]"
              />
            </button>
            <button
              onClick={goNext}
              aria-label="Next media"
              className="absolute top-1/2 right-2 z-20 flex h-6.5 w-6.5 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 opacity-100 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight
                size={13}
                strokeWidth={2.5}
                className="text-[#2e054e]"
              />
            </button>
          </>
        )}

        {/* Dots */}
        {media.length > 1 && (
          <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1">
            {media.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
                aria-label={`Go to media ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-3.5 bg-white' : 'w-1.5 bg-white/55'
                }`}
              />
            ))}
          </div>
        )}

        {/* Like */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked((prev) => !prev);
          }}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform duration-200 active:scale-90"
        >
          <Heart
            size={13}
            strokeWidth={2}
            className={`transition-colors duration-200 ${
              liked ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-2 p-3">
        <p className="truncate text-[13px] leading-tight font-bold tracking-[-0.1px] text-[#1a0330]">
          {title}
        </p>

        <div className="flex flex-wrap gap-1">
          {[
            { icon: <Fuel size={10} />, label: fuel },
            { icon: <Gauge size={10} />, label: km },
            { icon: <Calendar size={10} />, label: year },
          ].map((s, i) => (
            <span
              key={i}
              className="flex items-center gap-1 rounded-md bg-[#f7f3ff] px-1.5 py-0.5 text-[10px] font-medium text-[#6b5a85]"
            >
              {s.icon} {s.label}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-[#ede8f5] pt-2">
          <p className="text-[14px] font-bold tracking-tight text-[#2e054e]">
            {price}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToDetails();
            }}
            className="flex items-center gap-0.5 text-[11px] font-semibold text-[#FF7272] transition-colors hover:text-[#e35a5a]"
          >
            View
            <ArrowRight
              size={13}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>

      {/* Shimmer + ribbon shine keyframes */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes ribbonShine {
          0%   { transform: translateX(-1rem) skewX(-12deg); opacity: 0; }
          15%  { opacity: 1; }
          40%  { transform: translateX(5.5rem) skewX(-12deg); opacity: 0; }
          100% { transform: translateX(5.5rem) skewX(-12deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CarCard;
