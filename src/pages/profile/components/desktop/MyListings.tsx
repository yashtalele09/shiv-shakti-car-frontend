import { Car, ChevronRight, Plus } from 'lucide-react';
import ListingRow from './ListingRows';

const listings = [
  {
    id: '1',
    image:
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
    name: 'Maruti Suzuki Baleno',
    variant: 'Alpha Petrol • 2022',
    price: '₹7.85 Lakh',
    views: 248,
    enquiries: 12,
    status: 'Active',
  },
  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    name: 'Hyundai i20',
    variant: 'Asta • 2021',
    price: '₹8.40 Lakh',
    views: 182,
    enquiries: 7,
    status: 'Active',
  },
];

const MyListings = () => {
  return (
    <section className="mt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-slate-500" />

            <h3 className="text-base font-bold text-slate-900">
              Your Listings
            </h3>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Manage the cars you're selling
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 sm:flex">
            View all
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          <button className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800">
            <Plus className="h-3.5 w-3.5" />
            Add car
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {listings.map((listing, index) => (
          <ListingRow
            key={listing.id}
            listing={listing}
            hasBorder={index !== listings.length - 1}
          />
        ))}
      </div>
    </section>
  );
};

export default MyListings;
