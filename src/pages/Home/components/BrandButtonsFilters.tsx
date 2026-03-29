import { useState, useEffect, useRef } from "react";
import { X, Search } from "lucide-react";
import { brands } from "../constants";
import { createPortal } from "react-dom";

const BrandButtonsFilters = () => {
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (showAll) {
      setTimeout(() => searchRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAll(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="w-full overflow-hidden bg-gradient-to-br from-[#FFD9C9] to-[#CDC3FF] p-4 mt-1"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
      }}>
      {/* Section Label */}
      <p className="text-[11px] font-semibold tracking-widest text-purple-400 uppercase mb-3">
        Top Brands
      </p>

      {/* Top 9 Brand Cards */}
      <div className="grid grid-cols-3 gap-3">
        {brands.slice(0, 9).map((brand, i) => (
          <BrandCard key={i} brand={brand} />
        ))}
      </div>

      {/* View All Button */}
      <div className="w-full flex items-center justify-center mt-5">
        <button
          onClick={() => setShowAll(true)}
          className="w-[52%] bg-[#1a1028] text-white text-[13px] font-medium tracking-wide py-[11px] rounded-full hover:bg-[#2e1f45] active:scale-95 transition-all duration-150">
          View All Brands ↗
        </button>
      </div>

      {/* Modal */}
      {showAll &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
            style={{ backdropFilter: "blur(6px)" }}
            onClick={(e) => e.target === e.currentTarget && setShowAll(false)}>
            <div
              className="w-[90%] max-w-[420px] max-h-[82vh] rounded-[22px] flex flex-col overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #FFE5D5 0%, #EDE4FF 100%)",
                boxShadow: "0 20px 60px rgba(80,40,160,0.22)",
                animation: "modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
              }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-purple-200/30">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-[15px] font-semibold text-[#2a1a4e]">
                    All Brands
                  </h2>
                  <span className="text-[12px] text-purple-400 font-normal">
                    {filtered.length} brands
                  </span>
                </div>
                <button
                  onClick={() => setShowAll(false)}
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-purple-500 border border-purple-200/40 bg-white/70 hover:bg-white transition">
                  <X size={14} />
                </button>
              </div>

              {/* Search */}
              <div className="px-4 pt-3 pb-1">
                <div className="flex items-center gap-2 bg-white/60 border border-purple-200/30 rounded-[10px] px-3 py-2 focus-within:border-purple-400/50 focus-within:bg-white/85 transition">
                  <Search size={14} className="text-purple-300 shrink-0" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search brands…"
                    className="flex-1 bg-transparent text-[13px] text-[#2a1a4e] placeholder-purple-300 outline-none font-[DM_Sans,sans-serif]"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="text-purple-300 hover:text-purple-500 transition">
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Brand Grid */}
              <div className="overflow-y-auto flex-1 px-4 py-3 scrollbar-thin scrollbar-thumb-purple-200">
                {filtered.length > 0 ? (
                  <div className="grid grid-cols-3 gap-[10px]">
                    {filtered.map((brand, i) => (
                      <BrandCardModal key={i} brand={brand} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-[13px] text-purple-300 mt-8">
                    No brands found
                  </p>
                )}
              </div>
            </div>
          </div>,
          document.body,
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

const BrandCard = ({ brand }: { brand: { name: string; logo: string } }) => (
  <div className="h-[88px] bg-white border border-gray-200/80 rounded-[14px] flex flex-col items-center justify-center gap-[6px] cursor-pointer transition-all duration-150 hover:-translate-y-[2px] hover:shadow-[0_6px_22px_rgba(120,80,200,0.13)] hover:border-purple-200 active:scale-95">
    <img src={brand.logo} alt={brand.name} className="h-8 w-8 object-contain" />
    <p className="text-[11px] font-medium text-gray-500 tracking-[0.01em]">
      {brand.name}
    </p>
  </div>
);

const BrandCardModal = ({
  brand,
}: {
  brand: { name: string; logo: string };
}) => (
  <div className="h-[80px] bg-white/80 border border-purple-100/40 rounded-[12px] flex flex-col items-center justify-center gap-[5px] cursor-pointer transition-all duration-150 hover:bg-white hover:-translate-y-[1px] active:scale-95">
    <img src={brand.logo} alt={brand.name} className="h-7 w-7 object-contain" />
    <p className="text-[11px] font-medium text-gray-500 tracking-[0.01em]">
      {brand.name}
    </p>
  </div>
);

export default BrandButtonsFilters;
