import { motion } from 'framer-motion';
import {
  MapPin,
  Navigation,
  ExternalLink,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';

interface AddressCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  link?: string;
  actionText?: string;
  index: number;
}

const AddressCard = ({
  icon: Icon,
  title,
  value,
  link,
  actionText,
  index,
}: AddressCardProps) => {
  const isLink = Boolean(link);
  const Wrapper = isLink ? motion.a : motion.div;

  return (
    <Wrapper
      {...(isLink
        ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group flex items-center gap-4 rounded-xl border border-white/40 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FFD9C9] to-[#CDC3FF] text-slate-700 transition-transform duration-200 group-hover:scale-105">
        <Icon size={20} strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
          {title}
        </p>
        <p className="truncate text-sm font-semibold text-slate-800">{value}</p>
      </div>

      {isLink ? (
        actionText ? (
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-slate-500 transition-colors group-hover:text-slate-700">
            {actionText}
            <ExternalLink
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        ) : (
          <ArrowUpRight
            size={18}
            className="flex-shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-500"
          />
        )
      ) : null}
    </Wrapper>
  );
};

const AddressDetails = () => {
  const officeAddress = 'Bhusawal Road, near Doordarshan Tower, Jalgaon';

  const addresses: Omit<AddressCardProps, 'index'>[] = [
    {
      icon: MapPin,
      title: 'Office Address',
      value: officeAddress,
    },
    {
      icon: Navigation,
      title: 'Google Maps',
      value: officeAddress,
      link: 'https://www.google.com/maps',
      actionText: 'Open',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-6 w-[95%] max-w-md rounded-2xl border border-gray-200 bg-gradient-to-br from-[#FFD9C9] to-[#CDC3FF] p-6 shadow-2xl"
    >
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white drop-shadow-md">
          Address Details
        </h2>
        <span className="rounded-full bg-white/30 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          Open on Maps
        </span>
      </div>
      <p className="mb-5 text-sm text-white/80">
        Find us here or get directions on the map.
      </p>

      <div className="flex flex-col gap-3">
        {addresses.map((address, index) => (
          <AddressCard key={address.title} {...address} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default AddressDetails;
