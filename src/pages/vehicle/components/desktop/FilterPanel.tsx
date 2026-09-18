import { useState, useMemo } from 'react';
import { ChevronDown, RotateCcw, Check } from 'lucide-react';
import type { VehicleDataT } from '../../../../typs/vehicle/get';
import type { VehicleAPIInputT } from '../../../../typs/vehicle/get';

interface FilterSidebarProps {
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

// Single accent color used throughout the sidebar (was red-500).
const ACCENT = '#1B2F4B';

// ── Accordion section: on desktop every filter group is shown at once
// (no two-pane master/detail nav) since there's vertical room to spare.
// Sections start collapsed except Price, which is opened by default since
// it's the filter people reach for first.
const Section = ({
  title,
  isOpen,
  onToggle,
  badge,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  badge?: number;
  children: React.ReactNode;
}) => (
  <div className="border-b border-gray-100">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between px-4 py-3.5 text-left"
    >
      <span className="flex items-center gap-2 text-[13px] font-semibold text-[#2e054e]">
        {title}
        {!!badge && (
          <span
            style={{ backgroundColor: ACCENT }}
            className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white"
          >
            {badge}
          </span>
        )}
      </span>
      <ChevronDown
        size={15}
        className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    {isOpen && <div className="px-4 pb-4">{children}</div>}
  </div>
);

// ── Line-by-line checkbox row used for every "Options" filter group ──
const CheckboxRow = ({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) => (
  <label
    onClick={(e) => {
      e.preventDefault();
      onToggle();
    }}
    className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-2 text-[13px] font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50"
  >
    <span
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-150"
      style={{
        borderColor: checked ? ACCENT : '#d1d5db',
        backgroundColor: checked ? ACCENT : 'transparent',
      }}
    >
      {checked && <Check size={11} strokeWidth={3} className="text-white" />}
    </span>
    <span style={checked ? { color: ACCENT } : undefined}>{label}</span>
  </label>
);

const FilterSidebar = ({ onApply, vehicleData }: FilterSidebarProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Price: true,
  });
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [ranges, setRanges] = useState<RangeState>({ ...DEFAULT_RANGES });

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

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

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

  const handleApply = () => {
    const labelToKey = Object.fromEntries(
      STRING_FILTER_FIELDS.map(({ key, label }) => [label, key])
    );

    const params: VehicleAPIInputT = {};

    for (const [label, values] of Object.entries(selected)) {
      if (values.length === 0) continue;
      const apiKey = labelToKey[label] as keyof VehicleAPIInputT;
      if (apiKey) (params as any)[apiKey] = values.join(',');
    }

    const [pLo, pHi] = ranges['Price'];
    const [dPLo, dPHi] = DEFAULT_RANGES['Price'];
    if (pLo !== dPLo) params.min_price = pLo;
    if (pHi !== dPHi) params.max_price = pHi;

    const [kLo, kHi] = ranges['KM Driven'];
    const [dKLo, dKHi] = DEFAULT_RANGES['KM Driven'];
    if (kLo !== dKLo) params.min_km = kLo;
    if (kHi !== dKHi) params.max_km = kHi;

    const [oLo] = ranges['Owner Count'];
    const [dOLo] = DEFAULT_RANGES['Owner Count'];
    if (oLo !== dOLo) params.owner_count = oLo;

    const [yLo, yHi] = ranges['Reg. Year'];
    const [dYLo, dYHi] = DEFAULT_RANGES['Reg. Year'];
    if (yLo !== dYLo || yHi !== dYHi) params.registration_year = yLo;

    onApply(params);
  };

