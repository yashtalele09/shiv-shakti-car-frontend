import { motion } from 'framer-motion';
import { types } from '../../constants';

interface TypeButtonsProps {
  activeType: string | null;
  setActiveType: (type: string | null) => void;
}

const TypeButtons = ({ activeType, setActiveType }: TypeButtonsProps) => {
  return (
    <section className="mx-auto mt-8 w-full max-w-7xl px-4 sm:w-[90%] sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        role="tablist"
        aria-label="Filter by type"
        className="relative flex h-14 w-full items-center gap-1.5 overflow-x-auto rounded-2xl border border-[#E7EBF1] bg-white/85 p-1.5 shadow-[0_1px_1px_rgba(15,23,42,0.03),0_16px_40px_-16px_rgba(15,23,42,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl sm:h-16 sm:gap-2 sm:p-2"
      >
        {types.map((type) => {
          const isActive = activeType === type.name;

          return (
            <motion.button
              key={type.name}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveType(type.name)}
              whileHover={{ y: isActive ? 0 : -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={`group relative flex h-full flex-shrink-0 items-center justify-center gap-1.5 rounded-xl px-6 text-sm font-medium whitespace-nowrap transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#1B2F4B]/40 focus-visible:ring-offset-2 sm:flex-1 sm:px-5 ${
                isActive ? 'text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 34,
                  }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#243B5C] via-[#1B2F4B] to-[#0F1F35] shadow-[0_8px_20px_-6px_rgba(15,23,42,0.5),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)]"
                >
                  <div className="absolute inset-x-2 top-[2px] h-1/2 rounded-full bg-gradient-to-b from-white/20 to-transparent" />
                </motion.div>
              )}

              {!isActive && (
                <span className="absolute inset-0 rounded-xl bg-transparent transition-colors duration-300 group-hover:bg-[#F1F4F8]" />
              )}

              <span
                className={`relative z-10 h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  isActive
                    ? 'bg-[#C9972D]'
                    : 'bg-slate-300 group-hover:bg-[#1B2F4B]/50'
                }`}
              />
              <span className="relative z-10 tracking-wide">{type.name}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
};

export default TypeButtons;
