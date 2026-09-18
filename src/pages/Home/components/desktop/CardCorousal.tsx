// CardCorousal.tsx
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CarCard from './CarCard';
import type { VehicleDataT } from '../../../../typs/vehicle/get';

interface CardCorouselProps {
  vehicles: VehicleDataT[];
}

// ─── Final "View All" CTA slide ────────────────────────────────────────────
const ViewAllCard = ({ total }: { total: number }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate('/vehicles')}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="group relative flex h-full w-[280px] shrink-0 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-[#1B2F4B] bg-gradient-to-br from-[#1B2F4B] via-[#182A44] to-[#0F1F35] px-6 py-10 text-center shadow-[0_8px_32px_rgba(15,23,42,0.25)] sm:w-[320px]"
    >
      {/* decorative glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#3B5A85]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-[#C9972D]/15 blur-3xl" />

      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105">
        <LayoutGrid size={22} className="text-[#C9972D]" />
      </span>

      <div className="relative">
        <p className="text-[15px] font-bold tracking-tight text-white">
          Explore All Vehicles
        </p>
        <p className="mt-1 text-[12px] text-white/60">
          {total}+ verified listings waiting for you
        </p>
      </div>

      <span className="relative mt-1 flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-[12px] font-semibold text-white ring-1 ring-white/15 transition-all duration-300 group-hover:gap-2.5 group-hover:bg-white/15">
        View Full Inventory
        <ArrowRight
          size={14}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </span>
    </motion.button>
  );
};

const CardCorousal = ({ vehicles }: CardCorouselProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const count = vehicles.length;
  // +1 slot accounted for in scroll math because of the trailing CTA card
  const slideCount = count + (count > 0 ? 1 : 0);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || slideCount === 0) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const pct = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
    setProgress(pct);
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft > maxScroll - 8);

    const cardWidth = el.scrollWidth / slideCount;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(count - 1, Math.max(0, idx)));
  }, [slideCount, count]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el || slideCount === 0) return;
    const cardWidth = el.scrollWidth / slideCount;
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };

  if (count === 0) {
    return (
      <div className="mt-10 flex h-[40vh] w-[86%] items-center justify-center rounded-2xl border border-[#E7EBF1] bg-white text-sm text-[#64748B]">
        No vehicles to show yet.
      </div>
    );
  }

  return (
    <div className="mt-10 w-[86%] max-w-full min-w-0">
      <div className="relative min-w-0 overflow-hidden rounded-2xl border border-[#E7EBF1] bg-gradient-to-b from-white to-[#F8FAFC] shadow-[0_20px_50px_-20px_rgba(15,23,42,0.20)]">
        <div className="flex items-center justify-between px-6 pt-5">
          <div className="flex items-baseline gap-2 font-['Oswald',sans-serif]">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeIndex}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-semibold tracking-wide text-[#1B2F4B] tabular-nums"
              >
                {String(activeIndex + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm text-[#64748B] tabular-nums">
              / {String(count).padStart(2, '0')}
            </span>
          </div>

          <div className="flex gap-2">
            <motion.button
              aria-label="Previous car"
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              whileHover={!atStart ? { scale: 1.08 } : undefined}
              whileTap={!atStart ? { scale: 0.94 } : undefined}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E7EBF1] bg-white text-[#1A2233] shadow-sm transition-colors hover:enabled:border-[#1B2F4B] hover:enabled:text-[#1B2F4B] disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
            <motion.button
              aria-label="Next car"
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              whileHover={!atEnd ? { scale: 1.08 } : undefined}
              whileTap={!atEnd ? { scale: 0.94 } : undefined}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E7EBF1] bg-white text-[#1A2233] shadow-sm transition-colors hover:enabled:border-[#1B2F4B] hover:enabled:text-[#1B2F4B] disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </div>
        </div>

        <div className="relative mt-4 min-w-0">
          <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-14 bg-gradient-to-r from-[#F8FAFC] to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-14 bg-gradient-to-l from-[#F8FAFC] to-transparent" />

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory items-stretch gap-6 overflow-x-scroll scroll-smooth px-10 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {vehicles.map((vehicleData) => (
              <div key={vehicleData.vehicle_id} className="snap-center">
                <CarCard vehicleData={vehicleData} />
              </div>
            ))}

            {/* Final CTA slide */}
            <div className="snap-center">
              <ViewAllCard total={count} />
            </div>
          </div>
        </div>

        <div className="px-6 pt-3 pb-5">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#E7EBF1]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#1B2F4B] to-[#3B5A85]"
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCorousal;
