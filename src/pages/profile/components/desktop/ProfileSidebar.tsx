import { motion } from 'framer-motion';
import {
  CalendarDays,
  Edit3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  user: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  onEdit: () => void;
}

const ProfileSidebar = ({ user, onEdit }: Props) => {
  const initials =
    user.name
      ?.split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
    >
      {/* Cover */}
      <div className="relative h-20 overflow-hidden bg-slate-900">
        <div className="absolute -top-12 -right-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 left-12 h-32 w-32 rounded-full bg-white/5" />
      </div>

      <div className="relative px-5 pb-5">
        {/* Avatar */}
        <div className="-mt-9 flex items-end justify-between">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-[72px] w-[72px] rounded-2xl border-4 border-white object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-4 border-white bg-slate-100 shadow-sm">
              <span className="text-xl font-bold text-slate-600">
                {initials}
              </span>
            </div>
          )}

          <button
            onClick={onEdit}
            className="mb-1 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <Edit3 className="h-3 w-3" />
            Edit
          </button>
        </div>

        {/* User information */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-base font-bold text-slate-900">
              {user.name}
            </h2>

            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
          </div>

          {user.email && (
            <div className="mt-2 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />

              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
          )}

          {user.phone && (
            <div className="mt-1.5 flex items-center gap-2">
              <span className="w-3.5 text-center text-[11px] text-slate-400">
                <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              </span>

              <p className="text-xs text-slate-400">{user.phone}</p>
            </div>
          )}
        </div>

        {/* Verification */}
        <div className="mt-5 rounded-xl bg-emerald-50 p-3">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

            <div>
              <p className="text-xs font-bold text-emerald-700">
                Verified account
              </p>

              <p className="mt-0.5 text-[10px] leading-4 text-emerald-600/70">
                Your account information has been verified.
              </p>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="h-3.5 w-3.5" />
            <span>India</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Member since 2025</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSidebar;
