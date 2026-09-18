import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import type { VehicleDataT } from '../../../../typs/vehicle/get';
import type { VehicleAPIInputT } from '../../../../typs/vehicle/get';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: VehicleAPIInputT) => void;
  vehicleData: VehicleDataT[];
}

const STRING_FILTER_FIELDS: { key: keyof VehicleDataT; label: string }[] = [
  { key: 'body_type', label: 'Body Type' },
  { key: 'vehicle_model', label: 'Model' },
  { key: 'vehicle_brand', label: 'Brand' },
  { key: 'vehicle_varient', label: 'Variant' },
  { key: 'vehicle_color', label: 'Color' },
  { key: 'vehicle_location', label: 'Location' },
  { key: 'fuel_type', label: 'Fuel' },
  { key: 'transmission_type', label: 'Transmission' },
  { key: 'vehicle_type', label: 'Vehicle Type' },
];

const RANGE_CATEGORIES = ['Price', 'KM Driven', 'Owner Count', 'Reg. Year'];

const CURRENT_YEAR = new Date().getFullYear();

const DEFAULT_RANGES = {
  Price: [0, 2_000_000] as [number, number],
  'KM Driven': [0, 300_000] as [number, number],
  'Owner Count': [1, 5] as [number, number],
  'Reg. Year': [2000, CURRENT_YEAR] as [number, number],
};

const RANGE_STEPS: Record<string, number> = {
  Price: 50_000,
  'KM Driven': 5_000,
  'Owner Count': 1,
  'Reg. Year': 1,
};

const RANGE_FORMATTERS: Record<string, (v: number) => string> = {
  Price: (v) => `₹${v.toLocaleString()}`,
  'KM Driven': (v) => `${v.toLocaleString()} km`,
  'Owner Count': (v) => `${v} owner${v > 1 ? 's' : ''}`,
  'Reg. Year': (v) => `${v}`,
};

type RangeState = Record<string, [number, number]>;

