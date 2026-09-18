import { useState, useEffect, useRef } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { brands } from '../../constants';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

const BrandButtonsFiltersDesktop = () => {
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (showAll) {
      setTimeout(() => searchRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAll(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleBrandClick = (brandName: string) => {
    navigate(`/vehicle?vehicle_brand=${brandName}`);
    setShowAll(false);
  };

  return (
    <div className="mx-auto w-full max-w-7xl rounded-xl bg-gradient-to-b from-[#f2f7ff] via-[#e0edf6] to-[#f2f7ff] px-6 py-10">
      {/* Header row */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="mt-1 text-[26px] font-bold tracking-tight text-[#1A2233]">
            Browse Top Brands
          </h2>
        </div>

        <button
          onClick={() => setShowAll(true)}
          className="group flex items-center gap-1.5 rounded-full border border-[#1B2F4B] px-5 py-2.5 text-[13px] font-semibold text-[#1B2F4B] transition-all duration-200 hover:bg-[#1B2F4B] hover:text-white"
        >
          View All Brands
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {/* Brand strip */}
      {/* Brand strip */}
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {brands.slice(0, 12).map((brand, i) => (
          <BrandCard
            key={i}
            brand={brand}
            index={i}
            handleBrandClick={handleBrandClick}
          />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showAll &&
          createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F1F35]/50 backdrop-blur-sm"
              onClick={(e) => e.target === e.currentTarget && setShowAll(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="flex max-h-[80vh] w-[92%] max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#E7EBF1] bg-white shadow-[0_24px_70px_-20px_rgba(15,23,42,0.35)]"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E7EBF1] px-6 pt-6 pb-4">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-[17px] font-bold text-[#1A2233]">
                      All Brands
                    </h2>
                    <span className="text-[12px] font-medium text-[#64748B]">
                      {filtered.length} available
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAll(false)}
                    aria-label="Close"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E7EBF1] bg-[#F8FAFC] text-[#64748B] transition hover:border-[#1B2F4B]/30 hover:text-[#1B2F4B]"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Search */}
                <div className="px-6 pt-4 pb-2">
                  <div className="flex items-center gap-2.5 rounded-xl border border-[#E7EBF1] bg-[#F8FAFC] px-4 py-3 transition focus-within:border-[#1B2F4B]/40 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(27,47,75,0.08)]">
                    <Search size={16} className="shrink-0 text-[#94A3B8]" />
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search brands…"
                      className="flex-1 bg-transparent text-[14px] text-[#1A2233] placeholder-[#94A3B8] outline-none"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        className="text-[#94A3B8] transition hover:text-[#1B2F4B]"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Scrollable Brand Grid */}
                <div className="flex-1 overflow-y-auto px-6 py-5 [scrollbar-width:thin]">
                  {filtered.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
                      {filtered.map((brand, i) => (
                        <BrandCardModal
                          key={i}
                          brand={brand}
                          handleBrandClick={handleBrandClick}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-14 text-center">
                      <Search size={22} className="text-[#CBD5E1]" />
                      <p className="text-[13px] text-[#94A3B8]">
                        No brands match “{query}”
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>,
            document.body
          )}
      </AnimatePresence>
    </div>
  );
};

/* ── Reusable sub-components ── */

const BrandCard = ({
  brand,
  index,
  handleBrandClick,
}: {
  brand: { name: string; logo: string };
  index: number;
  handleBrandClick: (brandName: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.3,
      delay: index * 0.02,
      ease: [0.22, 1, 0.36, 1],
    }}
    whileHover={{ y: -3 }}
    onClick={() => handleBrandClick(brand.name)}
    className="group flex h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-[#E7EBF1] bg-white transition-all duration-200 hover:border-[#1B2F4B]/25 hover:shadow-[0_10px_28px_-12px_rgba(15,23,42,0.25)]"
  >
    <img
      src={brand.logo}
      alt={brand.name}
      className="h-9 w-9 object-contain grayscale-[15%] transition-all duration-200 group-hover:grayscale-0"
    />
    <p className="text-[11.5px] font-medium tracking-[0.01em] text-[#475569] transition-colors duration-200 group-hover:text-[#1B2F4B]">
      {brand.name}
    </p>
  </motion.div>
);

const BrandCardModal = ({
  brand,
  handleBrandClick,
}: {
  brand: { name: string; logo: string };
  handleBrandClick: (brandName: string) => void;
}) => (
  <div
    onClick={() => handleBrandClick(brand.name)}
    className="group flex h-[86px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-[#E7EBF1] bg-[#F8FAFC] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1B2F4B]/25 hover:bg-white hover:shadow-[0_8px_20px_-10px_rgba(15,23,42,0.25)]"
  >
    <img src={brand.logo} alt={brand.name} className="h-7 w-7 object-contain" />
    <p className="text-[11px] font-medium tracking-[0.01em] text-[#475569] group-hover:text-[#1B2F4B]">
      {brand.name}
    </p>
  </div>
);

export default BrandButtonsFiltersDesktop;
