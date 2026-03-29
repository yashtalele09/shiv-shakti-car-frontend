import { useState } from "react";
import { X } from "lucide-react";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

const filtersData = {
  "Car Name": ["X5", "Creta", "Swift", "City"],
  Brand: ["BMW", "Hyundai", "Honda", "Maruti"],
  Fuel: ["Petrol", "Diesel", "Electric"],
  Type: ["SUV", "Sedan", "Hatchback"],
  Transmission: ["Manual", "Automatic"],
  Owner: ["1st Owner", "2nd Owner", "3rd Owner"],
  Color: ["White", "Black", "Red", "Blue"],
  RTO: ["MH01", "MH02", "DL01", "KA01"],
  Seats: ["4", "5", "6", "7+"],
  Features: ["Sunroof", "Bluetooth", "Backup Camera", "Navigation"],
};

const FilterPanel = ({ isOpen, onClose, onApply }: FilterPanelProps) => {
  const categories = ["Price", ...Object.keys(filtersData)];

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selected, setSelected] = useState<string[]>([]);
  const [price, setPrice] = useState([0, 2000000]);

  const toggleFilter = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item],
    );
  };

  const clearFilters = () => {
    setSelected([]);
    setPrice([0, 2000000]);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-999 shadow-2xl transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
        <p className="text-lg font-semibold text-[#2e054e]">Filters</p>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex h-[calc(100%-140px)]">
        {/* LEFT SIDE */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full text-left px-4 py-3 text-sm border-l-4 transition ${
                activeCategory === cat
                  ? "bg-white border-red-500 font-medium"
                  : "border-transparent text-gray-600 hover:bg-gray-100"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-2/3 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-3 text-gray-500 uppercase">
            {activeCategory}
          </h3>

          {/* PRICE SLIDER */}
          {activeCategory === "Price" && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Select Price Range</p>

              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>₹{price[0].toLocaleString()}</span>
                <span>₹{price[1].toLocaleString()}</span>
              </div>

              <input
                type="range"
                min={0}
                max={2000000}
                step={50000}
                value={price[0]}
                onChange={(e) =>
                  setPrice([
                    Math.min(Number(e.target.value), price[1] - 50000),
                    price[1],
                  ])
                }
                className="w-full accent-red-500"
              />

              <input
                type="range"
                min={0}
                max={2000000}
                step={50000}
                value={price[1]}
                onChange={(e) =>
                  setPrice([
                    price[0],
                    Math.max(Number(e.target.value), price[0] + 50000),
                  ])
                }
                className="w-full accent-red-500 mt-2"
              />
            </div>
          )}

          {/* OPTIONS */}
          {activeCategory !== "Price" && (
            <div className="flex flex-wrap gap-2">
              {filtersData[activeCategory as keyof typeof filtersData]?.map(
                (item) => {
                  const isActive = selected.includes(item);

                  return (
                    <button
                      key={item}
                      onClick={() => toggleFilter(item)}
                      className={`px-4 py-2 rounded-full text-sm border transition ${
                        isActive
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      }`}>
                      {item}
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full border-t border-gray-200 bg-white p-4 flex gap-3">
        <button
          onClick={clearFilters}
          className="w-1/3 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-100">
          Clear
        </button>

        <button
          onClick={() => {
            onApply({
              selectedFilters: selected,
              priceRange: price,
            });
            onClose();
          }}
          className="w-2/3 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
