import { useState } from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  Car,
} from 'lucide-react';
import logoimg from '../../../assets/logdumy.png';

const MobailFooter = () => {
  const [logoFailed, setLogoFailed] = useState(false);

  const links = ['Home', 'Browse Cars', 'Sell Your Car', 'About Us'];
  const services = [
    'Car Inspection',
    'Documentation Help',
    'Loan Assistance',
    'Doorstep Delivery',
  ];
  const legal = ['Privacy Policy', 'Terms of Service', 'Refund Policy'];

  const contact = [
    { Icon: Phone, text: '+91 98765 43210', href: 'tel:+919876543210' },
    {
      Icon: Mail,
      text: 'shivshakticarbaza@gmail.com',
      href: 'mailto:shivshakticarbazar@gmail.com',
    },
    {
      Icon: MapPin,
      text: 'Trimbak Road, Nashik, Maharashtra 422101',
      href: 'https://maps.google.com/?q=Nashik+Maharashtra',
    },
    { Icon: Clock, text: 'Mon-Sat, 10:00 AM - 8:00 PM', href: null },
  ];

  const socials = [
    { Icon: Facebook, label: 'Facebook', href: '#' },
    { Icon: Instagram, label: 'Instagram', href: '#' },
    { Icon: Twitter, label: 'Twitter', href: '#' },
  ];

  return (
    <footer className="w-full bg-linear-to-r from-[#02061D] to-[#002F54]">
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-600" />

      <div className="mx-auto max-w-7xl px-6 pt-14 pb-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.1fr]">
          {/* Brand */}
          <div>
            <a href="/" className="mb-4 flex items-center gap-3">
              {!logoFailed ? (
                <span className="flex items-center gap-3 rounded-xl bg-white p-1">
                  <img
                    src={logoimg}
                    alt="Shri Shivshakti Car Bazar logo"
                    onError={() => setLogoFailed(true)}
                    className="h-14 w-14 flex-shrink-0 rounded-xl object-contain"
                  />
                </span>
              ) : (
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-950/50">
                  <Car size={22} className="text-white" strokeWidth={2.25} />
                </span>
              )}
              <span className="flex flex-col leading-tight">
                <span className="text-base font-bold tracking-tight text-white">
                  Shri Shivshakti
                </span>
                <span className="text-xs font-semibold tracking-[0.2em] text-indigo-400 uppercase">
                  Car Bazar
                </span>
              </span>
            </a>

            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Your trusted partner for quality pre-owned vehicles. Transparent
              pricing, verified cars, and seamless service - every time.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-150 hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-widest text-slate-500 uppercase">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="group inline-flex items-center gap-1 text-sm text-slate-400 transition-colors duration-150 hover:text-indigo-400"
                  >
                    {l}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-widest text-slate-500 uppercase">
              Services
            </h3>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s} className="text-sm text-slate-400">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-widest text-slate-500 uppercase">
              Visit / Contact
            </h3>
            <div className="flex flex-col gap-3.5">
              {contact.map(({ Icon, text, href }) =>
                href ? (
                  <a
                    key={text}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="flex items-start gap-3 text-sm text-slate-400 transition-colors duration-150 hover:text-indigo-400"
                  >
                    <Icon
                      size={15}
                      className="mt-0.5 flex-shrink-0 text-indigo-500"
                    />
                    <span>{text}</span>
                  </a>
                ) : (
                  <div
                    key={text}
                    className="flex items-start gap-3 text-sm text-slate-400"
                  >
                    <Icon
                      size={15}
                      className="mt-0.5 flex-shrink-0 text-indigo-500"
                    />
                    <span>{text}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-slate-800" />

        {/* Bottom bar */}
        <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Shri Shivshakti Car Bazar. All rights
            reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {legal.map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-slate-500 transition-colors duration-150 hover:text-indigo-400"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MobailFooter;
