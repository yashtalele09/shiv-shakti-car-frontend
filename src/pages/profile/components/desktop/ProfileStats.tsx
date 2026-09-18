import { Car, FileText, Heart } from 'lucide-react';

const stats = [
  {
    label: 'Saved Cars',
    value: 12,
    description: 'Cars you are interested in',
    icon: Heart,
  },
  {
    label: 'My Enquiries',
    value: 8,
    description: 'Active enquiries',
    icon: FileText,
  },
  {
    label: 'My Listings',
    value: 2,
    description: 'Cars currently for sale',
    icon: Car,
  },
];

const ProfileStats = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Icon className="h-[18px] w-[18px] text-slate-700" />
              </div>
            </div>

            <p className="mt-5 text-2xl font-bold text-slate-900">
              {stat.value}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {stat.label}
            </p>

            <p className="mt-1 text-xs text-slate-400">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileStats;
