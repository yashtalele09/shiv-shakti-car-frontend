import { motion } from 'framer-motion';
import { ArrowLeft, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import useAuthStore from '../../../store/authStore';

import ProfileSidebar from '../components/desktop/ProfileSidebar';
import ProfileNavigation from '../components/desktop/ProfileNavigation';
import ProfileStats from '../components/desktop/ProfileStats';
import RecentlyViewed from '../components/desktop/RecentlyViewed';
import MyListings from '../components/desktop/MyListings';
import QuickActions from '../components/desktop/QuickActions';

const ProfileDesktopView = () => {
  const authUser = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  if (!authUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">
            <Car className="h-7 w-7 text-white" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Your car account
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to save cars, manage enquiries and track your listings.
          </p>

          <div className="mt-7 space-y-3">
            <button
              onClick={() => navigate('/sign-in')}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              Log In
            </button>

            <button
              onClick={() => navigate('/sign-up')}
              className="w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-[1280px] px-6 pt-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back
        </button>
      </div>

      {/* Content */}

      <main className="mx-auto max-w-[1280px] px-6 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[270px_minmax(0,1fr)]">
          {/* Sidebar */}

          <aside className="space-y-4">
            <ProfileSidebar
              user={authUser}
              onEdit={() => navigate('/profile/edit')}
            />

            <ProfileNavigation />
          </aside>

          {/* Dashboard */}

          <section className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Welcome back, {authUser.name?.split(' ')[0] || 'there'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Here's what's happening with your cars and enquiries.
                </p>
              </div>

              <ProfileStats />
              <RecentlyViewed />

              <MyListings />

              <QuickActions />
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProfileDesktopView;