  const renderRangeBody = (cat: string) => {
    const [lo, hi] = ranges[cat];
    const [dlo, dhi] = DEFAULT_RANGES[cat as keyof typeof DEFAULT_RANGES];
    const fmt = RANGE_FORMATTERS[cat];
    const step = RANGE_STEPS[cat];

    if (cat === 'Owner Count') {
      return (
        <div>
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
              const active = lo === n;
              return (
                <button
                  key={n}
                  onClick={() =>
                    setRanges((prev) => ({ ...prev, 'Owner Count': [n, 5] }))
                  }
                  style={
                    active
                      ? {
                          borderColor: ACCENT,
                          backgroundColor: ACCENT,
                          color: '#fff',
                        }
                      : undefined
                  }
                  className={`rounded-full border px-3 py-1.5 text-[12px] transition ${
                    active
                      ? ''
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
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
              style={{ color: ACCENT }}
              className="mt-2 text-xs opacity-70 hover:opacity-100"
            >
              Reset
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex justify-between text-[12px] font-medium text-gray-700">
          <span>{fmt(lo)}</span>
          <span>{fmt(hi)}</span>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-400">Min</label>
          <input
            type="range"
            min={dlo}
            max={dhi}
            step={step}
            value={lo}
            onChange={(e) => setRange(cat, 0, Number(e.target.value))}
            className="w-full"
            style={{ accentColor: ACCENT }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-400">Max</label>
          <input
            type="range"
            min={dlo}
            max={dhi}
            step={step}
            value={hi}
            onChange={(e) => setRange(cat, 1, Number(e.target.value))}
            className="w-full"
            style={{ accentColor: ACCENT }}
          />
        </div>
        {(lo !== dlo || hi !== dhi) && (
          <button
            onClick={() =>
              setRanges((prev) => ({
                ...prev,
                [cat]: DEFAULT_RANGES[cat as keyof typeof DEFAULT_RANGES],
              }))
            }
            style={{ color: ACCENT }}
            className="text-xs opacity-70 hover:opacity-100"
          >
            Reset range
          </button>
        )}
      </div>
    );
  };

  return (
    <aside
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="sticky top-20 flex h-fit max-h-[calc(100vh-96px)] w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#ede8f5] bg-white shadow-[0_4px_18px_rgba(46,5,78,0.06)]"
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-2">
          <p className="text-[15px] font-bold text-[#2e054e]">Filters</p>
          {totalActive > 0 && (
            <span
              style={{ backgroundColor: ACCENT }}
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
            >
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button
            onClick={clearFilters}
            onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
            className="flex items-center gap-1 text-[11px] font-medium text-gray-400"
          >
            <RotateCcw size={11} />
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          Range
        </p>
        {RANGE_CATEGORIES.map((cat) => {
          const [lo, hi] = ranges[cat];
          const [dlo, dhi] = DEFAULT_RANGES[cat as keyof typeof DEFAULT_RANGES];
          const isDirty = lo !== dlo || hi !== dhi;
          return (
            <Section
              key={cat}
              title={cat}
              isOpen={!!openSections[cat]}
              onToggle={() => toggleSection(cat)}
              badge={isDirty ? 1 : 0}
            >
              {renderRangeBody(cat)}
            </Section>
          );
        })}

        {Object.keys(dynamicFilters).length > 0 && (
          <p className="px-4 pt-4 pb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
            Options
          </p>
        )}
        {Object.entries(dynamicFilters).map(([label, items]) => (
          <Section
            key={label}
            title={label}
            isOpen={!!openSections[label]}
            onToggle={() => toggleSection(label)}
            badge={(selected[label] ?? []).length}
          >
            {/* Line-by-line checkbox list instead of wrapped pill chips */}
            <div className="flex flex-col">
              {items.map((item) => (
                <CheckboxRow
                  key={item}
                  label={item}
                  checked={(selected[label] ?? []).includes(item)}
                  onToggle={() => toggleChip(label, item)}
                />
              ))}
            </div>
          </Section>
        ))}
      </div>

      <div className="border-t border-gray-100 p-4">
        <button
          onClick={handleApply}
          style={{ backgroundColor: ACCENT }}
          className="w-full rounded-lg py-2.5 text-[13px] font-semibold text-white transition-colors hover:opacity-90"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
