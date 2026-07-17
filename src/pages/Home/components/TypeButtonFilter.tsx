import { types } from '../constants';
import { motion } from 'framer-motion';

const TypeButtonFilter = ({
  activeType,
  setActiveType,
}: {
  activeType: string | null;
  setActiveType: (type: string | null) => void;
}) => {
  return (
    <div className="w-full">
      {/* Outer wrapper with subtle background */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        data-no-swipe="true"
        className="relative w-full"
      >
        {/* Left fade edge */}
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-8 bg-gradient-to-r from-white/80 to-transparent" />
        {/* Right fade edge */}
        <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-8 bg-gradient-to-l from-white/80 to-transparent" />

        {/* Scrollable pill track */}
        <div className="no-scrollbar flex touch-pan-x items-center gap-2.5 overflow-x-auto scroll-smooth px-1 py-2">
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
                className={`group relative flex h-10 flex-shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold tracking-wide transition-all duration-300 outline-none select-none ${
                  isActive
                    ? 'bg-gradient-to-br from-[#FF7272] via-[#ff8a5c] to-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/30'
                    : 'border border-[#ede8f5] bg-white/70 text-[#8b7aa0] backdrop-blur-sm hover:border-[#c9a8e0] hover:text-[#7c3aed] hover:shadow-sm'
                } `}
              >
                {/* Icon */}
                {type.icon && (
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'} `}
                  >
                    <img
                      src={type.icon}
                      alt={type.name}
                      className="h-4 w-4 object-contain"
                    />
                  </span>
                )}

                {/* Label */}
                <span className="whitespace-nowrap">{type.name}</span>

                {/* Active dot indicator */}
                {isActive && (
                  <motion.span
                    layoutId="activeDot"
                    className="h-1.5 w-1.5 rounded-full bg-white/80"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
          className="mt-1 ml-1 text-xs font-medium tracking-wide text-[#7c3aed]"
        >
          Filtering: {activeType}
        </motion.p>
      )}
    </div>
  );
};

export default TypeButtonFilter;
