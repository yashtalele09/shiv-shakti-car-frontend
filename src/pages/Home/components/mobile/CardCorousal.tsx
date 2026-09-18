import { useNavigate } from 'react-router-dom';
import CarCard from './CarCard';

const ViewAllCard = ({ selectedType }: { selectedType?: string }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    const query = selectedType
      ? `?type=${encodeURIComponent(selectedType)}`
      : '';
    navigate(`/vehicle${query}`);
  };

  return (
    <button
      onClick={handleRedirect}
      className="group relative w-36 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border-0 p-0"
      style={{
        background:
          'linear-gradient(145deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
        boxShadow:
          '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
        minHeight: '200px',
      }}
    >
      {/* Animated background mesh */}
      <div
        className="absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-35"
        style={{
          background:
            'radial-gradient(ellipse at 20% 20%, #e63946 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, #f4a261 0%, transparent 60%)',
        }}
      />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Glowing orb that moves on hover */}
      <div
        className="absolute h-24 w-24 rounded-full opacity-0 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-40"
        style={{
          background: '#e63946',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-3 py-6"
        style={{ minHeight: '200px' }}
      >
        {/* Icon circle */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
          style={{
            background: 'linear-gradient(135deg, #e63946, #f4a261)',
            boxShadow: '0 4px 16px rgba(230, 57, 70, 0.5)',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <p
            className="text-sm leading-tight font-bold tracking-wide text-white"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            View All
          </p>
          {selectedType && (
            <p
              className="mt-0.5 text-xs font-medium capitalize"
              style={{ color: '#f4a261' }}
            >
              {selectedType}
            </p>
          )}
          <p className="mt-1 text-[10px] leading-tight text-gray-400">
            Explore full
            <br />
            inventory
          </p>
        </div>

        {/* Bottom animated dash */}
        <div className="mt-1 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-0.5 rounded-full transition-all duration-300 group-hover:w-4"
              style={{
                width: i === 1 ? '16px' : '6px',
                background:
                  i === 1
                    ? 'linear-gradient(90deg, #e63946, #f4a261)'
                    : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom shimmer line */}
      <div
        className="absolute right-0 bottom-0 left-0 h-0.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(90deg, transparent, #e63946, #f4a261, transparent)',
        }}
      />
    </button>
  );
};

const CardCarousel = ({ vehicles, selectedType }: any) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹ ${price.toLocaleString('en-IN')}`;
    }
  };

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 py-10">
        <div className="relative">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </div>
          <span className="absolute -top-1 -right-1 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
            0
          </span>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-gray-700">
            No Vehicles Available
          </p>
          <p className="mt-1 text-sm text-gray-400">
            {selectedType
              ? `No ${selectedType} vehicles found right now.`
              : 'No vehicles match your current filters.'}
          </p>
        </div>
        <div className="mt-1 flex gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 w-24 animate-pulse rounded-xl border border-dashed border-gray-200 bg-gray-100"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-3">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {vehicles.slice(0, 4).map((car: any) => (
          <CarCard
            key={car.vehicle_id}
            vehicle_id={car.vehicle_id}
            title={`${car.vehicle_brand} ${car.vehicle_model}`}
            price={formatPrice(car.vehicle_price)}
            fuel={car.fuel_type}
            transmission={car.transmission_type}
            km={`${car.kilometers_driven} KM`}
            year={car.registration_year}
            media={car.vehicle_images_video || []}
          />
        ))}

        {/* View All end card */}
        <ViewAllCard selectedType={selectedType} />
      </div>
    </div>
  );
};

export default CardCarousel;
