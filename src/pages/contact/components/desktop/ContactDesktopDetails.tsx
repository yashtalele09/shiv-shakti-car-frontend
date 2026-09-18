import { Mail, Phone, MessageCircle } from 'lucide-react';

interface ContactRowProps {
  icon: any;
  label: string;
  value: string;
  link?: string;
}

const ContactRow = ({ icon: Icon, label, value, link }: ContactRowProps) => {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C1502E]/10 text-[#C1502E]">
        <Icon size={17} />
      </div>
      <div>
        <p className="text-xs text-[#8A8578]">{label}</p>
        {link ? (
          <a
            href={link}
            className="text-sm font-medium text-[#1B2333] transition-colors hover:text-[#C1502E]"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium text-[#1B2333]">{value}</p>
        )}
      </div>
    </div>
  );
};

const ContactDetails = () => {
  return (
    <div className="w-full rounded-2xl border border-[#E4E1D9] bg-white p-7 md:p-9">
      <p className="text-lg font-bold text-[#1B2333] md:text-xl">
        Contact details
      </p>
      <div className="mt-2 divide-y divide-[#EDEAE2]">
        <ContactRow
          icon={Phone}
          label="Phone"
          value="+91 82089 63624"
          link="tel:+918208963624"
        />
        <ContactRow
          icon={Mail}
          label="Email"
          value="shivshakticarbazar@gmail.com"
          link="mailto:shivshakticarbazar@gmail.com"
        />
        <ContactRow
          icon={MessageCircle}
          label="WhatsApp"
          value="Chat with us"
          link="https://wa.me/918208963624"
        />
      </div>
    </div>
  );
};

export default ContactDetails;
