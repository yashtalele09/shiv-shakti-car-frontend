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
  Send,
} from 'lucide-react';
import logoimg from '../../assets/logdumy.png';

const DesktopFooter = () => {
  const [logoFailed, setLogoFailed] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="hidden w-full bg-linear-to-r from-[#02061D] to-[#002F54] lg:block">
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-600" />

      {/* Newsletter strip */}
      <div className="border-b border-slate-800/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-10 py-8 xl:px-14">
          <div>
            <h3 className="text-lg font-bold text-white">
              Get the best deals first
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              New verified listings and price drops, straight to your inbox.
            </p>
          </div>

          {subscribed ? (
            <p className="text-sm font-medium text-indigo-400">
              You're subscribed - thank you!
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-md items-center gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-white transition-colors duration-150 outline-none placeholder:text-slate-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-indigo-500"
              >
                Subscribe
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-10 pt-14 pb-10 xl:px-14">
        <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_1.2fr] gap-10 xl:gap-14">
          {/* Brand */}
          <div>
            <a href="/" className="mb-5 flex items-center gap-3">
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-150 hover:-translate-y-0.5 hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
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

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-widest text-slate-500 uppercase">
              Legal
            </h3>
            <ul className="flex flex-col gap-3">
              {legal.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-slate-400 transition-colors duration-150 hover:text-indigo-400"
                  >
                    {item}
                  </a>
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
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Shri Shivshakti Car Bazar. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-600">
              Made with care in Nashik, Maharashtra
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;
