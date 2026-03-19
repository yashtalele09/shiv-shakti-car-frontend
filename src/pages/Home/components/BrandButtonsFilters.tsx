import { X } from "lucide-react";
import { brands } from "../constants";
import { useState } from "react";
import { createPortal } from "react-dom";

const BrandButtonsFilters = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div
      className="w-full overflow-hidden bg-gradient-to-br from-[#FFD9C9] to-[#CDC3FF] p-4 shadow-2xl mt-1"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
      }}>
      {/* Top Brands */}
      <div className="grid grid-cols-3 gap-4">
        {brands.slice(0, 9).map((brand, i) => (
          <div
            key={i}
            className="h-24 border border-gray-300 bg-white shadow-lg flex flex-col items-center justify-center gap-2 rounded-xl hover:shadow-xl transition">
            <img src={brand.logo} alt={brand.name} className="h-8" />
            <p className="text-sm font-medium">{brand.name}</p>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="w-full flex items-center justify-center mt-4">
        <button
          onClick={() => setShowAll(true)}
          className="w-[50%] bg-black text-white py-2 rounded-full hover:bg-gray-800 transition">
          View All Brands
        </button>
      </div>

      {/* Modal */}
      {showAll &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            {/* Popup Box */}
            <div className="bg-white w-[90%] bg-linear-to-br from-[#FFD9C9] to-[#CDC3FF] max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[80vh] animate-fadeIn">
              {/* Header */}
              <div className="flex justify-between items-center p-4">
                <h2 className="text-lg font-inter text-gray-500 font-semibold">
                  All Brands
                </h2>
                <button onClick={() => setShowAll(false)}>
                  <X size={22} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-4 overflow-y-auto">
                <div className="grid grid-cols-3 gap-4">
                  {brands.map((brand, i) => (
                    <div
                      key={i}
                      className="h-24 border border-gray-300 bg-white shadow-md flex flex-col items-center justify-center gap-2 rounded-xl hover:shadow-lg transition">
                      <img src={brand.logo} alt={brand.name} className="h-8" />
                      <p className="text-sm font-medium">{brand.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default BrandButtonsFilters;
