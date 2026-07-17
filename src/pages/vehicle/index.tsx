import { useEffect, useState, useCallback, useRef } from 'react';
import VehicleFilter from './components/VehicleFIlter';
import FilterPanel from './components/FilterPanel';
import CarCard from './components/CarCard';
import { motion } from 'framer-motion';
import useGetAllVehicleMutation from './hooks/useGetAllVehicle';
import CarLoader from '../../components/mobail-components/Loading';
import NoData from './components/NoData';
import type { VehicleAPIInputT, VehicleDataT } from '../../typs/vehicle/get';
import { useSearchParams } from 'react-router-dom';

const LIMIT = 8;

const Vehicle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const [apiFilters, setApiFilters] = useState<VehicleAPIInputT>({});
  const [masterData, setMasterData] = useState<VehicleDataT[]>([]);
  const [displayData, setDisplayData] = useState<VehicleDataT[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const isInitialLoadRef = useRef(true);
  const loadingMoreRef = useRef(false);
  const hasUserScrolledRef = useRef(false); // ← NEW: gate for real scroll
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();

  const { mutate: fetchVehicles, isPending } = useGetAllVehicleMutation({
    onSuccess: (data: any, variables: any) => {
      const incomingPage = variables?.page ?? 1;
      const incoming: VehicleDataT[] = data.vehicleData ?? [];

      if (masterData.length === 0 && incomingPage === 1) {
        setMasterData(incoming);
      }

      if (incomingPage === 1) {
        setDisplayData(incoming);
      } else {
        setDisplayData((prev) => {
          const seen = new Set(prev.map((v) => v._id));
          const deduped = incoming.filter((v) => !seen.has(v._id));
          return [...prev, ...deduped];
        });
      }

      setHasMore(incoming.length === LIMIT);
      setPage(incomingPage);
      loadingMoreRef.current = false;

      if (isInitialLoadRef.current) {
        const brand = searchParams.get('vehicle_brand');
        if (brand && incomingPage === 1 && filters.length === 0) {
          const matched = incoming.find(
            (v: any) => v.vehicle_brand.toLowerCase() === brand.toLowerCase()
          )?.vehicle_brand;

          isInitialLoadRef.current = false;
          setIsInitialLoad(false);

          const brandToUse = matched ?? brand;
          setFilters([brandToUse]);
          setApiFilters({ vehicle_brand: brandToUse });
          return;
        }
      }

      isInitialLoadRef.current = false;
      setIsInitialLoad(false);
    },
    onError: (error: any) => console.log('error', error),
  });

  const buildApiParams = useCallback(
    (currentFilters: string[]): VehicleAPIInputT => {
      const grouped: Record<string, string[]> = {
        vehicle_model: [],
        vehicle_brand: [],
        vehicle_color: [],
        transmission_type: [],
        body_type: [],
        vehicle_location: [],
      };

      for (const filter of currentFilters) {
        if (masterData.some((v) => v.vehicle_model === filter))
          grouped.vehicle_model.push(filter);
        if (masterData.some((v) => v.vehicle_brand === filter))
          grouped.vehicle_brand.push(filter);
        if (masterData.some((v) => v.vehicle_color === filter))
          grouped.vehicle_color.push(filter);
        if (masterData.some((v) => v.transmission_type === filter))
          grouped.transmission_type.push(filter);
        if (masterData.some((v) => v.body_type === filter))
          grouped.body_type.push(filter);
        if (masterData.some((v) => v.vehicle_location === filter))
          grouped.vehicle_location.push(filter);
      }

      const params: VehicleAPIInputT = {};
      for (const [key, values] of Object.entries(grouped)) {
        if (values.length > 0) {
          (params as any)[key] = values.join(',');
        }
      }
      return params;
    },
    [masterData]
  );

  const fetchPage = useCallback(
    (pageNum: number, params: VehicleAPIInputT) => {
      fetchVehicles({ ...params, page: pageNum, limit: LIMIT });
    },
    [fetchVehicles]
  );

  // ── Initial fetch: first 8 cards ──
  useEffect(() => {
    fetchPage(1, {});
  }, []);

  // ── Filters changed → reset to page 1 and refetch ──
  useEffect(() => {
    if (isInitialLoadRef.current) return;
    setDisplayData([]);
    setHasMore(true);
    hasUserScrolledRef.current = false; // reset scroll-gate on new filter set
    fetchPage(1, apiFilters);
  }, [apiFilters]);

  // ── Track real user scroll so auto-triggering can't happen on mount ──
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        hasUserScrolledRef.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Infinite scroll: load next 8 only after the user has actually scrolled ──
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isPending &&
          !loadingMoreRef.current &&
          hasUserScrolledRef.current // ← the actual fix
        ) {
          loadingMoreRef.current = true;
          fetchPage(page + 1, apiFilters);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [page, hasMore, isPending, apiFilters, fetchPage]);

  const handleSelect = (filter: string) => {
    const next = filters.includes(filter)
      ? filters.filter((f) => f !== filter)
      : [...filters, filter];
    setFilters(next);
    setApiFilters(buildApiParams(next));
  };

  const handleRemove = (filter: string) => {
    const next = filters.filter((f) => f !== filter);
    setFilters(next);
    setApiFilters(buildApiParams(next));
  };

  if (isPending && isInitialLoad) return <CarLoader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-18"
    >
      <VehicleFilter
        onOpen={() => setIsOpen(true)}
        selectedFilters={filters}
        onRemove={handleRemove}
        onSelect={handleSelect}
        vehicleData={masterData}
      />

      <FilterPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        vehicleData={masterData}
        onApply={(apiParams) => {
          setApiFilters(apiParams);
          setFilters(
            Object.values(apiParams).filter(
              (v): v is string => typeof v === 'string'
            )
          );
        }}
      />

      <div className="mt-2 flex w-full flex-col items-center justify-center gap-4">
        {!isPending && displayData.length === 0 ? (
          <NoData />
        ) : (
          displayData.map((item) => (
            <CarCard key={item._id} vehicleData={item} />
          ))
        )}

        {hasMore && <div ref={sentinelRef} className="h-1 w-full" />}

        {loadingMoreRef.current && (
          <div className="flex w-full justify-center py-4 opacity-50">
            <CarLoader />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Vehicle;
