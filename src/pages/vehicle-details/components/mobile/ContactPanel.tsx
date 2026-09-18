import { useEffect, useState } from 'react';
import { X, Phone, Mail, MessageCircle, Copy, Check } from 'lucide-react';

interface ContactPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; // vehicle title, used in prefilled WhatsApp/email message
  email?: string | null;
  mobileNumber?: string | null;
  whatsappNumber?: string | null; // falls back to mobileNumber if not provided
}

const ContactPanel = ({
  isOpen,
  onClose,
  title,
  email,
  mobileNumber,
  whatsappNumber,
}: ContactPanelProps) => {
  const [copiedField, setCopiedField] = useState<'email' | 'mobile' | null>(
    null
  );

  // lock background scroll while panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // trigger enter transition on next tick
      const t = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(t);
    }
    setMounted(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const effectiveWhatsapp = whatsappNumber || mobileNumber;

  const handleCopy = (value: string, field: 'email' | 'mobile') => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    });
  };

  const handleCall = () => {
    if (mobileNumber) window.location.href = `tel:${mobileNumber}`;
  };

  const handleEmail = () => {
    if (email) {
      const subject = encodeURIComponent(`Enquiry about ${title}`);
      window.location.href = `mailto:${email}?subject=${subject}`;
    }
  };

  const handleWhatsapp = () => {
    if (effectiveWhatsapp) {
      const digits = effectiveWhatsapp.replace(/[^\d]/g, '');
      const message = encodeURIComponent(
        `Hi, I'm interested in the ${title}. Is it still available?`
      );
      window.open(`https://wa.me/${digits}?text=${message}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-end justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* sheet */}
      <div
        className={`relative z-10 w-full max-w-md rounded-t-3xl bg-white px-5 pt-4 pb-8 shadow-2xl transition-transform duration-300 ease-out ${
          mounted ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* drag handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-200" />

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#2e054e]">Contact Seller</h3>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 p-1.5 text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mb-4 truncate text-sm text-gray-500">{title}</p>

        <div className="flex flex-col gap-3">
          {/* Call */}
          {mobileNumber && (
            <button
              onClick={handleCall}
              className="flex items-center justify-between rounded-2xl bg-pink-50 p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#FF7272] p-2 text-white">
                  <Phone size={16} />
                </span>
                <div>
                  <p className="text-xs text-gray-400">Mobile Number</p>
                  <p className="text-sm font-semibold text-[#2e054e]">
                    {mobileNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(mobileNumber, 'mobile');
                }}
                className="rounded-full p-2 text-gray-400 hover:bg-white"
              >
                {copiedField === 'mobile' ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </button>
          )}

          {/* WhatsApp */}
          {effectiveWhatsapp && (
            <button
              onClick={handleWhatsapp}
              className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-left"
            >
              <span className="rounded-full bg-green-500 p-2 text-white">
                <MessageCircle size={16} />
              </span>
              <div>
                <p className="text-xs text-gray-400">WhatsApp</p>
                <p className="text-sm font-semibold text-[#2e054e]">
                  {effectiveWhatsapp}
                </p>
              </div>
            </button>
          )}

          {/* Email */}
          {email && (
            <button
              onClick={handleEmail}
              className="flex items-center justify-between rounded-2xl bg-blue-50 p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-blue-500 p-2 text-white">
                  <Mail size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="truncate text-sm font-semibold text-[#2e054e]">
                    {email}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(email, 'email');
                }}
                className="rounded-full p-2 text-gray-400 hover:bg-white"
              >
                {copiedField === 'email' ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </button>
          )}

          {!mobileNumber && !email && !effectiveWhatsapp && (
            <p className="py-4 text-center text-sm text-gray-400">
              No contact details available for this listing.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPanel;
