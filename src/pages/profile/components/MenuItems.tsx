import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { staggerVariants } from '../constants/ProfileMenu';
import type { MenuItem as MenuItemType } from '../types/Profile';

interface Props {
  item: MenuItemType;
  hasBorder: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

const MenuItem = ({ item, hasBorder, isOpen, onToggle }: Props) => {
  const Icon = item.icon;

  return (
    <motion.div variants={staggerVariants.item}>
      <div
        onClick={onToggle}
        className={`group cursor-pointer transition-colors hover:bg-rose-50/60 ${
          hasBorder ? 'border-b border-gray-100' : ''
        }`}
      >
        <div className="flex items-center gap-3.5 px-4 py-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50 transition-colors group-hover:bg-pink-100">
            <Icon className="h-4.5 w-4.5 text-rose-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-600 text-[14px] text-gray-800">{item.label}</p>

            <p className="mt-0.5 text-[11px] text-gray-400">{item.desc}</p>
          </div>

          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        <AnimatePresence>
          {isOpen && item.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="overflow-hidden bg-gray-50"
            >
              {item.children.map((child) => (
                <div
                  key={child}
                  className="border-t border-gray-100 px-16 py-3 text-sm text-gray-600 hover:bg-gray-100"
                >
                  {child}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MenuItem;
