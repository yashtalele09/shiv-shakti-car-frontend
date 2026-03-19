import { types } from "../constants";
import { motion } from "framer-motion";

const TypeButtonFilter = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      data-no-swipe="true"
      className="w-full flex mt-2 flex-nowrap items-center overflow-x-auto gap-3 px-2 rounded-2xl h-20 scroll-smooth touch-pan-x no-scrollbar bg-pink-100">
      {types.map((type) => (
        <button
          key={type.name}
          className="min-w-[120px] h-[70%] border border-gray-200 rounded-xl flex-shrink-0 bg-linear-to-b from-[#FFA1A1] to-[#253C6F] text-white font-bold transition-all duration-300 text-sm shadow-lg active:scale-95 flex items-center justify-center gap-2 px-2">
          {type.icon && (
            <img
              src={type.icon}
              alt={type.name}
              className="w-6 h-6 object-contain"
            />
          )}
          {type.name}
        </button>
      ))}
    </motion.div>
  );
};

export default TypeButtonFilter;
