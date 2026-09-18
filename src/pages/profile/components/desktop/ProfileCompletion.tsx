import { UserRound } from 'lucide-react';

const ProfileCompletion = () => {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <UserRound className="h-[18px] w-[18px] text-slate-700" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">
                Complete your profile
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                Add your details for a better buying experience.
              </p>
            </div>

            <span className="text-sm font-bold text-slate-700">80%</span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[80%] rounded-full bg-slate-900" />
          </div>
        </div>

        <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
          Complete
        </button>
      </div>
    </div>
  );
};

export default ProfileCompletion;
