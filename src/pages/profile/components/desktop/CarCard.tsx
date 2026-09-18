import { motion } from 'framer-motion';
import { Bookmark, MapPin } from 'lucide-react';

interface Car {
  id: string;
  image: string;
  name: string;
  variant: string;
  price: string;
  location: string;
  km: string;
}

interface Props {
  car: Car;
}

const CarCard = ({ car }: Props) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <button
          aria-label={`Save ${car.name}`}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition hover:bg-white"
        >
          <Bookmark className="h-4 w-4 text-slate-600" />
        </button>

        <div className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
          Recently viewed
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <h4 className="truncate text-sm font-bold text-slate-900">
          {car.name}
        </h4>

        <p className="mt-1 truncate text-xs text-slate-400">{car.variant}</p>

        <p className="mt-3 text-base font-bold text-slate-900">{car.price}</p>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-[11px] text-slate-400">{car.km}</span>

          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <MapPin className="h-3 w-3" />
            {car.location}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
