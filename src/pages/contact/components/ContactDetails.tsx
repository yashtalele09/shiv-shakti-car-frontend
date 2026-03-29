import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle } from "lucide-react";

interface ContactCardProps {
  icon: any;
  title: string;
  value: string;
  link: string;
}

const ContactCard = ({ icon: Icon, title, value, link }: ContactCardProps) => {
  return (
    <div className="w-full p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-[#f3e8ff] text-[#7c3aed]">
          <Icon size={20} />
        </div>
        <p className="text-md text-[#2e054e] font-semibold">{title}</p>
      </div>

      <div className="mt-3 text-center">
        {link ? (
          <a
            href={link}
            className="text-gray-600 hover:text-[#7c3aed] transition-colors">
            {value}
          </a>
        ) : (
          <p className="text-gray-600">{value}</p>
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
      className="w-[95%] mx-auto mt-6 bg-gradient-to-b from-[#FFD5D5] to-[#F1E6F9] shadow-2xl border border-gray-200 p-6 rounded-2xl">
      <p className="text-left text-xl text-white font-bold drop-shadow-md">
        Contact Details
      </p>

      <div className="w-full flex flex-col gap-4 mt-6">
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
