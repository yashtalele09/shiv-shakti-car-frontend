import { ListFilter, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface VehicleFilterProps {
  onOpen: () => void;
  selectedFilters: string[];
  onRemove: (filter: string) => void;
}

const filterOptions = {
  name: ["Swift", "i20", "Fortuner", "Creta", "Baleno"],
  brand: ["Maruti", "Hyundai", "Toyota", "Honda", "Tata"],
  color: ["Red", "Black", "White", "Silver", "Blue"],
};

const VehicleFilter = ({
  onOpen,
  selectedFilters,
  onRemove,
}: VehicleFilterProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when dropdown open
  useEffect(() => {
    document.body.style.overflow = openDropdown ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openDropdown]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = useCallback((key: string) => {
    setOpenDropdown((prev) => {
      const next = prev === key ? null : key;
      if (next) {
        const rect = buttonRefs.current[key]?.getBoundingClientRect();
        if (rect)
          setDropdownPos({
            top: rect.bottom + 6,
            left: rect.left + rect.width / 2,
          });
      }
      return next;
    });
  }, []);

  return (
    <>
      {/* ── FILTER BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex items-center gap-2.5 px-4 py-2.5 border-b border-gray-100 bg-white overflow-x-auto no-scrollbar whitespace-nowrap"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* ── Primary Filter Button ── */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          className="group flex items-center gap-2 bg-[#FF7272] text-white px-4 py-1.5 rounded-full text-sm font-semibold shrink-0 shadow-[0_2px_10px_rgba(255,114,114,0.35)] hover:bg-[#ff5a5a] transition-colors duration-200">
          <SlidersHorizontal
            size={14}
            className="transition-transform duration-200 group-hover:rotate-12"
          />
          Filter
        </motion.button>

        {/* ── Divider ── */}
        <div className="h-5 w-px bg-gray-200 shrink-0" />

        {/* ── Dropdown Chips ── */}
        {Object.keys(filterOptions).map((key, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}>
            <button
              ref={(el) => {
                buttonRefs.current[key] = el;
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(key);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium shrink-0 border transition-all duration-200
                ${
                  openDropdown === key
                    ? "border-[#FF7272] bg-[#fff0f0] text-[#FF7272] shadow-[0_0_0_3px_rgba(255,114,114,0.12)]"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#FF7272] hover:text-[#FF7272]"
                }`}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <motion.span
                animate={{ rotate: openDropdown === key ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex">
                <ChevronDown size={13} />
              </motion.span>
            </button>
          </motion.div>
        ))}

        {/* ── Selected Filter Tags ── */}
        <AnimatePresence>
          {selectedFilters.map((filter) => (
            <motion.div
              key={filter}
              initial={{ opacity: 0, scale: 0.8, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.75, x: 8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5 bg-[#fff0f0] text-[#FF7272] border border-[#ffc6c6] px-3 py-1 rounded-full text-[12px] font-medium shrink-0">
              {filter}
              <button
                onClick={() => onRemove(filter)}
                className="hover:bg-[#FF7272] hover:text-white rounded-full p-0.5 transition-colors duration-150">
                <X size={10} strokeWidth={2.5} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ── PORTAL DROPDOWN ── */}
      {openDropdown &&
        dropdownPos &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key={openDropdown}
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "fixed",
                top: dropdownPos.top,
                left: dropdownPos.left,
                transform: "translateX(-50%)",
                zIndex: 9999,
                fontFamily: "'DM Sans', sans-serif",
              }}
              className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 p-1.5 w-44 max-h-52 overflow-y-auto">
              {filterOptions[openDropdown as keyof typeof filterOptions].map(
                (item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setOpenDropdown(null)}
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#fff0f0] transition-colors duration-150">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#FF7272] transition-colors duration-150 shrink-0" />
                    <span className="text-[13px] text-gray-700 group-hover:text-[#FF7272] font-medium transition-colors duration-150">
                      {item}
                    </span>
                  </motion.div>
                ),
              )}
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}

      {/* ── FLOATING FAB ── */}
      <AnimatePresence>
        {isSticky && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            onClick={onOpen}
            className="fixed right-5 bottom-20 z-50 bg-[#FF7272] text-white p-4 rounded-full shadow-[0_4px_20px_rgba(255,114,114,0.45)]">
            <ListFilter size={22} />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#FF7272] animate-ping opacity-20 pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default VehicleFilter;
