const NoReviews = ({ onWrite }: { onWrite: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
      <svg
        className="h-7 w-7 text-gray-400"
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
    <p className="mb-1.5 font-sans text-[15px] font-semibold text-gray-900">
      No reviews yet
    </p>
    <p className="mb-6 max-w-[200px] font-sans text-xs leading-relaxed text-gray-400">
      Be the first to share your experience with this product.
    </p>
    <button
      onClick={onWrite}
      className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-sans text-sm font-semibold text-white shadow-sm shadow-orange-200 transition-all hover:bg-orange-400 active:scale-[0.97]"
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
      Write a review
    </button>
  </div>
);
export default NoReviews;
