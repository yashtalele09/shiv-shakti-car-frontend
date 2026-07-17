import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerVariants } from '../constants/ProfileMenu';
import type { MenuItem as MenuItemType } from '../types/Profile';
import MenuItem from './MenuItems';

interface Props {
  items: MenuItemType[];
}

const MenuCard = ({ items }: Props) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <motion.div
      variants={staggerVariants.container}
      initial="initial"
      animate="animate"
      className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-pink-100"
    >
      {items.map((item, index) => (
        <MenuItem
          key={item.label}
          item={item}
          hasBorder={index !== items.length - 1}
          isOpen={openItem === item.label}
          onToggle={() =>
            setOpenItem(openItem === item.label ? null : item.label)
          }
        />
      ))}
    </motion.div>
  );
};

export default MenuCard;
