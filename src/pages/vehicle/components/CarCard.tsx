import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Fuel,
  Settings2,
  Gauge,
  Calendar,
  MapPin,
  Shield,
  Car,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { VehicleDataT } from '../../../typs/vehicle/get';
import { brands } from '../constants';
import { formatPrice } from '../../../helper/format';

interface CarCardProps {
  vehicleData: VehicleDataT;
}

// ─── Helper: detect video by extension ────────────────────────────────────────
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'mov', 'avi'];

const isVideo = (src: string): boolean => {
  const ext = src.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  return VIDEO_EXTENSIONS.includes(ext);
};

// ─── Fallback / Placeholder ────────────────────────────────────────────────────
const PlaceholderImage = () => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#f0ebfa]">
    <Car size={40} className="text-[#c9a8e0]" />
    <span className="text-[11px] font-medium text-[#9b72cf]">
      No Image Available
    </span>
  </div>
);

// ─── Media Slide: renders image OR video ──────────────────────────────────────
interface MediaSlideProps {
  src: string;
  title: string;
  onError: () => void;
}

const MediaSlide = ({ src, title, onError }: MediaSlideProps) => {
  if (isVideo(src)) {
    return (
      <video
        key={src}
        src={src}
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onError={onError}
      />
    );
  }

  return (
    <motion.img
      key={src}
      src={src}
      alt={title}
      onError={onError}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.38, ease: 'easeInOut' }}
      className="h-full w-full object-cover"
    />
  );
};

// ─── Featured ribbon badge ─────────────────────────────────────────────────────
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

