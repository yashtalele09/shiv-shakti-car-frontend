import { ChevronRight, Eye, Mail } from 'lucide-react';

interface Listing {
  id: string;
  image: string;
  name: string;
  variant: string;
  price: string;
  views: number;
  enquiries: number;
  status: string;
}

interface Props {
  listing: Listing;
  hasBorder: boolean;
}

const ListingRow = ({ listing, hasBorder }: Props) => {
  return (
    <div
      className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center ${
        hasBorder ? 'border-b border-slate-100' : ''
      }`}
    >
      {/* Car image */}

      <img
        src={listing.image}
        alt={listing.name}
        loading="lazy"
        className="h-20 w-full rounded-xl object-cover sm:w-28"
      />

      {/* Car details */}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="truncate text-sm font-bold text-slate-900">
            {listing.name}
          </h4>

          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
            {listing.status}
          </span>
        </div>

        <p className="mt-1 text-xs text-slate-400">{listing.variant}</p>

        <p className="mt-2 text-sm font-bold text-slate-900">{listing.price}</p>
      </div>

      {/* Analytics */}

      <div className="flex items-center gap-5 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
        <div>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            {listing.views}
          </div>

          <p className="mt-0.5 text-[10px] text-slate-400">Views</p>
        </div>

        <div>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            {listing.enquiries}
          </div>

          <p className="mt-0.5 text-[10px] text-slate-400">Enquiries</p>
        </div>

        <button
          aria-label={`Open ${listing.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-50"
        >
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
};

export default ListingRow;
