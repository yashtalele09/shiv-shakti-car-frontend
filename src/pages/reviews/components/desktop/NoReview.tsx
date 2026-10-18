const NoReviews = ({ onWrite }: { onWrite: () => void }) => (
  <div className="flex w-full flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white px-8 py-24 text-center">
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#1B2F4B]/5">
      <svg
        className="h-9 w-9 text-[#1B2F4B]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
        />
      </svg>
    </div>
    <h2 className="mb-2 text-xl font-bold text-gray-900">No reviews yet</h2>
    <p className="mb-8 max-w-sm text-sm leading-relaxed text-gray-500">
      Bought a car from us? Tell other buyers about the car, the process and the
      support you received.
    </p>
    <button
      onClick={onWrite}
      className="flex items-center gap-2 rounded-full bg-[#1B2F4B] px-7 py-3.5 text-sm font-semibold text-white shadow-sm shadow-[#1B2F4B]/20 transition-all hover:bg-[#2A4468] focus-visible:ring-2 focus-visible:ring-[#1B2F4B]/40 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
        />
      </svg>
      Write the first review
    </button>
  </div>
);

export default NoReviews;
