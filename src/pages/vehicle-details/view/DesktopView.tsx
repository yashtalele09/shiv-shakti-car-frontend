import { useState, useEffect } from 'react';
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

// ─── fallback images ──────────────────────────────────────────────────────────

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&q=90',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=90',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=90',
];

const DesktopVehicleDetails = () => {
  const [vehicle, setVehicle] = useState<VehicleDataSuccessT | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('vehicle_id');

  const { mutate: trackAnalytics } = useTrackAnalyticsMutation();

  const {
    mutate: fetchVehicle,
    isPending,
    isError,
  } = useGetVehicleByIdMutation({
    onSuccess: (data) => {
      if (data?.vehicleData) setVehicle(data.vehicleData);

      trackAnalytics({
        sessionId: getSessionId(),
        eventType: 'vehicle_view',
        vehicleId: data.vehicleData.vehicle_id, // or _id
      });
    },
  });

  useEffect(() => {
    if (id) fetchVehicle({ id });
  }, [id]);

  // ── derived ────────────────────────────────────────────────────────────────

  const images = vehicle?.vehicle_images_video?.length
    ? vehicle.vehicle_images_video
    : FALLBACK_IMAGES;

  const isCurrentVideo = isVideoUrl(images[imgIndex]);

  const next = () => setImgIndex((i) => (i + 1) % images.length);
  const prev = () =>
    setImgIndex((i) => (i - 1 + images.length) % images.length);

  const title = vehicle
    ? `${vehicle.vehicle_brand} ${vehicle.vehicle_model} ${vehicle.vehicle_varient}`
    : '—';

  const subtitle = vehicle
    ? `${vehicle.vehicle_color} · ${formatKm(vehicle.kilometers_driven)} · ${vehicle.vehicle_location}`
    : '';

  // ── loading / error states ─────────────────────────────────────────────────

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-[#FF7272]" />
          <p className="text-sm text-gray-400">Loading vehicle…</p>
        </div>
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <p className="text-lg font-semibold text-[#2e054e]">
            Could not load vehicle
          </p>
          <p className="text-sm text-gray-400">Please try again or go back.</p>
          <button
            onClick={() => fetchVehicle({ id: id as string })}
            className="mt-2 rounded-xl bg-[#FF7272] px-5 py-2 text-sm font-semibold text-white shadow"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const quickStats = [
    {
      icon: <Calendar size={18} />,
      label: 'Year',
      value: vehicle.registration_year,
    },
    {
      icon: <Gauge size={18} />,
      label: 'KM Driven',
      value: `${(vehicle.kilometers_driven / 1000).toFixed(0)}k km`,
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1280px] px-8 py-8">
        {/* Back link */}
        <button
          onClick={() => window.history.back()}
          className="mb-5 flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-[#FF7272]"
        >
          <ChevronLeft size={16} /> Back to listings
        </button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* ── LEFT COLUMN ── */}
          <div>
            {/* ── GALLERY ── */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="group relative h-[480px] w-full bg-black">
                {isCurrentVideo ? (
                  <video
                    key={images[imgIndex]}
                    src={images[imgIndex]}
                    controls
                    playsInline
                    className="h-full w-full object-contain"
                    poster={
                      images.find(
                        (img, i) => i !== imgIndex && !isVideoUrl(img)
                      ) ?? undefined
                    }
                  />
                ) : (
                  <img
                    src={images[imgIndex]}
                    className="h-full w-full object-cover transition-all duration-300"
                    alt={title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        FALLBACK_IMAGES[imgIndex % FALLBACK_IMAGES.length];
                    }}
                  />
                )}

                {!isCurrentVideo && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                )}

                {/* top-right actions */}
                <div className="pointer-events-none absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setLiked((v) => !v)}
                    className="pointer-events-auto rounded-full bg-black/50 p-2.5 backdrop-blur-sm transition-colors hover:bg-black/70"
                  >
                    <Heart
                      size={18}
                      className={
                        liked ? 'fill-[#FF7272] text-[#FF7272]' : 'text-white'
                      }
                    />
                  </button>
                  <button
                    onClick={() => setShareOpen(true)}
                    className="pointer-events-auto rounded-full bg-black/50 p-2.5 backdrop-blur-sm transition-colors hover:bg-black/70"
                  >
                    <Share2 size={18} className="text-white" />
                  </button>
                  {!isCurrentVideo && (
                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="pointer-events-auto rounded-full bg-black/50 p-2.5 backdrop-blur-sm transition-colors hover:bg-black/70"
                    >
                      <Maximize2 size={18} className="text-white" />
                    </button>
                  )}
                </div>

                {/* prev / next arrows — appear on hover */}
                {images.length > 1 && !isCurrentVideo && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2.5 opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={next}
                      className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2.5 opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* media count badge */}
                <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
                  {imgIndex + 1}/{images.length}
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="scrollbar-hide flex gap-2 overflow-x-auto bg-white px-4 py-4">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className={`relative h-[70px] min-w-[100px] cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                        imgIndex === i
                          ? 'scale-105 border-[#FF7272]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      {isVideoUrl(img) ? (
                        <div className="flex h-full w-full items-center justify-center bg-gray-900">
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
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── TITLE + DESCRIPTION ── */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {vehicle.isFeatured && (
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-[#FF7272]">
                    Featured
                  </span>
                )}
                <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-[#FF7272]">
                  {vehicle.body_type}
                </span>
                <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-[#FF7272]">
                  {vehicle.vehicle_type}
                </span>
              </div>

              <h1 className="mt-3 text-3xl leading-tight font-bold text-[#2e054e]">
                {title}
              </h1>
              <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                <MapPin size={14} /> {subtitle}
              </p>

              {vehicle.vehicle_description && (
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-gray-600">
                  {vehicle.vehicle_description}
                </p>
              )}
            </div>

            {/* Quick stats */}
            <div className="mt-6 grid grid-cols-4 gap-3">
              {quickStats.map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-white p-4 shadow-sm"
                >
                  <span className="text-[#FF7272]">{icon}</span>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-semibold text-[#2e054e]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Basic Details */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[#FF7272]">
                Basic Details
              </h3>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 text-sm">
                <Detail label="Brand" value={vehicle.vehicle_brand} />
                <Detail label="Model" value={vehicle.vehicle_model} />
                <Detail label="Variant" value={vehicle.vehicle_varient} />
                <Detail label="Color" value={vehicle.vehicle_color} />
                <Detail label="Year" value={vehicle.registration_year} />
                <Detail
                  label="Km Driven"
                  value={formatKm(vehicle.kilometers_driven)}
                />
                <Detail label="Fuel" value={vehicle.fuel_type} />
                <Detail
                  label="Transmission"
                  value={vehicle.transmission_type}
                />
                <Detail label="Body Type" value={vehicle.body_type} />
                <Detail label="Location" value={vehicle.vehicle_location} />
              </div>
            </div>

            {/* Insurance */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-[#FF7272]">
                Insurance & Ownership
              </h3>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 text-sm">
                <Detail
                  label="Insurance Valid Till"
                  value={formatDate(vehicle.insurance_validity)}
                  icon={<Shield size={13} className="text-green-500" />}
                />
                <Detail
                  label="Vehicle Type"
                  value={vehicle.vehicle_type}
                  icon={<User size={13} className="text-blue-400" />}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — sticky sidebar ── */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-xs text-gray-400 uppercase">Price</p>
              <h3 className="mt-1 text-3xl font-bold text-[#FF7272]">
                {formatPrice(vehicle.vehicle_price)}
              </h3>

              <button
                onClick={() => setContactOpen(true)}
                className="mt-5 w-full rounded-xl bg-[#FF7272] py-3 font-semibold text-white shadow-md transition-colors hover:bg-[#ff5c5c]"
              >
                Contact Seller
              </button>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3">
                <CheckCircle2 size={18} className="text-green-500" />
                <p className="text-sm font-medium text-green-700">
                  Available for purchase
                </p>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="mb-3 text-xs font-medium text-gray-400 uppercase">
                  At a glance
                </p>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Brand</span>
                    <span className="font-medium text-[#2e054e]">
                      {vehicle.vehicle_brand}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Year</span>
                    <span className="font-medium text-[#2e054e]">
                      {vehicle.registration_year}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Location</span>
                    <span className="font-medium text-[#2e054e]">
                      {vehicle.vehicle_location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
};

const Detail = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) => (
  <div>
    <p className="text-gray-400">{label}</p>
    <p className="mt-0.5 flex items-center gap-1 font-medium text-[#2e054e]">
      {icon}
      {value}
    </p>
  </div>
);

export default DesktopVehicleDetails;
