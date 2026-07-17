import type { LucideIcon } from 'lucide-react';

export interface User {
  name: string;
  phone: string;
  avatar: string;
  memberSince: string;
  rides: number;
  rating: number;
  savedCars: number;
}

export interface Stat {
  label: string;
  value: number | string;
}

export interface MenuItem {
  label: string;
  icon: LucideIcon;
  desc: string;
  children?: string[];
}
