import { X, ChevronDown, SlidersHorizontal, ListFilter } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { VehicleDataT } from '../../../typs/vehicle/get';

interface VehicleFilterProps {
  onOpen: () => void;
  selectedFilters: string[];
  onRemove: (filter: string) => void;
  onSelect: (filter: string) => void;
  vehicleData?: VehicleDataT[];
}

const VehicleFilter = ({
  onOpen,
  selectedFilters,
  onRemove,
  onSelect,
  vehicleData,
}: VehicleFilterProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const filterOptions: Record<string, string[]> = {
    Name: [...new Set(vehicleData?.map((v) => v.vehicle_model))],
    Brand: [...new Set(vehicleData?.map((v) => v.vehicle_brand))],
    Color: [...new Set(vehicleData?.map((v) => v.vehicle_color))],
    Transmission: [...new Set(vehicleData?.map((v) => v.transmission_type))],
    Variant: [...new Set(vehicleData?.map((v) => v.body_type))],
  };

  // Scroll detection for FAB
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Reposition open dropdown on scroll (horizontal scroll of chip bar)
  useEffect(() => {
    if (!openDropdown) return;
    const el = buttonRefs.current[openDropdown];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let left = rect.left;
    // Clamp to viewport
    const panelWidth = 176;
    if (left + panelWidth > window.innerWidth - 8) {
      left = window.innerWidth - panelWidth - 8;
    }
    setDropdownPos({ top: rect.bottom + 6, left, width: panelWidth });
  }, [openDropdown]);

  const toggleDropdown = useCallback((key: string) => {
    setOpenDropdown((prev) => {
      const next = prev === key ? null : key;
      if (next) {
        const el = buttonRefs.current[key];
        if (el) {
          const rect = el.getBoundingClientRect();
          const panelWidth = 176;
          let left = rect.left;
          if (left + panelWidth > window.innerWidth - 8) {
            left = window.innerWidth - panelWidth - 8;
          }
          setDropdownPos({ top: rect.bottom + 6, left, width: panelWidth });
        }
      }
      return next;
    });
  }, []);

  return (
    <>
      {/* ── FILTER BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        className="relative border-b border-gray-100 bg-white"
      >
        {/* ROW 1: Filter button + chips */}
        <div className="flex items-center">
          {/* sticky left */}
          <div
            className="sticky left-0 z-10 flex shrink-0 items-center gap-2 bg-white"
            style={{
              padding: '10px 10px 10px 14px',
              borderRight: '1px solid #f3f4f6',
            }}
          >
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={onOpen}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#FF7272] text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[#ff5a5a]"
              style={{
                padding: '6px 14px',
                boxShadow: '0 2px 10px rgba(255,114,114,0.32)',
              }}
            >
              <SlidersHorizontal size={13} />
              Filter
            </motion.button>
          </div>

          {/* scrollable chips only */}
          <div
            className="flex items-center gap-2 overflow-x-auto"
            style={{
              flex: 1,
              padding: '10px 14px 10px 10px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {Object.keys(filterOptions).map((key, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.25 }}
              >
                <button
                  ref={(el) => {
                    buttonRefs.current[key] = el;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(key);
                  }}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border text-[13px] font-medium transition-all duration-200 ${
                    openDropdown === key
                      ? 'border-[#FF7272] bg-[#fff0f0] text-[#FF7272]'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-[#FF7272] hover:text-[#FF7272]'
                  }`}
                  style={{
                    padding: '5px 13px',
                    boxShadow:
                      openDropdown === key
                        ? '0 0 0 3px rgba(255,114,114,0.10)'
                        : 'none',
                    whiteSpace: 'nowrap',
                  }}
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
              </motion.div>
            ))}
          </div>
        </div>

        {/* ROW 2: Selected tags — only rendered when there are selections */}
        <AnimatePresence>
          {selectedFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap items-center gap-2"
              style={{ padding: '8px 14px', borderTop: '1px solid #f3f4f6' }}
            >
              {selectedFilters.map((filter) => (
                <motion.div
                  key={filter}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.75 }}
                  transition={{ duration: 0.18 }}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#ffc6c6] bg-[#fff0f0] text-[12px] font-medium text-[#FF7272]"
                  style={{ padding: '4px 10px' }}
                >
                  {filter}
                  <button
                    onClick={() => onRemove(filter)}
                    className="flex items-center justify-center rounded-full transition-colors duration-150 hover:bg-[#FF7272] hover:text-white"
                    style={{ padding: 2 }}
                  >
                    <X size={10} strokeWidth={2.5} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── PORTAL DROPDOWN — opens below the chip button ── */}
      {openDropdown &&
        dropdownPos &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key={openDropdown}
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
                zIndex: 9999,
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                maxHeight: 220,
              }}
              className="overflow-y-auto rounded-xl border border-gray-100 bg-white"
            >
              {filterOptions[openDropdown].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025 }}
                  onClick={() => {
                    onSelect(item);
                    setOpenDropdown(null);
                  }}
                  className="group flex cursor-pointer items-center gap-2 rounded-lg transition-colors duration-150 hover:bg-[#fff0f0]"
                  style={{ padding: '7px 12px', margin: '2px 4px' }}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-200 transition-colors duration-150 group-hover:bg-[#FF7272]" />
                  <span className="text-[13px] font-medium text-gray-700 transition-colors duration-150 group-hover:text-[#FF7272]">
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>,
          document.body
        )}

      {/* ── FLOATING FAB (appears on scroll) ── */}
      <AnimatePresence>
        {isSticky && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            onClick={onOpen}
            className="fixed right-5 bottom-20 z-50 rounded-full bg-[#FF7272] text-white"
            style={{
              padding: 16,
              boxShadow: '0 4px 20px rgba(255,114,114,0.4)',
            }}
          >
            <ListFilter size={22} />
            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#FF7272] opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default VehicleFilter;
