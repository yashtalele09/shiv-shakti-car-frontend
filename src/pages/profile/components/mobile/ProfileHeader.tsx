import { Phone, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { User } from '../../types/Profile';

interface Props {
  user: User | null;
}

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

const ProfileHeader = ({ user }: Props) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-[#FFA1A1] to-[#AD93DE] px-5 pt-14 pb-20">
    <div className="absolute -top-10 -right-10 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
    <div className="absolute bottom-0 -left-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex items-center gap-4"
    >
      {user ? (
        <>
          {/* Avatar: initials only, no remote/random image */}
          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl bg-white/25 text-2xl font-bold text-white shadow-lg ring-2 ring-white/60">
            {getInitials(user.name) || (
              <UserCircle2 className="h-9 w-9 text-white/80" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] leading-tight font-bold text-white">
              {user.name}
            </h2>
            <p className="mt-0.5 flex items-center gap-1 text-[13px] text-white/70">
              <Phone className="h-3 w-3" /> {user.phone}
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Guest avatar placeholder */}
          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl bg-white/20 shadow-lg ring-2 ring-white/40">
            <UserCircle2 className="h-9 w-9 text-white/70" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] leading-tight font-bold text-white">
              Hello, Guest
            </h2>
            <p className="mt-0.5 text-[13px] text-white/70">
              Sign in to access your profile
            </p>
          </div>
        </>
      )}
    </motion.div>
  </div>
);

export default ProfileHeader;
