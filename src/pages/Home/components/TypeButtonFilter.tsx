import { useState } from "react";
import { types } from "../constants";
import { motion } from "framer-motion";

const TypeButtonFilter = () => {
  const [activeType, setActiveType] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Outer wrapper with subtle background */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        data-no-swipe="true"
        className="relative w-full">
        {/* Left fade edge */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-8 z-10 bg-gradient-to-r from-white/80 to-transparent" />
        {/* Right fade edge */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 z-10 bg-gradient-to-l from-white/80 to-transparent" />

        {/* Scrollable pill track */}
        <div className="flex items-center gap-2.5 overflow-x-auto scroll-smooth touch-pan-x no-scrollbar py-2 px-1">
          {types.map((type, index) => {
            const isActive = activeType === type.name;
            return (
              <motion.button
                key={type.name}
                onClick={() => setActiveType(isActive ? null : type.name)}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileTap={{ scale: 0.93 }}
                className={`
                  relative flex-shrink-0 h-10 px-4 rounded-full flex items-center gap-2
                  text-sm font-semibold tracking-wide transition-all duration-300
                  outline-none select-none group
                  ${
                    isActive
                      ? "bg-gradient-to-br from-rose-400 via-pink-500 to-indigo-600 text-white shadow-lg shadow-pink-300/40"
                      : "bg-white/70 backdrop-blur-sm border border-gray-200/80 text-gray-500 hover:border-pink-300 hover:text-pink-500 hover:shadow-sm"
                  }
                `}>
                {/* Icon */}
                {type.icon && (
                  <span
                    className={`
                      flex items-center justify-center w-5 h-5 rounded-full
                      transition-all duration-300
                      ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-90"}
                    `}>
                    <img
                      src={type.icon}
                      alt={type.name}
                      className="w-4 h-4 object-contain"
                    />
                  </span>
                )}

                {/* Label */}
                <span className="whitespace-nowrap">{type.name}</span>

                {/* Active dot indicator */}
                {isActive && (
                  <motion.span
                    layoutId="activeDot"
                    className="w-1.5 h-1.5 rounded-full bg-white/80"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Active label (optional, shows what's selected) */}
      {activeType && (
        <motion.p
          key={activeType}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1 ml-1 text-xs text-pink-400 font-medium tracking-wide">
          Filtering: {activeType}
        </motion.p>
      )}
    </div>
  );
};

export default TypeButtonFilter;
