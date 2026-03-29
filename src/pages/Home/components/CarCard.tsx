import { useState } from "react";
import Card from "../../../assets/banner.png";
import { Heart, Fuel, Gauge, Calendar } from "lucide-react";

interface CarCardProps {
  title?: string;
  price?: string;
  fuel?: string;
  transmission?: string;
  km?: string;
  year?: string;
  image?: string;
}

const CarCard = ({
  title = "2016 Maruti Suzuki Swift",
  price = "₹ 5.50 Lakh",
  fuel = "Petrol",
  transmission = "Manual",
  km = "10,000 KM",
  year = "2016",
  image = Card,
}: CarCardProps) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex-shrink-0 w-[200px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-[120px]">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 bg-white w-7 h-7 rounded-full flex items-center justify-center shadow">
          <Heart
            size={14}
            className={liked ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-800 truncate">
          {title}
        </p>

        <div className="flex flex-wrap gap-1">
          {[
            { icon: <Fuel size={10} />, label: fuel },
            { icon: <Gauge size={10} />, label: transmission },
            { icon: <Calendar size={10} />, label: year },
          ].map((s, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md">
              {s.icon} {s.label}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <p className="text-[13px] font-bold text-gray-900">{price}</p>
          <button className="text-[11px] font-medium text-[#B85D5D] hover:underline">
            View →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
