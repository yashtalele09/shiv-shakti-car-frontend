import Card from "../../../assets/banner.png";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

const CarCard = () => {
  return (
    <div className="h-[90%] rounded-lg w-[70%] bg-white border border-gray-200 shadow-lg shrink-0">
      {/* Image Section */}
      <div className="h-[54%] p-1 relative">
        <img
          src={Card}
          alt=""
          className="w-full h-full object-cover rounded-lg"
        />

        {/* Like Button */}
        <button className="absolute top-3 right-3 bg-white/50 p-1 rounded-full shadow hover:bg-white">
          <Heart size={18} className="text-gray-600 hover:text-red-500" />
        </button>

        {/* Left Arrow */}
        <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/40 p-1 rounded-full shadow hover:bg-white">
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        {/* Right Arrow */}
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/40 p-1 rounded-full shadow hover:bg-white">
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Content Section */}
      <div className="h-[46%] flex flex-col gap-2 px-2">
        <h1 className="text-md text-gray-900 font-semibold font-inter truncate">
          2016 Maruti Suzuki Swift
        </h1>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400 font-inter">Petrol</p>
          <p className="text-sm text-gray-400 font-inter">Manual</p>
          <p className="text-sm text-gray-400 font-inter">10,000 KM</p>
          <p className="text-sm text-gray-400 font-inter">2016</p>
        </div>

        <div className="flex items-center justify-end">
          <p className="text-sm text-orange-500 font-semibold font-inter">
            ₹ 5.50 Lakhs
          </p>
        </div>

        <div className="w-full h-[1px] bg-gray-200"></div>

        <div className="w-full flex pb-2 items-center justify-center">
          <button className="w-1/2 text-orange-600 hover:text-orange-700 font-medium transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
