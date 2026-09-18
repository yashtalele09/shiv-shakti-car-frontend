import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onLogout?: () => void;
}

const LogoutCard = ({ onLogout }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.4 }}
    onClick={onLogout}
    className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm shadow-pink-100 transition-colors hover:bg-red-50/60"
  >
    <div className="flex items-center gap-3.5 px-4 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50">
        <LogOut className="h-4.5 w-4.5 text-red-400" />
      </div>
      <p className="font-600 flex-1 text-[14px] text-red-400">Log Out</p>
    </div>
  </motion.div>
);

export default LogoutCard;
