export default function NoData() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 py-10">
      <div className="relative">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-14 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
          0
        </span>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-gray-700">
          No Vehicles Available
        </p>
        <p className="mt-1 text-sm text-gray-400">
          No vehicles match your current filters.
        </p>
      </div>
      <div className="mt-1 flex gap-1.5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 w-24 animate-pulse rounded-xl border border-dashed border-gray-200 bg-gray-100"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
