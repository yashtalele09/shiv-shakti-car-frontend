import { ChevronRight, LogOut } from 'lucide-react';

import useAuthStore from '../../../../store/authStore';
import { mainItems, accountItems } from '../../constants/ProfileMenu';

const ProfileNavigation = () => {
  const logout = useAuthStore((s: any) => s.logout);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2">
      <p className="px-3 pt-2 pb-2 text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
        Account
      </p>

      <nav className="space-y-1">
        {mainItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                index === 0
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-[17px] w-[17px]" />

              <span className="flex-1 text-[13px] font-semibold">
                {item.label}
              </span>

              {item.count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    index === 0
                      ? 'bg-white/10 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="my-3 border-t border-slate-100" />

      <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
        Preferences
      </p>

      <nav className="space-y-1">
        {accountItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-600 transition hover:bg-slate-50"
            >
              <Icon className="h-[17px] w-[17px]" />

              <span className="text-[13px] font-semibold">{item.label}</span>

              <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-300" />
            </button>
          );
        })}
      </nav>

      <div className="my-3 border-t border-slate-100" />

      <button
        onClick={logout}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-red-500 transition hover:bg-red-50"
      >
        <LogOut className="h-[17px] w-[17px]" />

        <span className="text-[13px] font-semibold">Log Out</span>
      </button>
    </div>
  );
};

export default ProfileNavigation;
