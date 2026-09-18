import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logdumy.png';
import Search from '../mobail-components/mobail-header/Search';
import useAuthStore from '../../store/authStore';
import { Mail, Phone, Sparkles } from 'lucide-react';

const navItems = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Vehicles',
    path: '/vehicle',
  },
  {
    name: 'Contact',
    path: '/contact',
  },
  {
    name: 'Profile',
    path: '/profile',
  },
];

// Paths where the header shouldn't render at all
const HIDDEN_HEADER_PATHS = ['/vehicle-details', '/reviews', '/profile'];

const isHiddenHeaderPath = (pathname: string) =>
  HIDDEN_HEADER_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const isHome = location.pathname === '/';

  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (current) => {
    // Only auto-hide-on-scroll on the home page; everywhere else the header stays fixed at the top
    if (!isHome) {
      if (hidden) setHidden(false);
      return;
    }

    const previous = lastScrollY.current;
    const diff = current - previous;

    // Ignore tiny jitters and stay visible near the top of the page
    if (current < 80) {
      setHidden(false);
    } else if (Math.abs(diff) > 4) {
      setHidden(diff > 0);
    }

    lastScrollY.current = current;
  });

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  // Don't render the header at all on these pages
  if (isHiddenHeaderPath(location.pathname)) {
    return null;
  }

  return (
    <motion.header
      animate={{ y: isHome && hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 z-50 flex w-full flex-col"
    >
      {/* Main bar */}
      <div className="relative flex h-20 items-center justify-between border-b border-white/20 bg-white/10 px-8 shadow-[0_2px_20px_-4px_rgba(99,60,220,0.15)] backdrop-blur-2xl backdrop-saturate-150">
        {/* subtle rainbow hairline under the bar */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-indigo-500 via-fuchsia-400 to-amber-400" />

        <motion.button
          type="button"
          whileHover={{ scale: 1.05, rotate: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          className="flex items-center rounded-full bg-slate-200 px-1"
          aria-label="Go to homepage"
        >
          <img
            src={logo}
            alt="Shri Shivshakti Car Bazar"
            className="h-14 w-auto object-contain drop-shadow-sm"
          />
        </motion.button>

        <div className="flex items-center gap-6">
          <Search />

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path}>
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative overflow-hidden rounded-full px-5 py-2 text-sm font-semibold tracking-tight transition-colors duration-200 ${
                      isActive
                        ? 'text-white shadow-md'
                        : isHome
                          ? 'text-white'
                          : 'text-gray-400'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-[#1B2F4B]/50"
                        transition={{
                          type: 'spring',
                          stiffness: 350,
                          damping: 28,
                        }}
                      />
                    )}
                    {item.name}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="h-8 w-px bg-violet-100" />

          {isAuthenticated && user ? (
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/profile')}
              className="relative"
              aria-label="Go to profile"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-400 p-[2.5px] shadow-md">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {getInitials(user.name)}
                </div>
              </div>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/sign-in')}
              className="rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-shadow hover:shadow-lg hover:shadow-violet-300"
            >
              Login
            </motion.button>
          )}
        </div>
      </div>
      <div className="hidden h-9 items-center justify-between overflow-hidden border-b border-white/10 bg-indigo-950/40 px-8 backdrop-blur-xl lg:flex">
        <div className="flex items-center gap-1.5 text-xs font-medium text-violet-200">
          <Sparkles size={12} className="text-amber-300" />
          <span>Trusted pre-owned cars, inspected &amp; verified</span>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-violet-200">
          <a
            href="tel:+919876543210"
            className="flex items-center gap-1.5 transition-colors hover:text-amber-300"
          >
            <Phone size={12} className="text-emerald-400" />
            <span>+91 98765 43210</span>
          </a>

          <div className="h-3.5 w-px bg-violet-700/60" />
          <a
            href="mailto:info@shivshakticarbazar.com"
            className="flex items-center gap-1.5 transition-colors hover:text-amber-300"
          >
            <Mail size={12} className="text-pink-400" />
            <span>info@shivshakticarbazar.com</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
