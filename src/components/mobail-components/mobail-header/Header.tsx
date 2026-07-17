import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/logdumy.png';
import Search from './Search';
import useAuthStore from '../../../store/authStore';

const Header = ({
  expanded,
  isHomePage = false,
}: {
  expanded: boolean;
  isHomePage?: boolean;
  onBack?: () => void;
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false); // ← new

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const hideHeaderRoutes = ['/profile', '/vehicle-details', '/verify-otp'];
  const isVehicleDetailsPage = location.pathname.startsWith('/vehicle/');
  const shouldHideCompletely =
    hideHeaderRoutes.includes(location.pathname) || isVehicleDetailsPage;

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 8);
      setShowHeader(!(currentScrollY > lastScrollY && currentScrollY > 70));
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (shouldHideCompletely) return null;

  // ─── Compact / home header ───────────────────────────────────────────────
  if (isHomePage && !expanded) {
    return (
      <header
        className={`fixed top-0 left-0 z-50 flex w-full items-center justify-between px-5 transition-all duration-300 ease-in-out ${
          showHeader
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        } ${
          scrolled
            ? 'border-b bg-white/90 shadow-md backdrop-blur-md'
            : 'bg-transparent backdrop-blur-sm'
        }`}
        style={{ height: '60px' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo"
            className="h-15 w-20 object-contain drop-shadow-sm"
          />
          <div className="h-5 w-[1px] bg-gray-300" />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-red-100 hover:text-red-500">
                <span className="absolute top-1 right-1 h-2 w-2 animate-ping rounded-full bg-red-500" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
              <div className="mx-1 h-5 w-[1px] bg-gray-300" />
            </>
          )}

          {isAuthenticated && user ? (
            <button
              onClick={() => navigate('/profile')}
              className="relative"
              aria-label="Go to profile"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FFA1A1] to-[#FFD9A1] p-[2px] shadow-md">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-500 text-xs font-semibold text-white">
                  {getInitials(user.name)}
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => navigate('/sign-in')}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#FFA1A1] to-[#FFD9A1] px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
            >
              Login
            </button>
          )}
        </div>
      </header>
    );
  }

  // ─── Expanded / search header ─────────────────────────────────────────────
  return (
    <header
      className={`fixed top-0 left-0 z-50 flex w-full items-center gap-3 bg-gradient-to-r from-[#FFA1A1] to-[#FFD9A1] px-4 shadow-lg transition-all duration-300 ease-in-out ${
        showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{ height: '60px' }}
    >
      {/* Logo — always visible */}
      <img
        src={logo}
        alt="logo"
        className="h-15 w-20 shrink-0 object-contain drop-shadow-sm"
      />

      {/* Search area */}
      <div className="relative flex flex-1 items-center justify-end overflow-hidden">
        {/* Search bar — slides in from the right */}
        <div
          className={`absolute inset-0 flex items-center transition-all duration-300 ease-in-out ${
            searchOpen
              ? 'translate-x-0 opacity-100'
              : 'pointer-events-none translate-x-full opacity-0'
          }`}
        >
          <Search />
        </div>

        {/* Magnifier button — visible when search is closed */}
        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Open search"
          className={`flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/50 active:scale-95 ${
            searchOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
        </button>

        {/* Close (✕) button — visible when search is open */}
        {searchOpen && (
          <button
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="absolute right-0 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 active:scale-95"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
