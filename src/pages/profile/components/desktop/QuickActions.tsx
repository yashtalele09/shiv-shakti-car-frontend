import { ChevronRight, FileText, Heart } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: 'Saved Cars',
      description: 'View your shortlist',
      icon: Heart,
    },
    {
      title: 'My Enquiries',
      description: 'Track your enquiries',
      icon: FileText,
    },
  ];

  return (
    <section className="mt-8">
      <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition group-hover:bg-slate-900">
                <Icon className="h-[17px] w-[17px] text-slate-600 transition group-hover:text-white" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800">
                  {action.title}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  {action.description}
                </p>
              </div>

              <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
