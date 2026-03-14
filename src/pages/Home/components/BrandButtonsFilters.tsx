import { brands } from "../constants";

const BrandButtonsFilters = () => {
  return (
    <div
      className="w-full overflow-hidden bg-linear-to-br from-[#FFD9C9] to-[#CDC3FF] p-4 shadow-2xl mt-1"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
      }}>
      <div className="grid grid-cols-3 gap-4">
        {brands.slice(0, 9).map((brand, i) => (
          <div
            key={i}
            className="h-25 border border-gray-300 bg-white shadow-lg flex flex-col items-center justify-center gap-2 rounded-lg">
            <img src={brand.logo} alt={brand.name} className="h-8" />
            <p className="text-sm font-medium">{brand.name}</p>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <button className="w-[40%] bg-black text-white py-2 rounded-full">
          View All Brands
        </button>
      </div>
    </div>
  );
};

export default BrandButtonsFilters;
