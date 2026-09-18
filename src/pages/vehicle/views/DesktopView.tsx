import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

import FilterSidebar from '../components/desktop/FilterPanel';
import VehicleFilterBar from '../components/desktop/VehicleFilter';
import CarCard from '../components/desktop/CarCard';
import NoData from '../components/desktop/NoData';

import useGetAllVehicleMutation from '../hooks/useGetAllVehicle';
import CarLoader from '../../../components/mobail-components/Loading';
import type { VehicleAPIInputT, VehicleDataT } from '../../../typs/vehicle/get';

const LIMIT = 12;

// Maps the sort dropdown value (VehicleFilterBar) onto API sort params.
// Adjust the field names below to match whatever the backend actually expects.
const SORT_PARAM_MAP: Record<string, Partial<VehicleAPIInputT>> = {
  relevance: {},
  price_low: { sort_by: 'vehicle_price', sort_order: 'asc' } as any,
  price_high: { sort_by: 'vehicle_price', sort_order: 'desc' } as any,
  year_new: { sort_by: 'registration_year', sort_order: 'desc' } as any,
  km_low: { sort_by: 'kilometers_driven', sort_order: 'asc' } as any,
};

const VehicleDesktop = () => {
  const [filters, setFilters] = useState<string[]>([]);
  const [apiFilters, setApiFilters] = useState<VehicleAPIInputT>({});
  const [sortValue, setSortValue] = useState('relevance');
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
      if (searchQuery) {
        params.search = searchQuery;
      }
      return { ...params, ...SORT_PARAM_MAP[sortValue] };
    },
    [masterData, searchQuery, sortValue]
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

  // ── Filters or sort changed → reset to page 1 and refetch ──
  useEffect(() => {
    if (isInitialLoadRef.current) return;
    setDisplayData([]);
    setHasMore(true);
    hasUserScrolledRef.current = false;
    fetchPage(1, { ...apiFilters, ...SORT_PARAM_MAP[sortValue] });
  }, [apiFilters, sortValue]);

  // ── Search param changed (user searched again from Header while already here) ──
  useEffect(() => {
    if (isInitialLoadRef.current) return;
    setFilters([]);
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
          fetchPage(page + 1, { ...apiFilters, ...SORT_PARAM_MAP[sortValue] });
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [page, hasMore, isPending, apiFilters, sortValue, fetchPage]);

  const handleSelect = (filter: string) => {
    const next = filters.includes(filter) ? filters : [...filters, filter];
    setFilters(next);
    setApiFilters(buildApiParams(next));
  };

  const handleRemove = (filter: string) => {
    const next = filters.filter((f) => f !== filter);
    setFilters(next);
    setApiFilters(buildApiParams(next));
  };

  // FilterSidebar applies a full param set (ranges + option chips) at once,
  // replacing whatever pill filters were active in the bar above it.
  const handleSidebarApply = (params: VehicleAPIInputT) => {
    const merged: VehicleAPIInputT = {
      ...params,
      ...(searchQuery ? { search: searchQuery } : {}),
    };
    setApiFilters(merged);
    setFilters(
      Object.values(params).filter((v): v is string => typeof v === 'string')
    );
  };

  const clearSearch = () => {
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  const clearAll = () => {
    setFilters([]);
    setSortValue('relevance');
    setApiFilters(searchQuery ? { search: searchQuery } : {});
  };

  if (isPending && isInitialLoad) return <CarLoader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-15 flex min-h-screen w-full max-w-[1440px] gap-6 px-8 pt-24 pb-12"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <FilterSidebar onApply={handleSidebarApply} vehicleData={masterData} />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {searchQuery && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Search results for <strong>&ldquo;{searchQuery}&rdquo;</strong>
            </span>
            <button
              onClick={clearSearch}
              className="font-medium text-[#FF7272] hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        <VehicleFilterBar
          selectedFilters={filters}
          onRemove={handleRemove}
          onSelect={handleSelect}
          vehicleData={masterData}
          resultCount={displayData.length}
          sortValue={sortValue}
          onSortChange={setSortValue}
        />

        {!isPending && displayData.length === 0 ? (
          <NoData onClear={clearAll} searchQuery={searchQuery} />
        ) : (
          <div className="grid grid-cols-2 gap-5 xl:grid-cols-3 2xl:grid-cols-3">
            {displayData.map((item) => (
              <CarCard key={item._id} vehicleData={item} />
            ))}
          </div>
        )}

        {hasMore && <div ref={sentinelRef} className="h-1 w-full" />}

        {loadingMoreRef.current && (
          <div className="flex w-full justify-center py-6 opacity-50">
            <CarLoader />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VehicleDesktop;
