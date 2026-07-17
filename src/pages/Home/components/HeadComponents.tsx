import Search from '../../../components/mobail-components/mobail-header/Search';
import car from '../../../assets/cars.jpg';
import { motion } from 'framer-motion';

const HeadComponents = () => {
  return (
    <div
      className="relative h-[50vh] w-full overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${car})` }}
    >
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD9C9]/80 via-[#E8D8FF]/70 to-[#CDC3FF]/80 backdrop-blur-[2px]" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-4 text-center"
      >
        {/* Search */}
        <div className="flex w-full max-w-md items-center justify-center">
          <Search />
        </div>

        {/* Heading */}
        <h1 className="text-[20px] font-semibold tracking-wide text-[#2D1E4A] drop-shadow-sm md:text-[24px]">
          Shiv Shakti Car Bazar
        </h1>

        {/* Subtext */}
        <p className="max-w-xs text-[13px] leading-relaxed text-[#4A4A4A] md:text-[14px]">
          Discover your perfect ride at unbeatable prices. Buy, sell, and
          explore trusted car listings with confidence.
        </p>

        {/* CTA Button */}
        <button className="rounded-full bg-gradient-to-r from-[#2D1E4A] to-[#4B3A73] px-6 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105">
          Explore Cars
        </button>
      </motion.div>
    </div>
  );
};

export default HeadComponents;
