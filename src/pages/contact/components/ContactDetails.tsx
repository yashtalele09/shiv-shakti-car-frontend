import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle } from 'lucide-react';

interface ContactCardProps {
  icon: any;
  title: string;
  value: string;
  link: string;
}

const ContactCard = ({ icon: Icon, title, value, link }: ContactCardProps) => {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
          <Icon size={20} />
        </div>
        <p className="text-md font-semibold text-slate-800">{title}</p>
      </div>

      <div className="mt-3 text-center">
        {link ? (
          <a
            href={link}
            className="text-slate-500 transition-colors hover:text-indigo-600"
          >
            {value}
          </a>
        ) : (
          <p className="text-slate-500">{value}</p>
        )}
      </div>
    </div>
  );
};

const ContactDetails = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-6 w-[95%] rounded-2xl border border-gray-200 bg-gradient-to-br from-[#FFD9C9] to-[#CDC3FF] p-6 shadow-2xl"
    >
      <p className="text-left text-xl font-bold text-white drop-shadow-md">
        Contact Details
      </p>

      <div className="mt-6 flex w-full flex-col gap-4">
        <ContactCard
          icon={Mail}
          title="Email"
          value="shivshakticarbazar@gmail.com"
          link="mailto:shivshakticarbazar@gmail.com"
        />

        <ContactCard
          icon={Phone}
          title="Phone Number"
          value="+91 8208963624"
          link="tel:+918208963624"
        />

        <ContactCard
          icon={MessageCircle}
          title="WhatsApp"
          value="Chat on WhatsApp"
          link="https://wa.me/918208963624"
        />
      </div>
    </motion.div>
  );
};

export default ContactDetails;
