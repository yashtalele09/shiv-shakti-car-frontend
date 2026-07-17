import { Car, Home, Phone, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileBottomNavProps {
  expanded: boolean;
}

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/vehicle', icon: Car, label: 'Vehicle' },
  { path: '/contact', icon: Phone, label: 'Contact' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const MobileBottomNav = ({ expanded }: MobileBottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed right-2 bottom-2 left-2 z-50 flex h-[64px] items-center justify-around rounded-2xl border border-white/60 bg-white/80 px-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-400 ease-out dark:border-white/10 dark:bg-zinc-900/80 ${
        expanded
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-full opacity-0'
      } `}
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,245,240,0.9) 100%)',
      }}
    >
      {/* Top Accent Line */}
      <span
        className="absolute top-0 left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #FFA1A1, #FFD9A1)',
        }}
      />

      {navItems.map(({ path, icon: Icon, label }) => {
        const active = isActive(path);

        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="group relative flex h-full flex-1 flex-col items-center justify-center gap-[2px]"
          >
            {/* Active Background */}
            <span
              className={`absolute inset-x-2 inset-y-[8px] rounded-xl transition-all duration-300 ${
                active
                  ? 'scale-100 opacity-100'
                  : 'scale-90 opacity-0 group-hover:scale-95 group-hover:opacity-50'
              } `}
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,161,161,0.18), rgba(255,217,161,0.18))',
              }}
            />

            {/* Icon */}
            <span
              className={`relative z-10 transition-all duration-300 ${
                active
                  ? '-translate-y-[1px] scale-110'
                  : 'group-hover:scale-105'
              } `}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.2 : 1.8}
                fill={active ? 'url(#navGrad)' : 'none'}
                style={{
                  color: active ? '#E8727A' : '#9ca3af',
                  filter: active
                    ? 'drop-shadow(0 1px 4px rgba(232,114,122,0.4))'
                    : 'none',
                }}
              />
            </span>

            {/* Label */}
            <span
              className={`text-[10px] font-medium transition-all duration-300 ${
                active
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-60'
              } `}
              style={{
                color: active ? '#E8727A' : '#9ca3af',
                fontFamily: "'SF Pro Rounded', 'Nunito', sans-serif",
                background: active
                  ? 'linear-gradient(90deg, #FFA1A1, #E8A07A)'
                  : 'none',
                WebkitBackgroundClip: active ? 'text' : 'unset',
                WebkitTextFillColor: active ? 'transparent' : 'unset',
              }}
            >
              {label}
            </span>

            {/* Active Dot */}
            {active && (
              <span
                className="absolute bottom-[5px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #FFA1A1, #FFD9A1)',
                  boxShadow: '0 0 4px rgba(255,161,161,0.6)',
                }}
              />
            )}
          </button>
        );
      })}

      {/* SVG Gradient */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA1A1" />
            <stop offset="100%" stopColor="#E8A07A" />
          </linearGradient>
        </defs>
      </svg>
    </nav>
  );
};

export default MobileBottomNav;
