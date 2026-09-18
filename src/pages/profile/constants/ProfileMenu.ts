import {
  Heart,
  MessageSquare,
  Phone,
  LayoutDashboard,
  Clock3,
  FileText,
  Car,
  Bell,
  HelpCircle,
  User,
} from 'lucide-react';
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

export const mainItems = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
  },
  {
    label: 'Saved Cars',
    icon: Heart,
    count: 12,
  },
  {
    label: 'Recently Viewed',
    icon: Clock3,
  },
  {
    label: 'My Enquiries',
    icon: FileText,
    count: 8,
  },
  {
    label: 'My Listings',
    icon: Car,
    count: 2,
  },
];

export const accountItems = [
  {
    label: 'Edit Profile',
    icon: User,
  },
  {
    label: 'Notifications',
    icon: Bell,
  },
  {
    label: 'Help & Support',
    icon: HelpCircle,
  },
];
