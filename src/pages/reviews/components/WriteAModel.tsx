import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useAddReviewMutation from '../hooks/useAddReviews';

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

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
  const canSubmit = rating > 0 && text.trim().length >= 10 && !isPending;

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - images.length);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setImages((prev) => [
          ...prev,
          { file: f, preview: ev.target?.result as string },
        ]);
      reader.readAsDataURL(f);
    });
    e.target.value = '';
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const formData = new FormData();

    formData.append('rating', rating.toString());
    formData.append('review', text);

    images.forEach((img) => {
      formData.append('images', img.file);
    });

    addReview(formData);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center"
        style={{
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(0,0,0,0.45)',
        }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          key="sheet"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-full max-w-md rounded-t-3xl bg-white pb-15"
          style={{ maxHeight: '90dvh', overflowY: 'auto' }}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-gray-200" />
          </div>

          <div className="px-5 pt-3">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="mb-0.5 font-sans text-[10px] font-semibold tracking-[0.15em] text-orange-500 uppercase">
                  Share your experience
                </p>
                <h2 className="font-sans text-xl font-bold text-gray-900">
                  Write a Review
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
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

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-10 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
                  <svg
                    className="h-8 w-8 text-orange-500"
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
                <p className="mb-1 font-sans text-lg font-bold text-gray-900">
                  Review Submitted!
                </p>
                <p className="font-sans text-sm text-gray-400">
                  It will appear after verification.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Rating */}
                <div className="mb-5">
                  <p className="mb-2 font-sans text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                    Your Rating
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHovered(s)}
                        onMouseLeave={() => setHovered(0)}
                        className="transition-transform active:scale-90"
                      >
                        <svg
                          className={`h-8 w-8 transition-colors duration-100 ${s <= activeStars ? 'text-amber-400' : 'text-gray-200'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                    {activeStars > 0 && (
                      <span className="ml-1 font-sans text-sm font-semibold text-orange-500">
                        {RATING_LABELS[activeStars]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-5">
                  <p className="mb-2 font-sans text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                    Your Review
                  </p>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, 500))}
                    rows={4}
                    placeholder="Tell others about your experience — car condition, buying process, team support…"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-sans text-sm text-gray-800 transition outline-none placeholder:text-gray-400 focus:border-orange-400 focus:bg-white"
                  />
                  <p className="mt-1 text-right font-sans text-[11px] text-gray-400">
                    {text.length}/500
                  </p>
                </div>

                {/* Image Upload — unchanged */}
                <div className="mb-6">
                  <p className="mb-2 font-sans text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                    Photos{' '}
                    <span className="font-normal tracking-normal text-gray-300 normal-case">
                      (optional)
                    </span>
                  </p>
                  {images.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {images.map((img, i) => (
                        <div key={i} className="relative">
                          <img
                            src={img.preview}
                            className="h-16 w-16 rounded-xl object-cover"
                          />
                          <button
                            onClick={() =>
                              setImages((p) => p.filter((_, idx) => idx !== i))
                            }
                            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {images.length < 5 && (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="flex w-full flex-col items-center gap-1.5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-5 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                      <svg
                        className="h-6 w-6 text-gray-300"
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
                      <span className="font-sans text-xs text-gray-400">
                        Tap to upload · {5 - images.length} remaining
                      </span>
                      <span className="font-sans text-[10px] text-gray-300">
                        JPG, PNG, WEBP · Max 10MB each
                      </span>
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImages}
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="mb-3 rounded-xl bg-red-50 px-4 py-2.5 font-sans text-xs text-red-500">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`mb-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-sans text-sm font-semibold text-white transition-all active:scale-[0.98] ${
                    canSubmit
                      ? 'bg-orange-500 hover:bg-orange-400'
                      : 'cursor-not-allowed bg-orange-200'
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
                    'Post Review'
                  )}
                </button>
                <p className="text-center font-sans text-[11px] text-gray-400">
                  Reviews are verified before publishing
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WriteReviewModal;
