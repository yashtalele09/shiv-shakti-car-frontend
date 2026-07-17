import { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { brands } from '../constants';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

const BrandButtonsFilters = () => {
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
  };

  return (
    <div
      className="mt-1 w-full overflow-hidden bg-gradient-to-br from-[#FFD9C9] to-[#CDC3FF] p-4"
      style={{
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
        maskImage:
          'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
      }}
    >
      {/* Section Label */}
      <p className="mb-3 text-[11px] font-semibold tracking-widest text-purple-400 uppercase">
        Top Brands
      </p>

      {/* Top 9 Brand Cards */}
      <div className="grid grid-cols-3 gap-3">
        {brands.slice(0, 9).map((brand, i) => (
          <BrandCard
            key={i}
            brand={brand}
            handleBrandClick={handleBrandClick}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-5 flex w-full items-center justify-center">
        <button
          onClick={() => setShowAll(true)}
          className="w-[52%] rounded-full bg-[#1a1028] py-[11px] text-[13px] font-medium tracking-wide text-white transition-all duration-150 hover:bg-[#2e1f45] active:scale-95"
        >
          View All Brands ↗
        </button>
      </div>

      {/* Modal */}
      {showAll &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
            style={{ backdropFilter: 'blur(6px)' }}
            onClick={(e) => e.target === e.currentTarget && setShowAll(false)}
          >
            <div
              className="flex max-h-[82vh] w-[90%] max-w-[420px] flex-col overflow-hidden rounded-[22px]"
              style={{
                background: 'linear-gradient(145deg, #FFE5D5 0%, #EDE4FF 100%)',
                boxShadow: '0 20px 60px rgba(80,40,160,0.22)',
                animation: 'modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-purple-200/30 px-5 pt-5 pb-3">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-[15px] font-semibold text-[#2a1a4e]">
                    All Brands
                  </h2>
                  <span className="text-[12px] font-normal text-purple-400">
                    {filtered.length} brands
                  </span>
                </div>
                <button
                  onClick={() => setShowAll(false)}
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-purple-200/40 bg-white/70 text-purple-500 transition hover:bg-white"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Search */}
              <div className="px-4 pt-3 pb-1">
                <div className="flex items-center gap-2 rounded-[10px] border border-purple-200/30 bg-white/60 px-3 py-2 transition focus-within:border-purple-400/50 focus-within:bg-white/85">
                  <Search size={14} className="shrink-0 text-purple-300" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search brands…"
                    className="flex-1 bg-transparent font-[DM_Sans,sans-serif] text-[13px] text-[#2a1a4e] placeholder-purple-300 outline-none"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="text-purple-300 transition hover:text-purple-500"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Brand Grid */}
              <div className="scrollbar-thin scrollbar-thumb-purple-200 flex-1 overflow-y-auto px-4 py-3">
                {filtered.length > 0 ? (
                  <div className="grid grid-cols-3 gap-[10px]">
                    {filtered.map((brand, i) => (
                      <BrandCardModal
                        key={i}
                        brand={brand}
                        handleBrandClick={handleBrandClick}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="mt-8 text-center text-[13px] text-purple-300">
                    No brands found
                  </p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* ── Reusable sub-components ── */

const BrandCard = ({
  brand,
  handleBrandClick,
}: {
  brand: { name: string; logo: string };
  handleBrandClick: (brandName: string) => void;
}) => (
  <div
    onClick={() => handleBrandClick(brand.name)}
    className="flex h-[88px] cursor-pointer flex-col items-center justify-center gap-[6px] rounded-[14px] border border-gray-200/80 bg-white transition-all duration-150 hover:-translate-y-[2px] hover:border-purple-200 hover:shadow-[0_6px_22px_rgba(120,80,200,0.13)] active:scale-95"
  >
    <img src={brand.logo} alt={brand.name} className="h-8 w-8 object-contain" />
    <p className="text-[11px] font-medium tracking-[0.01em] text-gray-500">
      {brand.name}
    </p>
  </div>
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
    className="flex h-[80px] cursor-pointer flex-col items-center justify-center gap-[5px] rounded-[12px] border border-purple-100/40 bg-white/80 transition-all duration-150 hover:-translate-y-[1px] hover:bg-white active:scale-95"
  >
    <img src={brand.logo} alt={brand.name} className="h-7 w-7 object-contain" />
    <p className="text-[11px] font-medium tracking-[0.01em] text-gray-500">
      {brand.name}
    </p>
  </div>
);

export default BrandButtonsFilters;
