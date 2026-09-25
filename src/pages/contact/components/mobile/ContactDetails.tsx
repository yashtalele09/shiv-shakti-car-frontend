import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MessageCircle,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  link: string;
  index: number;
}

const ContactCard = ({
  icon: Icon,
  title,
  value,
  link,
  index,
}: ContactCardProps) => {
  return (
    <motion.a
      href={link}
      target={link.startsWith('http') ? '_blank' : undefined}
      rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
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

      <ArrowUpRight
        size={18}
        className="flex-shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-500"
      />
    </motion.a>
  );
};

const ContactDetails = () => {
  const contacts: Omit<ContactCardProps, 'index'>[] = [
    {
      icon: Mail,
      title: 'Email',
      value: 'shivshakticarbazar@gmail.com',
      link: 'mailto:shivshakticarbazar@gmail.com',
    },
    {
      icon: Phone,
      title: 'Phone Number',
      value: '+91 82089 63624',
      link: 'tel:+918208963624',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: 'Chat with us',
      link: 'https://wa.me/918208963624',
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
          Contact Details
        </h2>
        <span className="rounded-full bg-white/30 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          We usually reply fast
        </span>
      </div>
      <p className="mb-5 text-sm text-white/80">
        Reach out directly — we're happy to help with any questions.
      </p>

      <div className="flex flex-col gap-3">
        {contacts.map((contact, index) => (
          <ContactCard key={contact.title} {...contact} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default ContactDetails;
