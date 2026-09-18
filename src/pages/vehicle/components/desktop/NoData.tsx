import { Car, SearchX, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

interface NoDataProps {
  onClear?: () => void;
  searchQuery?: string;
}

const NoData = ({ onClear, searchQuery }: NoDataProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex min-h-[520px] w-full items-center justify-center rounded-2xl border border-gray-200 bg-white"
    >
      <div className="flex max-w-md flex-col items-center px-6 text-center">
        {/* Icon */}
        <div className="relative mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#f7f3ff]">
            {searchQuery ? (
              <SearchX size={42} className="text-[#7c3aed]" />
            ) : (
              <Car size={42} className="text-[#7c3aed]" />
            )}
          </div>

          <div className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-[#FF7272]">
            <span className="text-sm font-bold text-white">0</span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold tracking-tight text-[#2e054e]">
          {searchQuery
            ? `No vehicles found for "${searchQuery}"`
            : 'No Vehicles Available'}
        </h2>

        {/* Description */}
        <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
          {searchQuery
            ? 'We could not find any vehicles matching your search. Try a different keyword or clear your filters.'
            : 'No vehicles match your current filters. Try adjusting or clearing your filters to see more vehicles.'}
        </p>

        {/* Actions */}
        {onClear && (
          <div className="mt-7 flex items-center gap-3">
            <button
              onClick={onClear}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              <SlidersHorizontal size={16} />
              Clear Filters
            </button>
          </div>
        )}

        {/* Decorative dots */}
        <div className="mt-8 flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="h-1.5 w-1.5 rounded-full bg-[#c9a8e0]"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default NoData;
