import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAddReviewMutation from '../../hooks/useAddReviews';

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
const MAX_IMAGES = 5;
const MAX_SIZE_MB = 10;
const MIN_CHARS = 10;
const MAX_CHARS = 500;

const STAR_PATH =
  'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

interface WriteReviewModalProps {
  onClose: () => void;
}

const WriteReviewModal = ({ onClose }: WriteReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState('');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate: addReview, isPending } = useAddReviewMutation({
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(onClose, 1800);
    },
    onError: () => {
      setError('Something went wrong. Please try again.');
    },
  });

  const activeStars = hovered || rating;
  const canSubmit = rating > 0 && text.trim().length >= MIN_CHARS && !isPending;

  // Close on Escape + lock background scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    const valid = picked.filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024);
    if (valid.length < picked.length) {
      setError(
        `Some photos were skipped — each must be under ${MAX_SIZE_MB}MB.`
      );
    } else {
      setError(null);
    }

    valid.slice(0, MAX_IMAGES - images.length).forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setImages((prev) =>
          prev.length >= MAX_IMAGES
            ? prev
            : [...prev, { file: f, preview: ev.target?.result as string }]
        );
      reader.readAsDataURL(f);
    });
    e.target.value = '';
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setError(null);

    const formData = new FormData();
    formData.append('rating', rating.toString());
    formData.append('review', text.trim());
    images.forEach((img) => formData.append('images', img.file));

    addReview(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      style={{
        backdropFilter: 'blur(6px)',
        backgroundColor: 'rgba(17,24,39,0.5)',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="write-review-title"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="no-scrollbar max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-8 pt-7 pb-5">
          <div>
            <h2
              id="write-review-title"
              className="text-xl font-bold text-gray-900"
            >
              Write a review
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Share your experience with other buyers.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-[#1B2F4B]/40 focus-visible:outline-none"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-8 py-6">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-12 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1B2F4B]/5">
                <svg
                  className="h-8 w-8 text-[#1B2F4B]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="mb-1 text-lg font-bold text-gray-900">
                Review submitted
              </p>
              <p className="text-sm text-gray-400">
                It will appear once we verify your purchase.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Rating */}
              <div className="mb-6">
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Your rating
                </p>
                <div
                  className="flex items-center gap-1"
                  onMouseLeave={() => setHovered(0)}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHovered(s)}
                      aria-label={`${s} star${s > 1 ? 's' : ''}`}
                      className="rounded-md p-0.5 transition-transform focus-visible:ring-2 focus-visible:ring-[#1B2F4B]/40 focus-visible:outline-none active:scale-90"
                    >
                      <svg
                        className={`h-9 w-9 transition-colors duration-100 ${
                          s <= activeStars ? 'text-amber-400' : 'text-gray-200'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d={STAR_PATH} />
                      </svg>
                    </button>
                  ))}
                  {activeStars > 0 && (
                    <span className="ml-3 text-sm font-semibold text-[#1B2F4B]">
                      {RATING_LABELS[activeStars]}
                    </span>
                  )}
                </div>
              </div>

              {/* Review text */}
              <div className="mb-6">
                <label
                  htmlFor="review-text"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your review
                </label>
                <textarea
                  id="review-text"
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                  rows={5}
                  placeholder="Tell others about your experience — car condition, buying process, team support…"
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-800 transition outline-none placeholder:text-gray-400 focus:border-[#1B2F4B] focus:bg-white focus:ring-4 focus:ring-[#1B2F4B]/15"
                />
                <div className="mt-1.5 flex justify-between text-xs text-gray-400">
                  <span>
                    {text.trim().length < MIN_CHARS
                      ? `At least ${MIN_CHARS} characters`
                      : ''}
                  </span>
                  <span>
                    {text.length}/{MAX_CHARS}
                  </span>
                </div>
              </div>

              {/* Photos */}
              <div className="mb-6">
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Photos{' '}
                  <span className="font-normal text-gray-400">(optional)</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={img.preview}
                        alt={`Upload ${i + 1}`}
                        className="h-20 w-20 rounded-xl border border-gray-100 object-cover"
                      />
                      <button
                        type="button"
                        aria-label="Remove photo"
                        onClick={() =>
                          setImages((p) => p.filter((_, idx) => idx !== i))
                        }
                        className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white transition hover:bg-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex h-20 min-w-20 flex-1 items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 text-left transition hover:border-[#1B2F4B]/40 hover:bg-[#1B2F4B]/5"
                    >
                      <svg
                        className="h-6 w-6 flex-shrink-0 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5V19a1 1 0 001 1h16a1 1 0 001-1v-2.5M16 10l-4-4m0 0L8 10m4-4v12"
                        />
                      </svg>
                      <span>
                        <span className="block text-xs font-medium text-gray-600">
                          Click to upload · {MAX_IMAGES - images.length} left
                        </span>
                        <span className="block text-[11px] text-gray-400">
                          JPG, PNG, WEBP · up to {MAX_SIZE_MB}MB each
                        </span>
                      </span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImages}
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
                <p className="text-xs text-gray-400">
                  Reviews are verified before publishing.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full px-5 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`flex items-center justify-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold text-white transition-all focus-visible:ring-2 focus-visible:ring-[#1B2F4B]/40 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] ${
                      canSubmit
                        ? 'bg-[#1B2F4B] hover:bg-[#2A4468]'
                        : 'cursor-not-allowed bg-[#1B2F4B]/40'
                    }`}
                  >
                    {isPending ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Posting…
                      </>
                    ) : (
                      'Post review'
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WriteReviewModal;
