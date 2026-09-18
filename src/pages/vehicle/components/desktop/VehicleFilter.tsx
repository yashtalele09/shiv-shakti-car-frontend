import { X, ChevronDown, ArrowUpDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VehicleDataT } from '../../../../typs/vehicle/get';

interface VehicleFilterBarProps {
  selectedFilters: string[];
  onRemove: (filter: string) => void;
  onSelect: (filter: string) => void;
  vehicleData?: VehicleDataT[];
  resultCount?: number;
  sortValue?: string;
  onSortChange?: (value: string) => void;
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'year_new', label: 'Newest First' },
  { value: 'km_low', label: 'Kilometers: Low to High' },
];

// Single accent color used throughout the bar (was red-500 / #FF7272).
const ACCENT = '#1B2F4B';
const ACCENT_TINT = '#EAEEF3'; // light background tint derived from ACCENT
const ACCENT_BORDER = '#C7D0DB'; // light border tint derived from ACCENT

const VehicleFilterBar = ({
  selectedFilters,
  onRemove,
  onSelect,
  vehicleData,
  resultCount,
  sortValue = 'relevance',
  onSortChange,
}: VehicleFilterBarProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filterOptions: Record<string, string[]> = {
    Name: [...new Set(vehicleData?.map((v) => v.vehicle_model))],
    Brand: [...new Set(vehicleData?.map((v) => v.vehicle_brand))],
    Color: [...new Set(vehicleData?.map((v) => v.vehicle_color))],
    Transmission: [...new Set(vehicleData?.map((v) => v.transmission_type))],
    Variant: [...new Set(vehicleData?.map((v) => v.body_type))],
  };

  // Close any open dropdown on outside click — desktop dropdowns are
  // simple relatively-positioned panels, no portal/reposition math needed
  // since the bar itself doesn't scroll horizontally at this width.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
        setSortOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleItem = (item: string) => {
    if (selectedFilters.includes(item)) {
      onRemove(item);
    } else {
      onSelect(item);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="relative flex flex-col gap-3 rounded-2xl border border-[#ede8f5] bg-white px-5 py-4 shadow-[0_4px_18px_rgba(46,5,78,0.06)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Quick filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {Object.keys(filterOptions).map((key) => (
            <div key={key} className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown((prev) => (prev === key ? null : key));
                  setSortOpen(false);
                }}
                style={
                  openDropdown === key
                    ? {
                        borderColor: ACCENT,
                        backgroundColor: ACCENT_TINT,
                        color: ACCENT,
                        padding: '7px 14px',
                      }
                    : { padding: '7px 14px' }
                }
                onMouseEnter={(e) => {
                  if (openDropdown !== key) {
                    e.currentTarget.style.borderColor = ACCENT;
                    e.currentTarget.style.color = ACCENT;
                  }
                }}
                onMouseLeave={(e) => {
                  if (openDropdown !== key) {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.color = '';
                  }
                }}
                className={`flex items-center gap-1.5 rounded-full border text-[13px] font-medium transition-all duration-200 ${
                  openDropdown === key
                    ? ''
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                {key}
                <motion.span
                  animate={{ rotate: openDropdown === key ? 180 : 0 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex"
                >
                  <ChevronDown size={12} />
                </motion.span>
              </button>

              <AnimatePresence>
                {openDropdown === key && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="absolute top-full left-0 z-30 mt-2 max-h-64 w-56 overflow-y-auto rounded-xl border border-gray-100 bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
                  >
                    {filterOptions[key].map((item, i) => {
                      const checked = selectedFilters.includes(item);
                      return (
                        <motion.label
                          key={item}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.02 }}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleItem(item);
                          }}
                          className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50"
                        >
                          <span
                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-150"
                            style={{
                              borderColor: checked ? ACCENT : '#d1d5db',
                              backgroundColor: checked ? ACCENT : 'transparent',
                            }}
                          >
                            {checked && (
                              <Check
                                size={11}
                                strokeWidth={3}
                                className="text-white"
                              />
                            )}
                          </span>
                          <span style={checked ? { color: ACCENT } : undefined}>
                            {item}
                          </span>
                        </motion.label>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Result count + sort — desktop has room for these inline, unlike the mobile bar */}
        <div className="flex items-center gap-4">
          {typeof resultCount === 'number' && (
            <span className="text-[13px] text-gray-500">
              <strong className="text-[#2e054e]">{resultCount}</strong> vehicles
            </span>
          )}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSortOpen((prev) => !prev);
                setOpenDropdown(null);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ACCENT;
                e.currentTarget.style.color = ACCENT;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.color = '';
              }}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-[7px] text-[13px] font-medium text-gray-600"
            >
              <ArrowUpDown size={12} />
              Sort:{' '}
              <span className="font-semibold">
                {SORT_OPTIONS.find((o) => o.value === sortValue)?.label ??
                  'Relevance'}
              </span>
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute top-full right-0 z-30 mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
                >
                  {SORT_OPTIONS.map((opt) => {
                    const active = sortValue === opt.value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => {
                          onSortChange?.(opt.value);
                          setSortOpen(false);
                        }}
                        style={
                          active
                            ? { backgroundColor: ACCENT_TINT, color: ACCENT }
                            : undefined
                        }
                        className="cursor-pointer px-3.5 py-2.5 text-[13px] font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50"
                      >
                        {opt.label}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Selected tags */}
      <AnimatePresence>
        {selectedFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3"
          >
            {selectedFilters.map((filter) => (
              <motion.div
                key={filter}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ duration: 0.18 }}
                style={{
                  borderColor: ACCENT_BORDER,
                  backgroundColor: ACCENT_TINT,
                  color: ACCENT,
                }}
                className="flex shrink-0 items-center gap-1.5 rounded-full border text-[12px] font-medium"
              >
                <span style={{ padding: '4px 0 4px 10px' }}>{filter}</span>
                <button
                  onClick={() => onRemove(filter)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = ACCENT;
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = ACCENT;
                  }}
                  className="flex items-center justify-center rounded-full transition-colors duration-150"
                  style={{ padding: 2, margin: '0 6px 0 0' }}
                >
                  <X size={10} strokeWidth={2.5} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleFilterBar;
