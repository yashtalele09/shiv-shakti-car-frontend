import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const MobileFooter = () => {
  const links = ["Home", "Browse Cars", "Sell Your Car", "About Us"];
  const services = [
    "Car Inspection",
    "Documentation Help",
    "Loan Assistance",
    "Doorstep Delivery",
  ];

  return (
    <footer className="w-full bg-pink-50 border-t-2 border-pink-200 px-6 pt-10 pb-6">
      {/* Brand */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-pink-500 rounded-full" />
          <h2 className="text-pink-900 font-bold text-lg tracking-tight">
            Shiv Shakti Car Bazar
          </h2>
        </div>
        <p className="text-pink-500 text-sm leading-relaxed pl-3">
          Your trusted partner for quality pre-owned vehicles. Transparent
          pricing, verified cars, and seamless service.
        </p>
      </div>

      {/* Links & Services */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-pink-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2.5">
            {links.map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="text-pink-700 text-sm hover:text-pink-500 transition-colors duration-150">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-pink-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Services
          </h3>
          <ul className="flex flex-col gap-2.5">
            {services.map((s) => (
              <li key={s} className="text-pink-700 text-sm">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-pink-200 mb-6" />

      {/* Contact */}
      <div className="flex flex-col gap-3 mb-6">
        <h3 className="text-pink-400 text-xs font-semibold uppercase tracking-widest">
          Contact
        </h3>
        {[
          { Icon: Phone, text: "+91 98765 43210" },
          { Icon: Mail, text: "support@shivshakti.com" },
          { Icon: MapPin, text: "Nashik, Maharashtra, India" },
        ].map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <Icon size={14} className="text-pink-400 flex-shrink-0" />
            <span className="text-pink-700 text-sm">{text}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-pink-200 mb-5" />

      {/* Bottom */}
      <div className="flex items-center justify-between">
        <p className="text-pink-400 text-xs">
          © {new Date().getFullYear()} Shiv Shakti Car Bazar
        </p>
        <div className="flex items-center gap-3">
          {[Facebook, Instagram, Twitter].map((Icon, i) => (
            <button
              key={i}
              className="text-pink-300 hover:text-pink-500 transition-colors duration-150">
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