// ─── Verified seal badge ────────────────────────────────────────────────────
const VerifiedSeal = () => (
  <div className="flex items-center gap-1 rounded-full bg-white/95 py-1 pr-2.5 pl-1 shadow-[0_2px_10px_rgba(46,5,78,0.18)] ring-1 ring-[#e2d9f5] backdrop-blur-sm">
    <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#5b21b6]">
      <Shield size={9} className="fill-white text-white" strokeWidth={0} />
    </span>
    <span className="text-[10px] font-semibold text-[#2e054e]">Verified</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const CarCard = ({ vehicleData }: CarCardProps) => {
  const [liked, setLiked] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [likeAnim, setLikeAnim] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const navigate = useNavigate();

  // ── Safe media array (never undefined) ──────────────────────────────────────
  const images: string[] =
    Array.isArray(vehicleData?.vehicle_images_video) &&
    vehicleData.vehicle_images_video.length > 0
      ? vehicleData.vehicle_images_video
          .map((img) => img)
          .filter((src): src is string => Boolean(src))
      : [];

  const hasImages = images.length > 0;

  // Reset currentImage if it goes out of bounds (e.g. data changes)
  useEffect(() => {
    if (currentImage >= images.length && images.length > 0) {
      setCurrentImage(0);
    }
  }, [images.length, currentImage]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
  };

  const prev = () =>
    setCurrentImage((i) => (i - 1 + images.length) % images.length);

  const next = () => setCurrentImage((i) => (i + 1) % images.length);

  const handleImgError = (index: number) =>
    setImgError((prev) => ({ ...prev, [index]: true }));

  // ── Derived display values ───────────────────────────────────────────────────
  const title =
    (vehicleData?.vehicle_model &&
      [
        vehicleData?.registration_year,
        vehicleData?.vehicle_brand,
        vehicleData?.vehicle_model,
      ]
        .filter(Boolean)
        .join(' ')) ||
    'Unknown Vehicle';

  const location = vehicleData?.vehicle_location ?? 'Location not specified';
  const price = vehicleData?.vehicle_price ?? '—';
  const brandName =
    vehicleData?.vehicle_brand ?? vehicleData?.vehicle_model ?? 'Unknown';
  const isVerified = true;

  const specs = [
    { icon: Fuel, label: vehicleData?.fuel_type ?? 'Petrol' },
    { icon: Settings2, label: vehicleData?.transmission_type ?? 'Automatic' },
    { icon: Gauge, label: vehicleData?.kilometers_driven ?? '—' },
    { icon: Calendar, label: String(vehicleData?.registration_year ?? '—') },
  ];

  const currentSrc = images[currentImage];
  const currentIsVideo =
    hasImages && !imgError[currentImage] && isVideo(currentSrc);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="relative w-[95%] overflow-hidden rounded-2xl border border-[#ede8f5] bg-white shadow-[0_8px_32px_rgba(46,5,78,0.10)]"
    >
      {/* ── Image / Video Section ── */}
      <div className="group relative h-[195px] overflow-hidden bg-[#f5f0fb]">
        {hasImages ? (
          <>
            <AnimatePresence mode="wait">
              {imgError[currentImage] ? (
                <PlaceholderImage />
              ) : (
                <MediaSlide
                  src={currentSrc}
                  title={`${title} – media ${currentImage + 1}`}
                  onError={() => handleImgError(currentImage)}
                />
              )}
            </AnimatePresence>

            {/* Prev / Next arrows – only when multiple media items */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous media"
                  className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white"
                >
                  <ChevronLeft size={16} className="text-[#2e054e]" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next media"
                  className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1.5 opacity-100 shadow backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white md:opacity-0 md:group-hover:opacity-100"
                >
                  <ChevronRight size={16} className="text-[#2e054e]" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      aria-label={`Go to media ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentImage
                          ? 'w-4 bg-white'
                          : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Video badge */}
            {currentIsVideo && (
              <div className="absolute bottom-8 left-3 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                ▶ Video
              </div>
            )}
          </>
        ) : (
          <PlaceholderImage />
        )}

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a0330]/50 via-transparent to-transparent" />

        {/* Top-left badge stack: Featured ribbon (edge-anchored) + Verified (indented) */}
        <div className="absolute top-3 left-0 z-20 flex flex-col items-start gap-1.5">
          {vehicleData?.isFeatured && <FeaturedRibbon />}

          {isVerified && (
            <div className="ml-3">
              <VerifiedSeal />
            </div>
          )}
        </div>

        {/* Wishlist button */}
        <motion.button
          onClick={handleLike}
          animate={likeAnim ? { scale: [1, 1.4, 0.9, 1] } : {}}
          transition={{ duration: 0.35 }}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-20 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition hover:bg-white"
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${
              liked ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </motion.button>
      </div>

      {/* ── Content Section ── */}
      <div className="flex flex-col gap-3 px-4 pt-3.5 pb-4">
        {/* Title + Location */}
        <div>
          <h3 className="text-[15px] leading-snug font-bold tracking-[-0.2px] text-[#1a0330]">
            {title}
          </h3>
          <div className="mt-0.5 flex items-center gap-1">
            <MapPin size={11} className="text-[#9b72cf]" />
            <span className="text-[11px] text-[#8b7aa0]">{location}</span>
          </div>
        </div>

        {/* Specs Pills */}
        <div className="grid grid-cols-4 gap-1.5">
          {specs.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-xl bg-[#f7f3ff] px-1 py-2"
            >
              <Icon size={13} className="text-[#FF7272]" />
              <span className="text-[9.5px] leading-none font-medium text-[#4a2d6b]">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Brand + Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {vehicleData?.vehicle_brand &&
            brands.find(
              (brand) =>
                vehicleData.vehicle_brand?.toLowerCase() ===
                brand.name.toLowerCase()
            )?.logo ? (
              <img
                src={
                  brands.find(
                    (brand) =>
                      vehicleData.vehicle_brand?.toLowerCase() ===
                      brand.name.toLowerCase()
                  )?.logo
                }
                alt={brandName}
                className="h-8 w-8 rounded-full border border-[#e2d9f5] bg-[#f0ebfa] object-contain"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[#e2d9f5] bg-[#f0ebfa]">
                <span className="text-[9px] font-bold text-[#FF7272]">
                  {brandName.slice(0, 3).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="text-[11px] leading-none text-[#8b7aa0]">Brand</p>
              <p className="text-[13px] font-semibold text-[#2e054e]">
                {brandName}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] leading-none text-[#8b7aa0]">Price</p>
            <p className="text-[17px] font-bold tracking-tight text-[#2e054e]">
              {typeof price === 'number' ? `${formatPrice(price)}` : price}
            </p>
          </div>
        </div>

        {/* Divider + CTA */}
        <div className="flex gap-2 border-t border-[#ede8f5] pt-3">
          <button
            onClick={handleLike}
            className="flex-1 rounded-xl border border-[#c9a8e0] py-2 text-[12px] font-semibold text-[#FF7272] transition-colors duration-200 hover:bg-[#f7f3ff]"
          >
            {liked ? 'Saved ✓' : 'Save'}
          </button>
          <button
            onClick={() =>
              navigate(`/vehicle-details?vehicle_id=${vehicleData?.vehicle_id}`)
            }
            className="flex-1 rounded-xl bg-[#FF7272] py-2 text-[12px] font-semibold text-white shadow-[0_2px_12px_rgba(46,5,78,0.25)] transition-all duration-200 hover:bg-[#4a0e7a] active:scale-[0.98]"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Subtle inner glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[#e8ddf7]/60 ring-inset" />
    </motion.div>
  );
};

export default CarCard;
