import { ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const RateUsCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.42, duration: 0.4 }}
    className="cursor-pointer rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 p-4 shadow-sm shadow-pink-200"
  >
    <div className="flex items-center gap-3">
      <Star className="h-5 w-5 fill-white text-white" />
      <div className="flex-1">
        <p className="font-600 text-[14px] text-white">Rate the App</p>
        <p className="mt-0.5 text-[11px] text-white/70">
          Enjoying the experience? Let us know!
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-white/70" />
    </div>
  </motion.div>
);

export default RateUsCard;
