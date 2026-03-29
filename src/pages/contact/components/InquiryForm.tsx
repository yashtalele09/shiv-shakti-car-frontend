import { motion } from "framer-motion";
import { User, Mail, Phone, MessageSquare } from "lucide-react";

interface InputFieldProps {
  icon: any;
  type: string;
  placeholder: string;
}

const InputField = ({ icon: Icon, type, placeholder }: InputFieldProps) => {
  return (
    <div className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-[#AD93DE] transition-all">
      <Icon className="text-gray-400" size={18} />
      <input
        type={type}
        placeholder={placeholder}
        className="w-full outline-none text-sm"
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
      className="w-[95%] mx-auto mt-[-50px] bg-gradient-to-b from-[#FFD5D5] to-[#F1E6F9] shadow-2xl border border-gray-200 p-6 rounded-2xl">
      <p className="text-left text-2xl text-white font-bold drop-shadow-md">
        Inquiry Form
      </p>

      <div className="w-full flex flex-col gap-4 mt-6">
        <InputField icon={User} type="text" placeholder="Full Name" />
        <InputField icon={Mail} type="email" placeholder="Email Address" />
        <InputField icon={Phone} type="tel" placeholder="Phone Number" />

        <div className="w-full flex gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-[#AD93DE] transition-all">
          <MessageSquare className="text-gray-400 mt-1" size={18} />
          <textarea
            placeholder="Write your message..."
            className="w-full h-28 outline-none text-sm resize-none"
          />
        </div>

        <div className="w-full text-center mt-2">
          <button className="w-full md:w-1/2 h-11 rounded-full text-lg font-semibold shadow-md bg-[#FFA1A1] text-white hover:bg-[#ff8c8c] active:scale-95 transition-all">
            Inquire Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InquiryForm;
