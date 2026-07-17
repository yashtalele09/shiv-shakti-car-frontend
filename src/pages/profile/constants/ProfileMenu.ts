import { Heart, MessageSquare, Phone } from 'lucide-react';
import type { MenuItem } from '../types/Profile';

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'My Reviews',
    icon: MessageSquare,
    desc: 'Manage your reviews',
    children: ['Review #1', 'Review #2', 'Review #3'],
  },
  {
    label: 'Contacts Status',
    icon: Phone,
    desc: 'View Contacts Status',
    children: ['Pending', 'Contacted', 'Completed'],
  },
  {
    label: 'Saved Cars',
    icon: Heart,
    desc: 'Your favourite vehicles',
    children: ['Hyundai Creta', 'Kia Seltos', 'Honda City'],
  },
];

export const staggerVariants = {
  container: {
    animate: { transition: { staggerChildren: 0.07 } },
  },
  item: {
    initial: { opacity: 0, y: 14 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
    },
  },
};
