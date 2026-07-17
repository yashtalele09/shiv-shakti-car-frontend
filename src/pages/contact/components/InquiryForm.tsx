import { motion } from 'framer-motion';
import { User, Mail, Phone, MessageSquare } from 'lucide-react';

interface InputFieldProps {
  icon: any;
  type: string;
  placeholder: string;
}

const InputField = ({ icon: Icon, type, placeholder }: InputFieldProps) => {
  return (
    <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#AD93DE]">
      <Icon className="text-gray-400" size={18} />
      <input
        type={type}
        placeholder={placeholder}
        className="w-full text-sm outline-none"
      />
    </div>
  );
};

const InquiryForm = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-[-50px] w-[95%] rounded-2xl border border-gray-200 bg-gradient-to-b from-[#FFD5D5] to-[#F1E6F9] p-6 shadow-2xl"
    >
      <p className="text-left text-2xl font-bold text-white drop-shadow-md">
        Inquiry Form
      </p>

      <div className="mt-6 flex w-full flex-col gap-4">
        <InputField icon={User} type="text" placeholder="Full Name" />
        <InputField icon={Mail} type="email" placeholder="Email Address" />
        <InputField icon={Phone} type="tel" placeholder="Phone Number" />

        <div className="flex w-full gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#AD93DE]">
          <MessageSquare className="mt-1 text-gray-400" size={18} />
          <textarea
            placeholder="Write your message..."
            className="h-28 w-full resize-none text-sm outline-none"
          />
        </div>

        <div className="mt-2 w-full text-center">
          <button className="h-11 w-full rounded-full bg-[#FFA1A1] text-lg font-semibold text-white shadow-md transition-all hover:bg-[#ff8c8c] active:scale-95 md:w-1/2">
            Inquire Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InquiryForm;
