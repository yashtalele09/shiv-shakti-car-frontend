import Search from "../../../components/mobail-components/mobail-header/Search";
import car from "../../../assets/cars.jpg";
import { motion } from "framer-motion";

const HeadComponents = () => {
  return (
    <div
      className="w-full relative h-[50vh] bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${car})` }}>
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD9C9]/80 via-[#E8D8FF]/70 to-[#CDC3FF]/80 backdrop-blur-[2px]" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center gap-4">
        {/* Search */}
        <div className="w-full flex items-center justify-center max-w-md">
          <Search />
        </div>

        {/* Heading */}
        <h1 className="text-[20px] md:text-[24px] font-semibold text-[#2D1E4A] tracking-wide drop-shadow-sm">
          Shiv Shakti Car Bazar
        </h1>

        {/* Subtext */}
        <p className="text-[13px] md:text-[14px] text-[#4A4A4A] max-w-xs leading-relaxed">
          Discover your perfect ride at unbeatable prices. Buy, sell, and
          explore trusted car listings with confidence.
        </p>

        {/* CTA Button */}
        <button className="px-6 py-2 bg-gradient-to-r from-[#2D1E4A] to-[#4B3A73] text-white text-sm font-medium rounded-full shadow-md hover:scale-105 transition-all duration-300">
          Explore Cars
        </button>
      </motion.div>
    </div>
  );
};

export default HeadComponents;
