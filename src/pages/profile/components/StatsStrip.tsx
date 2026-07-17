import { motion } from 'framer-motion';
import type { Stat } from '../types/Profile';

interface Props {
  stats: Stat[];
}

const StatsStrip = ({ stats }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15, duration: 0.45 }}
    className="relative mt-6 flex gap-3"
  >
    {stats.map((s) => (
      <div
        key={s.label}
        className="flex-1 rounded-xl bg-white/20 p-3 text-center backdrop-blur-sm"
      >
        <p className="font-700 text-[18px] leading-none text-white">
          {s.value}
        </p>
        <p className="mt-1 text-[11px] text-white/70">{s.label}</p>
      </div>
    ))}
  </motion.div>
);

export default StatsStrip;