const FilterPanel = ({
  isOpen,
  onClose,
  onApply,
  vehicleData,
}: FilterPanelProps) => {
  const [activeCategory, setActiveCategory] = useState('Price');
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [ranges, setRanges] = useState<RangeState>({ ...DEFAULT_RANGES });

  /* ── Derive unique chip options from live data ── */
  const dynamicFilters = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const { key, label } of STRING_FILTER_FIELDS) {
      const unique = [
        ...new Set(vehicleData.map((v) => (v as any)[key]).filter(Boolean)),
      ] as string[];
      if (unique.length > 0) result[label] = unique;
    }
    return result;
  }, [vehicleData]);

  /* ── Helpers ── */
  const toggleChip = (label: string, item: string) =>
    setSelected((prev) => {
      const cur = prev[label] ?? [];
      return {
        ...prev,
        [label]: cur.includes(item)
          ? cur.filter((f) => f !== item)
          : [...cur, item],
      };
    });

  const setRange = (cat: string, idx: 0 | 1, value: number) =>
    setRanges((prev) => {
      const [lo, hi] = prev[cat];
      const step = RANGE_STEPS[cat] ?? 1;
      return idx === 0
        ? { ...prev, [cat]: [Math.min(value, hi - step), hi] }
        : { ...prev, [cat]: [lo, Math.max(value, lo + step)] };
    });

  const clearFilters = () => {
    setSelected({});
    setRanges({ ...DEFAULT_RANGES });
  };

  const totalActive =
    Object.values(selected).flat().length +
    RANGE_CATEGORIES.filter((cat) => {
      const [lo, hi] = ranges[cat];
      const [dlo, dhi] = DEFAULT_RANGES[cat as keyof typeof DEFAULT_RANGES];
      return lo !== dlo || hi !== dhi;
    }).length;

  /* ── Build API params on Apply ── */
  const handleApply = () => {
    const labelToKey = Object.fromEntries(
      STRING_FILTER_FIELDS.map(({ key, label }) => [label, key])
    );

    const params: VehicleAPIInputT = {};

    // String filters — join as comma string to avoid field[]=val serialization
    for (const [label, values] of Object.entries(selected)) {
      if (values.length === 0) continue;
      const apiKey = labelToKey[label] as keyof VehicleAPIInputT;
      if (apiKey) (params as any)[apiKey] = values.join(',');
    }

    // Price
    const [pLo, pHi] = ranges['Price'];
    const [dPLo, dPHi] = DEFAULT_RANGES['Price'];
    if (pLo !== dPLo) params.min_price = pLo;
    if (pHi !== dPHi) params.max_price = pHi;

    // KM Driven
    const [kLo, kHi] = ranges['KM Driven'];
    const [dKLo, dKHi] = DEFAULT_RANGES['KM Driven'];
    if (kLo !== dKLo) params.min_km = kLo;
    if (kHi !== dKHi) params.max_km = kHi;

    // Owner Count (single value — send only if changed from default)
    const [oLo] = ranges['Owner Count'];
    const [dOLo] = DEFAULT_RANGES['Owner Count'];
    if (oLo !== dOLo) params.owner_count = oLo;

    // Registration Year (send start year only)
    const [yLo, yHi] = ranges['Reg. Year'];
    const [dYLo, dYHi] = DEFAULT_RANGES['Reg. Year'];
    if (yLo !== dYLo || yHi !== dYHi) params.registration_year = yLo;

    onApply(params);
    onClose();
  };

  const isRangeCategory = RANGE_CATEGORIES.includes(activeCategory);

  /* ── Render ── */
  return (
    <div
      className={`fixed top-0 right-0 z-[999] h-full w-full transform bg-white shadow-2xl transition-transform duration-300 sm:w-[420px] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-[#2e054e]">Filters</p>
          {totalActive > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
              {totalActive}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex h-[calc(100%-140px)]">
        {/* LEFT — category list */}
        <div className="w-1/3 overflow-y-auto border-r border-gray-200 bg-gray-50">
          {/* Range group */}
          <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
            Range
          </p>
          {RANGE_CATEGORIES.map((cat) => {
            const [lo, hi] = ranges[cat];
            const [dlo, dhi] =
              DEFAULT_RANGES[cat as keyof typeof DEFAULT_RANGES];
            const isDirty = lo !== dlo || hi !== dhi;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative w-full border-l-4 px-4 py-3 text-left text-sm transition ${
                  activeCategory === cat
                    ? 'border-red-500 bg-white font-medium'
                    : 'border-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
                {isDirty && (
                  <span className="absolute top-1/2 right-2 h-2 w-2 -translate-y-1/2 rounded-full bg-red-500" />
                )}
              </button>
            );
          })}

          {/* Options group */}
          {Object.keys(dynamicFilters).length > 0 && (
            <p className="px-4 pt-4 pb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Options
            </p>
          )}
          {Object.keys(dynamicFilters).map((label) => {
            const count = (selected[label] ?? []).length;
            return (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
                className={`relative w-full border-l-4 px-4 py-3 text-left text-sm transition ${
                  activeCategory === label
                    ? 'border-red-500 bg-white font-medium'
                    : 'border-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
                {count > 0 && (
                  <span className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT — active panel */}
        <div className="w-2/3 overflow-y-auto p-4">
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">
            {activeCategory}
          </h3>

          {/* Range panels */}
          {isRangeCategory &&
            (() => {
              const [lo, hi] = ranges[activeCategory];
              const [dlo, dhi] =
                DEFAULT_RANGES[activeCategory as keyof typeof DEFAULT_RANGES];
              const fmt = RANGE_FORMATTERS[activeCategory];
              const step = RANGE_STEPS[activeCategory];

              /* Owner Count — chip selector */
              if (activeCategory === 'Owner Count') {
                return (
                  <div>
                    <p className="mb-3 text-sm text-gray-500">
                      Select max owner count
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((n) => {
                        const label =
                          n === 1
                            ? '1st Owner'
                            : n === 2
                              ? '2nd Owner'
                              : n === 3
                                ? '3rd Owner'
                                : `${n}th Owner`;
                        return (
                          <button
                            key={n}
                            onClick={() =>
                              setRanges((prev) => ({
                                ...prev,
                                'Owner Count': [n, 5],
                              }))
                            }
                            className={`rounded-full border px-4 py-2 text-sm transition ${
                              lo === n
                                ? 'border-red-500 bg-red-500 text-white'
                                : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    {lo !== dlo && (
                      <button
                        onClick={() =>
                          setRanges((prev) => ({
                            ...prev,
                            'Owner Count': DEFAULT_RANGES['Owner Count'],
                          }))
                        }
                        className="mt-3 text-xs text-red-400 hover:text-red-600"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                );
              }

              /* Dual-range slider */
              return (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>{fmt(lo)}</span>
                    <span>{fmt(hi)}</span>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Min</label>
                    <input
                      type="range"
                      min={dlo}
                      max={dhi}
                      step={step}
                      value={lo}
                      onChange={(e) =>
                        setRange(activeCategory, 0, Number(e.target.value))
                      }
                      className="w-full accent-red-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Max</label>
                    <input
                      type="range"
                      min={dlo}
                      max={dhi}
                      step={step}
                      value={hi}
                      onChange={(e) =>
                        setRange(activeCategory, 1, Number(e.target.value))
                      }
                      className="w-full accent-red-500"
                    />
                  </div>
                  {(lo !== dlo || hi !== dhi) && (
                    <button
                      onClick={() =>
                        setRanges((prev) => ({
                          ...prev,
                          [activeCategory]:
                            DEFAULT_RANGES[
                              activeCategory as keyof typeof DEFAULT_RANGES
                            ],
                        }))
                      }
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Reset range
                    </button>
                  )}
                </div>
              );
            })()}

          {/* Chip options */}
          {!isRangeCategory && (
            <div className="flex flex-wrap gap-2">
              {dynamicFilters[activeCategory]?.map((item) => {
                const isActive = (selected[activeCategory] ?? []).includes(
                  item
                );
                return (
                  <button
                    key={item}
                    onClick={() => toggleChip(activeCategory, item)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      isActive
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="absolute bottom-0 flex w-full gap-3 border-t border-gray-200 bg-white p-4">
        <button
          onClick={clearFilters}
          className="w-1/3 rounded-lg border border-gray-200 py-2 text-sm hover:bg-gray-100"
        >
          Clear {totalActive > 0 && `(${totalActive})`}
        </button>
        <button
          onClick={handleApply}
          className="w-2/3 rounded-lg bg-red-500 py-2 font-medium text-white hover:bg-red-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
