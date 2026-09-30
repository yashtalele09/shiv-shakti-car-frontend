import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Maximize2,
  Heart,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  Shield,
  User,
  CheckCircle2,
  Play,
  Phone,
  Car,
  Palette,
  Tag,
  Layers,
  Calculator,
  Star,
} from 'lucide-react';
import useGetVehicleByIdMutation from '../hooks/GetVehicleById';
import { useSearchParams } from 'react-router-dom';
import ImageLightbox from '../components/mobile/ImagelightBox';
import ShareSheet from '../components/desktop/Sharesheet';
import ContactPanel from '../components/desktop/Contactpanel';
import {
  formatKm,
  isVideoUrl,
  formatPrice,
  formatDate,
} from '../../../helper/format';
import type { VehicleDataSuccessT } from '../../../typs/vehicle-details/get';
import { useTrackAnalyticsMutation } from '../../../hooks/useAnalyticsMutation';
import { getSessionId } from '../../../utils/session';

// ─── constants ────────────────────────────────────────────────────────────────

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&q=90',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=90',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=90',
];

const EMI_INTEREST = 9.5; // % per annum (indicative)
const EMI_DOWN_PAYMENT = 0.2; // 20%
const EMI_TENURES = [1, 2, 3, 4, 5, 7];

const calcEmi = (principal: number, years: number) => {
  const r = EMI_INTEREST / 12 / 100;
  const n = years * 12;
  if (principal <= 0) return 0;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

// ─── badges (same as CarCard) ─────────────────────────────────────────────────

const FeaturedRibbon = () => (
  <div className="relative flex items-center gap-1 overflow-hidden rounded-r-full bg-gradient-to-r from-[#C9972D] via-[#B8841F] to-[#A97A1F] py-1.5 pr-4 pl-3.5 text-[11px] font-bold tracking-wide text-white uppercase shadow-[0_4px_14px_rgba(169,122,31,0.45)]">
    <Star size={12} className="fill-white text-white" strokeWidth={0} />
    <span>Featured</span>
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
    <span
      aria-hidden
      className="absolute -bottom-1.5 left-0 h-1.5 w-2 bg-[#6E4E13]/70"
      style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
    />
  </div>
);

const VerifiedSeal = () => (
  <div className="flex items-center gap-1.5 rounded-full bg-white/95 py-1 pr-3 pl-1 shadow-[0_2px_10px_rgba(15,23,42,0.14)] ring-1 ring-[#E7EBF1] backdrop-blur-sm">
    <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#1B2F4B] to-[#0F1F35]">
      <Shield size={10} className="fill-white text-white" strokeWidth={0} />
    </span>
    <span className="text-[11px] font-semibold text-[#1A2233]">Verified</span>
  </div>
);

// ─── page ─────────────────────────────────────────────────────────────────────

const DesktopVehicleDetails = () => {
  const [vehicle, setVehicle] = useState<VehicleDataSuccessT | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [tenure, setTenure] = useState(5);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('vehicle_id');

  const { mutate: trackAnalytics } = useTrackAnalyticsMutation();

  const {
    mutate: fetchVehicle,
    isPending,
    isError,
  } = useGetVehicleByIdMutation({
    onSuccess: (data) => {
      if (!data?.vehicleData) return;
      setVehicle(data.vehicleData);

      trackAnalytics({
        sessionId: getSessionId(),
        eventType: 'vehicle_view',
        vehicleId: data.vehicleData.vehicle_id, // or _id
      });
    },
  });

  useEffect(() => {
    if (id) {
      setImgIndex(0);
      fetchVehicle({ id });
    }
  }, [id]);

  // ── derived ────────────────────────────────────────────────────────────────

  const images = useMemo(
    () =>
      vehicle?.vehicle_images_video?.length
        ? vehicle.vehicle_images_video
        : FALLBACK_IMAGES,
    [vehicle]
  );

  const isCurrentVideo = isVideoUrl(images[imgIndex]);

  const next = () => setImgIndex((i) => (i + 1) % images.length);
  const prev = () =>
    setImgIndex((i) => (i - 1 + images.length) % images.length);

  // Keyboard navigation for the gallery (disabled while lightbox is open)
  useEffect(() => {
    if (lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') {
        setImgIndex((i) => (i + 1) % images.length);
      } else if (e.key === 'ArrowLeft') {
        setImgIndex((i) => (i - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, lightboxOpen]);

  const title = vehicle
    ? `${vehicle.vehicle_brand} ${vehicle.vehicle_model} ${vehicle.vehicle_varient}`
    : '—';

  // ── loading / error states ─────────────────────────────────────────────────

  if (isPending) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#F8FAFC]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E7EBF1] border-t-[#1B2F4B]" />
          <p className="text-sm text-[#64748B]">Loading vehicle…</p>
        </div>
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#F8FAFC]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F4F8]">
            <Car size={28} className="text-[#AEB9C7]" />
          </div>
          <p className="text-lg font-semibold text-[#1A2233]">
            Could not load vehicle
          </p>
          <p className="text-sm text-[#64748B]">Please try again or go back.</p>
          <div className="mt-2 flex gap-3">
            <button
              onClick={() => window.history.back()}
              className="rounded-xl border border-[#1B2F4B] px-5 py-2 text-sm font-semibold text-[#1B2F4B] transition-colors hover:bg-[#F1F4F8]"
            >
              Go back
            </button>
            <button
              onClick={() => id && fetchVehicle({ id })}
              className="rounded-xl bg-[#1B2F4B] px-5 py-2 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(15,23,42,0.25)] transition-colors hover:bg-[#0F1F35]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const price = Number(vehicle.vehicle_price) || 0;
  const downPayment = Math.round(price * EMI_DOWN_PAYMENT);
  const emi = Math.round(calcEmi(price - downPayment, tenure));

  const quickStats = [
    {
      icon: <Calendar size={18} />,
      label: 'Year',
      value: vehicle.registration_year,
    },
    {
      icon: <Gauge size={18} />,
      label: 'KM Driven',
      value: formatKm(vehicle.kilometers_driven),
    },
    {
      icon: <Fuel size={18} />,
      label: 'Fuel',
      value: vehicle.fuel_type,
    },
    {
      icon: <Settings2 size={18} />,
      label: 'Transmission',
      value: vehicle.transmission_type === 'Manual' ? 'Manual' : 'Automatic',
    },
  ];

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#F8FAFC]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-8 pt-5 pb-16">
        {/* Breadcrumb / back */}
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 text-sm font-medium text-[#64748B] transition-colors hover:text-[#1B2F4B]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E7EBF1] bg-white shadow-sm transition-colors group-hover:bg-[#F1F4F8]">
              <ChevronLeft size={16} />
            </span>
            Back to listings
          </button>

          <p className="text-xs text-[#8592A3]">
            Listings <span className="mx-1">/</span> {vehicle.vehicle_brand}
            <span className="mx-1">/</span>
            <span className="font-semibold text-[#1A2233]">
              {vehicle.vehicle_model}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          {/* ── LEFT COLUMN ── */}
          <div className="flex min-w-0 flex-col gap-6">
            {/* ── GALLERY ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden rounded-2xl border border-[#E7EBF1] bg-white shadow-[0_8px_32px_rgba(15,23,42,0.08)]"
            >
              <div className="group relative h-[520px] w-full bg-[#F1F4F8]">
                {isCurrentVideo ? (
                  <video
                    key={images[imgIndex]}
                    src={images[imgIndex]}
                    controls
                    playsInline
                    className="h-full w-full bg-black object-contain"
                    poster={
                      images.find(
                        (img, i) => i !== imgIndex && !isVideoUrl(img)
                      ) ?? undefined
                    }
                  />
                ) : (
                  <motion.img
                    key={images[imgIndex]}
                    src={images[imgIndex]}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.38, ease: 'easeInOut' }}
                    className="h-full w-full object-cover"
                    alt={title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        FALLBACK_IMAGES[imgIndex % FALLBACK_IMAGES.length];
                    }}
                  />
                )}

                {!isCurrentVideo && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F1F35]/45 via-transparent to-transparent" />
                )}

                {/* top-left badge stack */}
                <div className="pointer-events-none absolute top-4 left-0 z-20 flex flex-col items-start gap-2">
                  {vehicle.isFeatured && <FeaturedRibbon />}
                  <div className="ml-4">
                    <VerifiedSeal />
                  </div>
                </div>

                {/* top-right actions */}
                <div className="pointer-events-none absolute top-4 right-4 z-20 flex gap-2">
                  <button
                    onClick={() => setLiked((v) => !v)}
                    aria-label="Save vehicle"
                    className="pointer-events-auto rounded-full bg-white/90 p-2.5 shadow-sm backdrop-blur-sm transition hover:bg-white"
                  >
                    <Heart
                      size={18}
                      className={`transition-all duration-300 ${
                        liked
                          ? 'fill-[#C9972D] text-[#C9972D]'
                          : 'text-[#AEB9C7]'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => setShareOpen(true)}
                    aria-label="Share vehicle"
                    className="pointer-events-auto rounded-full bg-white/90 p-2.5 shadow-sm backdrop-blur-sm transition hover:bg-white"
                  >
                    <Share2 size={18} className="text-[#1B2F4B]" />
                  </button>
                  {!isCurrentVideo && (
                    <button
                      onClick={() => setLightboxOpen(true)}
                      aria-label="Fullscreen"
                      className="pointer-events-auto rounded-full bg-white/90 p-2.5 shadow-sm backdrop-blur-sm transition hover:bg-white"
                    >
                      <Maximize2 size={18} className="text-[#1B2F4B]" />
                    </button>
                  )}
                </div>

                {/* prev / next arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      aria-label="Previous"
                      className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/85 p-2.5 opacity-0 shadow backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:scale-105 hover:bg-white"
                    >
                      <ChevronLeft size={20} className="text-[#1A2233]" />
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next"
                      className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/85 p-2.5 opacity-0 shadow backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:scale-105 hover:bg-white"
                    >
                      <ChevronRight size={20} className="text-[#1A2233]" />
                    </button>

                    {/* dot indicators */}
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                      {images.slice(0, 12).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIndex(i)}
                          aria-label={`Go to media ${i + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === imgIndex
                              ? 'w-5 bg-white'
                              : 'w-1.5 bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* counter */}
                <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-[#0F1F35]/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {imgIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="scrollbar-hide flex gap-3 overflow-x-auto border-t border-[#E7EBF1] bg-white px-5 py-4">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className={`relative h-[72px] min-w-[104px] cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                        imgIndex === i
                          ? 'border-[#1B2F4B] shadow-[0_4px_12px_rgba(27,47,75,0.25)]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      {isVideoUrl(img) ? (
                        <div className="flex h-full w-full items-center justify-center bg-[#0F1F35]">
                          <Play size={20} className="fill-white text-white" />
                        </div>
                      ) : (
                        <img
                          src={img}
                          className="h-full w-full object-cover"
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                          }}
                        />
                      )}
                      {isVideoUrl(img) && (
                        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] font-semibold text-white">
                          VIDEO
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ── TITLE + DESCRIPTION ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-2xl border border-[#E7EBF1] bg-white p-8 shadow-[0_8px_32px_rgba(15,23,42,0.06)]"
            >
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#1B2F4B] px-3 py-1 text-xs font-semibold text-white">
                  {vehicle.body_type}
                </span>
                <span className="rounded-full bg-[#F1F4F8] px-3 py-1 text-xs font-semibold text-[#334155]">
                  {vehicle.vehicle_type}
                </span>
                <span className="rounded-full bg-[#F1F4F8] px-3 py-1 text-xs font-semibold text-[#334155]">
                  {vehicle.fuel_type}
                </span>
              </div>

              <h1 className="mt-4 text-4xl leading-tight font-bold tracking-[-0.5px] text-[#1A2233]">
                {title}
              </h1>

              <p className="mt-2 flex items-center gap-1.5 text-sm text-[#64748B]">
                <MapPin size={15} className="text-[#1B2F4B]" />
                {vehicle.vehicle_location}
                <span className="mx-1 text-[#AEB9C7]">•</span>
                {vehicle.vehicle_color}
                <span className="mx-1 text-[#AEB9C7]">•</span>
                {formatKm(vehicle.kilometers_driven)}
              </p>

              {vehicle.vehicle_description && (
                <div className="mt-6 border-t border-[#E7EBF1] pt-6">
                  <h2 className="mb-2 text-xs font-semibold tracking-wider text-[#8592A3] uppercase">
                    About this car
                  </h2>
                  <p className="max-w-3xl text-[15px] leading-relaxed text-[#334155]">
                    {vehicle.vehicle_description}
                  </p>
                </div>
              )}
            </motion.div>

            {/* ── QUICK STATS ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-4 gap-4"
            >
              {quickStats.map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-[#E7EBF1] bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F1F4F8] text-[#1B2F4B] transition-colors group-hover:bg-[#1B2F4B] group-hover:text-white">
                    {icon}
                  </span>
                  <p className="text-xs text-[#64748B]">{label}</p>
                  <p className="text-sm font-bold text-[#1A2233]">{value}</p>
                </div>
              ))}
            </motion.div>

            {/* ── SPECIFICATIONS ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="rounded-2xl border border-[#E7EBF1] bg-white p-8 shadow-[0_8px_32px_rgba(15,23,42,0.06)]"
            >
              <SectionTitle>Specifications</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                <Detail
                  label="Brand"
                  value={vehicle.vehicle_brand}
                  icon={<Tag size={14} />}
                />
                <Detail
                  label="Model"
                  value={vehicle.vehicle_model}
                  icon={<Car size={14} />}
                />
                <Detail
                  label="Variant"
                  value={vehicle.vehicle_varient}
                  icon={<Layers size={14} />}
                />
                <Detail
                  label="Color"
                  value={vehicle.vehicle_color}
                  icon={<Palette size={14} />}
                />
                <Detail
                  label="Year"
                  value={vehicle.registration_year}
                  icon={<Calendar size={14} />}
                />
                <Detail
                  label="Km Driven"
                  value={formatKm(vehicle.kilometers_driven)}
                  icon={<Gauge size={14} />}
                />
                <Detail
                  label="Fuel"
                  value={vehicle.fuel_type}
                  icon={<Fuel size={14} />}
                />
                <Detail
                  label="Transmission"
                  value={vehicle.transmission_type}
                  icon={<Settings2 size={14} />}
                />
                <Detail
                  label="Body Type"
                  value={vehicle.body_type}
                  icon={<Car size={14} />}
                />
                <Detail
                  label="Location"
                  value={vehicle.vehicle_location}
                  icon={<MapPin size={14} />}
                />
              </div>
            </motion.div>

            {/* ── INSURANCE ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl border border-[#E7EBF1] bg-white p-8 shadow-[0_8px_32px_rgba(15,23,42,0.06)]"
            >
              <SectionTitle>Insurance & Ownership</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                <Detail
                  label="Insurance Valid Till"
                  value={formatDate(vehicle.insurance_validity)}
                  icon={<Shield size={14} />}
                />
                <Detail
                  label="Vehicle Type"
                  value={vehicle.vehicle_type}
                  icon={<User size={14} />}
                />
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — sticky sidebar ── */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col gap-5"
            >
              {/* Price card */}
              <div className="overflow-hidden rounded-2xl border border-[#E7EBF1] bg-white shadow-[0_8px_32px_rgba(15,23,42,0.10)]">
                <div className="bg-gradient-to-br from-[#1B2F4B] to-[#0F1F35] px-7 pt-6 pb-7 text-white">
                  <p className="text-xs font-medium tracking-wider text-[#AEB9C7] uppercase">
                    Asking Price
                  </p>
                  <h3 className="mt-1 text-4xl font-bold tracking-tight">
                    {formatPrice(vehicle.vehicle_price)}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#AEB9C7]">
                    {vehicle.registration_year} · {vehicle.fuel_type} ·{' '}
                    {formatKm(vehicle.kilometers_driven)}
                  </p>
                </div>

                <div className="p-7">
                  <button
                    onClick={() => setContactOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B2F4B] py-3.5 font-semibold text-white shadow-[0_2px_12px_rgba(15,23,42,0.25)] transition-all duration-200 hover:bg-[#0F1F35] active:scale-[0.98]"
                  >
                    <Phone size={17} /> Contact Seller
                  </button>

                  <button
                    onClick={() => setShareOpen(true)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#1B2F4B] py-3 text-sm font-semibold text-[#1B2F4B] transition-colors duration-200 hover:bg-[#F1F4F8]"
                  >
                    <Share2 size={16} /> Share this car
                  </button>

                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3">
                    <CheckCircle2 size={18} className="text-green-500" />
                    <p className="text-sm font-medium text-green-700">
                      Available for purchase
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#E7EBF1] pt-5">
                    <p className="mb-3 text-xs font-semibold tracking-wider text-[#8592A3] uppercase">
                      At a glance
                    </p>
                    <div className="flex flex-col gap-3 text-sm">
                      <GlanceRow label="Brand" value={vehicle.vehicle_brand} />
                      <GlanceRow label="Model" value={vehicle.vehicle_model} />
                      <GlanceRow
                        label="Year"
                        value={vehicle.registration_year}
                      />
                      <GlanceRow
                        label="Location"
                        value={vehicle.vehicle_location}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* EMI estimator */}
              <div className="rounded-2xl border border-[#E7EBF1] bg-white p-7 shadow-[0_8px_32px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F4F8] text-[#1B2F4B]">
                    <Calculator size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#1A2233]">
                      EMI Estimate
                    </p>
                    <p className="text-[11px] text-[#64748B]">
                      {EMI_DOWN_PAYMENT * 100}% down · {EMI_INTEREST}% p.a.
                      (indicative)
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {EMI_TENURES.map((y) => (
                    <button
                      key={y}
                      onClick={() => setTenure(y)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        tenure === y
                          ? 'bg-[#1B2F4B] text-white shadow-[0_2px_8px_rgba(15,23,42,0.25)]'
                          : 'bg-[#F1F4F8] text-[#334155] hover:bg-[#E7EBF1]'
                      }`}
                    >
                      {y} {y === 1 ? 'yr' : 'yrs'}
                    </button>
                  ))}
                </div>

                <div className="mt-5 rounded-xl bg-[#F8FAFC] p-4 ring-1 ring-[#E7EBF1]">
                  <p className="text-xs text-[#64748B]">Monthly EMI</p>
                  <p className="mt-0.5 text-2xl font-bold tracking-tight text-[#1A2233]">
                    {formatPrice(emi)}
                    <span className="ml-1 text-xs font-medium text-[#8592A3]">
                      / month
                    </span>
                  </p>
                  <div className="mt-3 flex justify-between border-t border-[#E7EBF1] pt-3 text-xs">
                    <span className="text-[#64748B]">Down payment</span>
                    <span className="font-semibold text-[#1A2233]">
                      {formatPrice(downPayment)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 rounded-2xl border border-[#E7EBF1] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1B2F4B] to-[#0F1F35]">
                    <Shield
                      size={14}
                      className="fill-white text-white"
                      strokeWidth={0}
                    />
                  </span>
                  <p className="text-xs leading-tight font-semibold text-[#1A2233]">
                    Verified Listing
                  </p>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl border border-[#E7EBF1] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C9972D] to-[#A97A1F]">
                    <Star
                      size={14}
                      className="fill-white text-white"
                      strokeWidth={0}
                    />
                  </span>
                  <p className="text-xs leading-tight font-semibold text-[#1A2233]">
                    Quality Checked
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX — only for images ── */}
      {lightboxOpen && !isCurrentVideo && (
        <ImageLightbox
          images={images.filter((img) => !isVideoUrl(img))}
          initialIndex={images
            .filter((img) => !isVideoUrl(img))
            .indexOf(images[imgIndex])}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          altPrefix={title}
        />
      )}

      {/* ── SHARE SHEET ── */}
      <ShareSheet
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        url={window.location.href}
        title={title}
      />

      {/* ── CONTACT PANEL ── */}
      <ContactPanel
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        title={title}
        email={'shivshakti@gmail.com'}
        mobileNumber={'7093030403'}
        whatsappNumber={'7093030403'}
      />
    </motion.div>
  );
};

// ─── small building blocks ────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-5 flex items-center gap-3">
    <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-[#C9972D] to-[#A97A1F]" />
    <h3 className="text-lg font-bold tracking-[-0.2px] text-[#1A2233]">
      {children}
    </h3>
  </div>
);

const Detail = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) => (
  <div className="rounded-xl border border-transparent bg-[#F8FAFC] px-4 py-3.5 transition-colors hover:border-[#E7EBF1] hover:bg-[#F1F4F8]">
    <p className="flex items-center gap-1.5 text-xs text-[#64748B]">
      {icon && <span className="text-[#1B2F4B]">{icon}</span>}
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-[#1A2233]">{value}</p>
  </div>
);

const GlanceRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-[#64748B]">{label}</span>
    <span className="font-semibold text-[#1A2233]">{value}</span>
  </div>
);

export default DesktopVehicleDetails;
