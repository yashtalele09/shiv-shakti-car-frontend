import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

const MobileFooter = () => {
  const links = ['Home', 'Browse Cars', 'Sell Your Car', 'About Us'];
  const services = [
    'Car Inspection',
    'Documentation Help',
    'Loan Assistance',
    'Doorstep Delivery',
  ];

  return (
    <footer className="w-full border-t-2 border-pink-200 bg-pink-50 px-6 pt-10 pb-6">
      {/* Brand */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-6 w-1 rounded-full bg-pink-500" />
          <h2 className="text-lg font-bold tracking-tight text-pink-900">
            Shiv Shakti Car Bazar
          </h2>
        </div>
        <p className="pl-3 text-sm leading-relaxed text-pink-500">
          Your trusted partner for quality pre-owned vehicles. Transparent
          pricing, verified cars, and seamless service.
        </p>
      </div>

      {/* Links & Services */}
      <div className="mb-8 grid grid-cols-2 gap-6">
        <div>
          <h3 className="mb-3 text-xs font-semibold tracking-widest text-pink-400 uppercase">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2.5">
            {links.map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="text-sm text-pink-700 transition-colors duration-150 hover:text-pink-500"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold tracking-widest text-pink-400 uppercase">
            Services
          </h3>
          <ul className="flex flex-col gap-2.5">
            {services.map((s) => (
              <li key={s} className="text-sm text-pink-700">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-6 h-px bg-pink-200" />

      {/* Contact */}
      <div className="mb-6 flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-widest text-pink-400 uppercase">
          Contact
        </h3>
        {[
          { Icon: Phone, text: '+91 98765 43210' },
          { Icon: Mail, text: 'support@shivshakti.com' },
          { Icon: MapPin, text: 'Nashik, Maharashtra, India' },
        ].map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <Icon size={14} className="flex-shrink-0 text-pink-400" />
            <span className="text-sm text-pink-700">{text}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="mb-5 h-px bg-pink-200" />

      {/* Bottom */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-pink-400">
          © {new Date().getFullYear()} Shiv Shakti Car Bazar
        </p>
        <div className="flex items-center gap-3">
          {[Facebook, Instagram, Twitter].map((Icon, i) => (
            <button
              key={i}
              className="text-pink-300 transition-colors duration-150 hover:text-pink-500"
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
