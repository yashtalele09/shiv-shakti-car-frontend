import { ChevronRight, Clock3 } from 'lucide-react';
import CarCard from './CarCard';

const recentlyViewed = [
  {
    id: '1',
    image:
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
    name: 'Honda City',
    variant: 'ZX CVT • 2022',
    price: '₹11.25 Lakh',
    location: 'Pune',
    km: '28,500 km',
  },
  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
    name: 'Hyundai Creta',
    variant: 'SX Petrol • 2021',
    price: '₹12.80 Lakh',
    location: 'Mumbai',
    km: '34,200 km',
  },
  {
    id: '3',
    image:
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80',
    name: 'Toyota Fortuner',
    variant: '4x4 AT • 2020',
    price: '₹28.50 Lakh',
    location: 'Nashik',
    km: '48,600 km',
  },
];

const RecentlyViewed = () => {
  return (
    <section className="mt-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-slate-500" />

            <h3 className="text-base font-bold text-slate-900">
              Recently Viewed
            </h3>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Pick up where you left off
          </p>
        </div>

        <button className="flex items-center gap-1 text-xs font-bold text-slate-600 transition hover:text-slate-900">
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recentlyViewed.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
