import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { MENU_ITEMS } from './constants/ProfileMenu';
import ProfileHeader from './components/ProfileHeader';
import MenuCard from './components/MenuCard';
import RateUsCard from './components/RateUsCard';
import LogoutCard from './components/LogOutCard';
import useAuthStore from '../../store/authStore';
import type { User } from './types/Profile';

const ProfilePage = () => {
  const authUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const user: User | null = authUser
    ? {
        name: authUser.name,
        phone: authUser.phone,
        avatar: `https://i.pravatar.cc/150?u=${authUser.id}`,
        memberSince: 'Member since 2022',
        rides: 48,
        rating: 4.9,
        savedCars: 6,
      }
    : null;

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="min-h-screen bg-[#FFF5F7] pb-16"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <ProfileHeader user={user} />

      <div className="mt-6 space-y-3 px-4">
        {user ? (
          <>
            <MenuCard items={MENU_ITEMS} />
            {/* <RateUsCard /> */}
            <LogoutCard onLogout={logout} />
          </>
        ) : (
          <>
            {/* Login card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              onClick={() => navigate('/sign-in')}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm shadow-pink-100 transition-colors hover:bg-pink-50/60"
            >
              <div className="flex items-center gap-3.5 px-4 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50">
                  <LogIn className="h-4 w-4 text-pink-400" />
                </div>
                <p className="font-600 flex-1 text-[14px] text-gray-700">
                  Log In
                </p>
              </div>
            </motion.div>

            {/* Signup card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              onClick={() => navigate('/sign-up')}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm shadow-pink-100 transition-colors hover:bg-purple-50/60"
            >
              <div className="flex items-center gap-3.5 px-4 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                  <UserPlus className="h-4 w-4 text-purple-400" />
                </div>
                <p className="font-600 flex-1 text-[14px] text-gray-700">
                  Create Account
                </p>
              </div>
            </motion.div>

            <RateUsCard />
          </>
        )}

        <p className="pt-2 text-center text-[11px] text-gray-300">
          v2.4.1 · Privacy Policy · Terms
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
