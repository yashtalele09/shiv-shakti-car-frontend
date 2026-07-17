import { brands } from '../constants';
import { motion } from 'framer-motion';

const BrandCarousel = () => {
  const allBrands = [...brands, ...brands, ...brands];

  return (
    <section className="w-full overflow-hidden bg-gradient-to-b from-[#fff1f5] via-[#ffe4ec] to-[#fff] py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 px-4 text-center"
      >
        <p className="mb-3 text-xs tracking-[0.25em] text-pink-400 uppercase">
          Trusted by top car brands
        </p>

        <h2 className="text-2xl leading-snug font-semibold text-gray-800 md:text-3xl">
          Shiv Shakti Car Bazar — <br />
          <span className="text-pink-400">
            your destination for buying &amp; selling cars
          </span>
        </h2>
      </motion.div>

      {/* Row 1 */}
      <div className="relative mb-4 overflow-hidden">
        {/* Fade edges */}
        <div className="absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-[#fff1f5] to-transparent" />
        <div className="absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-[#fff1f5] to-transparent" />

        <div className="animate-scrollLeft flex w-max gap-4 hover:[animation-play-state:paused]">
          {allBrands.map((brand, i) => (
            <div
              key={i}
              className="flex h-[70px] w-[130px] items-center justify-center rounded-xl border border-pink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.05] hover:shadow-lg hover:shadow-pink-200/50"
            >
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
        <div className="absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-[#fff1f5] to-transparent" />
        <div className="absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-[#fff1f5] to-transparent" />

        <div className="animate-scrollRight flex w-max gap-4 hover:[animation-play-state:paused]">
          {[...allBrands].reverse().map((brand, i) => (
            <div
              key={i}
              className="flex h-[70px] w-[130px] items-center justify-center rounded-xl border border-pink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.05] hover:shadow-lg hover:shadow-pink-200/50"
            >
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
        className="mt-12 flex flex-wrap items-center justify-center gap-10"
      >
        {[
          { value: '1000+', label: 'Cars Sold' },
          { value: '29', label: 'Years in Business' },
          { value: '10,000+', label: 'Happy Customers' },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-8">
            {i !== 0 && <div className="h-1 w-1 rounded-full bg-pink-300" />}

            <div className="text-center">
              <p className="text-xl font-semibold text-gray-800">
                {stat.value}
              </p>
              <p className="text-[10px] tracking-[0.15em] text-pink-400 uppercase">
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
