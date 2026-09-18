import { useEffect, useState, useCallback, useRef } from 'react';
import VehicleFilter from '../components/mobile/VehicleFIlter';
import FilterPanel from '../components/mobile/FilterPanel';
import CarCard from '../components/mobile/CarCard';
import { motion } from 'framer-motion';
import useGetAllVehicleMutation from '../hooks/useGetAllVehicle';
import CarLoader from '../../../components/mobail-components/Loading';
import NoData from '../components/mobile/NoData';
import type { VehicleAPIInputT, VehicleDataT } from '../../../typs/vehicle/get';
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
  const hasUserScrolledRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

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
      // preserve an active text search alongside pill filters
      if (searchQuery) {
        params.search = searchQuery;
      }
      return params;
    },
    [masterData, searchQuery]
  );

  const fetchPage = useCallback(
    (pageNum: number, params: VehicleAPIInputT) => {
      fetchVehicles({ ...params, page: pageNum, limit: LIMIT });
    },
    [fetchVehicles]
  );

  // ── Initial fetch: honors a ?search= param present on first load ──
  useEffect(() => {
    const initialSearch = searchParams.get('search');
    fetchPage(1, initialSearch ? { search: initialSearch } : {});
    if (initialSearch) {
      setApiFilters({ search: initialSearch });
    }
  }, []);

  // ── Filters changed → reset to page 1 and refetch ──
  useEffect(() => {
    if (isInitialLoadRef.current) return;
    setDisplayData([]);
    setHasMore(true);
    hasUserScrolledRef.current = false;
    fetchPage(1, apiFilters);
  }, [apiFilters]);

  // ── Search param changed (user searched again from Header while already here) ──
  useEffect(() => {
    if (isInitialLoadRef.current) return;
    setFilters([]); // a fresh text search clears pill filters
    setApiFilters(searchQuery ? { search: searchQuery } : {});
  }, [searchQuery]);

  // ── Track real user scroll ──
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        hasUserScrolledRef.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Infinite scroll ──
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
          hasUserScrolledRef.current
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

  const clearSearch = () => {
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  if (isPending && isInitialLoad) return <CarLoader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-18"
    >
      {searchQuery && (
        <div className="flex items-center justify-between px-4 pt-2 pb-1 text-sm text-gray-600">
          <span>
            Search results for <strong>&ldquo;{searchQuery}&rdquo;</strong>
          </span>
          <button onClick={clearSearch} className="text-red-500 underline">
            Clear
          </button>
        </div>
      )}

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
