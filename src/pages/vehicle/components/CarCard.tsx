import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Fuel,
  Settings2,
  Gauge,
  Calendar,
  MapPin,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Replace these with your actual asset imports:
// import car from "../../../assets/car-costomer.png";
// import hyundai from "../../../assets/brands/hyundai.svg";

const CarCard = () => {
  const [liked, setLiked] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [likeAnim, setLikeAnim] = useState(false);

  // Placeholder image array – replace with real images
  const images = [
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80",
  ];

  const handleLike = () => {
    setLiked(!liked);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
  };

  const prev = () =>
    setCurrentImage((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrentImage((i) => (i + 1) % images.length);

  const specs = [
    { icon: Fuel, label: "Petrol" },
    { icon: Settings2, label: "Automatic" },
    { icon: Gauge, label: "12,000 km" },
    { icon: Calendar, label: "2016" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="relative w-[95%] rounded-2xl overflow-hidden bg-white shadow-[0_8px_32px_rgba(46,5,78,0.10)] border border-[#ede8f5]">
      {/* ── Image Section ── */}
      <div className="relative h-[195px] overflow-hidden bg-[#f5f0fb] group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            alt="Car"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.38, ease: "easeInOut" }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0330]/50 via-transparent to-transparent pointer-events-none" />

        {/* Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[#2e054e] text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
          <Shield size={10} className="text-[#7c3aed]" />
          Verified
        </div>

        {/* Wishlist */}
        <motion.button
          onClick={handleLike}
          animate={likeAnim ? { scale: [1, 1.4, 0.9, 1] } : {}}
          transition={{ duration: 0.35 }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition">
          <Heart
            size={18}
            className={`transition-all duration-300 ${
              liked ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
          />
        </motion.button>

        {/* Arrows – visible on hover */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-105">
          <ChevronLeft size={16} className="text-[#2e054e]" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-105">
          <ChevronRight size={16} className="text-[#2e054e]" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentImage ? "w-4 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Content Section ── */}
      <div className="px-4 pt-3.5 pb-4 flex flex-col gap-3">
        {/* Title + Location */}
        <div>
          <h3 className="text-[15px] font-bold text-[#1a0330] leading-snug tracking-[-0.2px]">
            2016 Maruti Suzuki Baleno
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={11} className="text-[#9b72cf]" />
            <span className="text-[11px] text-[#8b7aa0]">
              Mumbai, Maharashtra
            </span>
          </div>
        </div>

        {/* Specs Pills */}
        <div className="grid grid-cols-4 gap-1.5">
          {specs.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 bg-[#f7f3ff] rounded-xl py-2 px-1">
              <Icon size={13} className="text-[#FF7272]" />
              <span className="text-[9.5px] font-medium text-[#4a2d6b] leading-none">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Brand + Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Replace <img src={hyundai}> with your SVG import */}
            <div className="w-8 h-8 rounded-full bg-[#f0ebfa] flex items-center justify-center overflow-hidden border border-[#e2d9f5]">
              <span className="text-[9px] font-bold text-[#FF7272]">HYN</span>
            </div>
            <div>
              <p className="text-[11px] text-[#8b7aa0] leading-none">Brand</p>
              <p className="text-[13px] font-semibold text-[#2e054e]">
                Hyundai
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#8b7aa0] leading-none">Price</p>
            <p className="text-[17px] font-bold text-[#2e054e] tracking-tight">
              ₹ 5.50 L
            </p>
          </div>
        </div>

        {/* Divider + CTA */}
        <div className="border-t border-[#ede8f5] pt-3 flex gap-2">
          <button className="flex-1 py-2 rounded-xl border border-[#c9a8e0] text-[#FF7272] text-[12px] font-semibold hover:bg-[#f7f3ff] transition-colors duration-200">
            Save
          </button>
          <button className="flex-1 py-2 rounded-xl bg-[#FF7272] text-white text-[12px] font-semibold hover:bg-[#4a0e7a] active:scale-[0.98] transition-all duration-200 shadow-[0_2px_12px_rgba(46,5,78,0.25)]">
            View Details
          </button>
        </div>
      </div>

      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#e8ddf7]/60 pointer-events-none" />
    </motion.div>
  );
};

export default CarCard;
