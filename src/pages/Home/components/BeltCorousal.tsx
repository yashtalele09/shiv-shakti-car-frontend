import { brands } from "../constants";
import { motion } from "framer-motion";

const BrandCarousel = () => {
  const allBrands = [...brands, ...brands, ...brands];

  return (
    <section className="w-full py-16 bg-gradient-to-b from-[#fff1f5] via-[#ffe4ec] to-[#fff] overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 px-4">
        <p className="text-xs tracking-[0.25em] uppercase text-pink-400 mb-3">
          Trusted by industry leaders
        </p>

        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 leading-snug">
          Powering teams at the world’s <br />
          <span className="text-pink-400">most ambitious companies</span>
        </h2>
      </motion.div>

      {/* Row 1 */}
      <div className="relative overflow-hidden mb-4">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#fff1f5] to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#fff1f5] to-transparent z-10" />

        <div className="flex gap-4 w-max animate-scrollLeft hover:[animation-play-state:paused]">
          {allBrands.map((brand, i) => (
            <div
              key={i}
              className="w-[130px] h-[70px] flex items-center justify-center 
              rounded-xl border border-pink-100 bg-white shadow-sm
              hover:shadow-lg hover:shadow-pink-200/50
              transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-8 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#fff1f5] to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#fff1f5] to-transparent z-10" />

        <div className="flex gap-4 w-max animate-scrollRight hover:[animation-play-state:paused]">
          {[...allBrands].reverse().map((brand, i) => (
            <div
              key={i}
              className="w-[130px] h-[70px] flex items-center justify-center 
              rounded-xl border border-pink-100 bg-white shadow-sm
              hover:shadow-lg hover:shadow-pink-200/50
              transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-8 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center items-center gap-10 mt-12 flex-wrap">
        {[
          { value: "500+", label: "Companies" },
          { value: "98%", label: "Satisfaction" },
          { value: "40M+", label: "Users served" },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-8">
            {i !== 0 && <div className="w-1 h-1 rounded-full bg-pink-300" />}

            <div className="text-center">
              <p className="text-xl font-semibold text-gray-800">
                {stat.value}
              </p>
              <p className="text-[10px] tracking-[0.15em] uppercase text-pink-400">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Animations */}
      <style>
        {`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }

          @keyframes scrollRight {
            0% { transform: translateX(-33.333%); }
            100% { transform: translateX(0); }
          }

          .animate-scrollLeft {
            animation: scrollLeft 30s linear infinite;
          }

          .animate-scrollRight {
            animation: scrollRight 30s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default BrandCarousel;
