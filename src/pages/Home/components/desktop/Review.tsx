import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Review as ReviewApiType } from '../../../../typs/reviews/get';

interface Props {
  reviews: ReviewApiType[];
}

const clamp = (lines: number): React.CSSProperties => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

const StarRating = ({
  rating,
  size = 'sm',
}: {
  rating: number;
  size?: 'sm' | 'md';
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`${size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'} ${
          star <= rating ? 'text-amber-400' : 'text-white/20'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const QuoteIcon = ({ className = 'h-8 w-8' }: { className?: string }) => (
  <svg
    className={`${className} text-orange-400/60`}
    fill="currentColor"
    viewBox="0 0 32 32"
  >
    <path d="M10 8C5.6 8 2 11.6 2 16v8h8v-8H6c0-2.2 1.8-4 4-4V8zm16 0c-4.4 0-8 3.6-8 8v8h8v-8h-4c0-2.2 1.8-4 4-4V8z" />
  </svg>
);

const Review = ({ reviews }: Props) => {
  const navigate = useNavigate();

  // Desktop data
  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1
      )
    : '0.0';
  const featured = reviews[0];
  const rest = reviews.slice(1, 4);

  return (
    <>
      {/* ============================= DESKTOP — TESTIMONIAL WALL ============================= */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-2 hidden w-[85%] lg:block"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        {/* Header row */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 font-sans text-xs tracking-[0.3em] text-orange-500 uppercase">
              Verified Buyers
            </p>
            <h2 className="text-textPrimary font-sans text-3xl font-bold xl:text-2xl">
              What our customers say
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-textPrimary font-sans text-2xl font-bold">
                {average}
              </p>
              <p className="mt-1 font-sans text-[11px] tracking-wide text-gray-600 uppercase">
                out of 5.0
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <StarRating rating={Math.round(Number(average))} size="md" />
          </div>
        </div>

        {/* Bento wall */}
        <div
          className="grid grid-cols-4 grid-rows-2 gap-4"
          style={{ height: '560px' }}
        >
          {/* Featured review — large */}
          {featured && (
            <div
              className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl"
              style={{ background: '#0f0f0f' }}
            >
              {featured.images && featured.images.length > 0 && (
                <img
                  src={featured.images[0]}
                  alt={featured.userId.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 to-transparent" />
              <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-400 to-transparent" />

              {/* Oversized watermark quote — signature element */}
              <svg
                className="pointer-events-none absolute -right-6 -bottom-10 h-56 w-56 text-white/[0.05]"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M10 8C5.6 8 2 11.6 2 16v8h8v-8H6c0-2.2 1.8-4 4-4V8zm16 0c-4.4 0-8 3.6-8 8v8h8v-8h-4c0-2.2 1.8-4 4-4V8z" />
              </svg>

              <div className="relative flex h-full flex-col justify-between p-8">
                <div className="flex items-start justify-between">
                  <QuoteIcon className="h-10 w-10" />
                  <span className="font-sans text-[11px] tracking-widest text-white/40 uppercase">
                    {new Date(featured.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div>
                  <p
                    className="mb-6 max-w-md text-xl leading-relaxed text-white/90"
                    style={{ ...clamp(5), fontFamily: "'Georgia', serif" }}
                  >
                    "{featured.review}"
                  </p>

                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-white/20">
                        <img
                          src={
                            featured.images && featured.images.length > 0
                              ? featured.images[0]
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  featured.userId.name
                                )}&background=F97316&color=ffffff&bold=true`
                          }
                          alt={featured.userId.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="mb-1 font-sans text-sm leading-none font-semibold text-white">
                          {featured.userId.name}
                        </p>
                        <p className="font-sans text-[10px] tracking-wide text-white/40 uppercase">
                          Verified Buyer
                        </p>
                      </div>
                    </div>
                    <StarRating rating={featured.rating} size="md" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compact reviews */}
          {rest.map((item, i) => (
            <div
              key={i}
              className="group relative col-span-1 row-span-1 overflow-hidden rounded-2xl"
              style={{ background: '#0f0f0f' }}
            >
              {item.images && item.images.length > 0 && (
                <img
                  src={item.images[0]}
                  alt={item.userId.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-90"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
              <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-orange-500/70 via-amber-400/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col justify-between p-4">
                <div className="flex items-start justify-between">
                  <QuoteIcon className="h-5 w-5" />
                  <StarRating rating={item.rating} />
                </div>

                <div>
                  <p
                    className="mb-3 text-[13px] leading-snug text-white/85"
                    style={{ ...clamp(3), fontFamily: "'Georgia', serif" }}
                  >
                    "{item.review}"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full border border-white/20">
                      <img
                        src={
                          item.images && item.images.length > 0
                            ? item.images[0]
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                item.userId.name
                              )}&background=F97316&color=ffffff&bold=true`
                        }
                        alt={item.userId.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="font-sans text-xs leading-none font-semibold text-white">
                      {item.userId.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* View more cell */}
          <button
            onClick={() => navigate('/reviews')}
            className="group relative col-span-1 row-span-1 flex flex-col items-center justify-center overflow-hidden rounded-2xl p-4 text-center transition-transform duration-300 hover:scale-[1.02] active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
            }}
          >
            <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-400 to-transparent" />
            <div
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/30 transition-colors duration-300 group-hover:border-orange-500/60"
              style={{ boxShadow: '0 0 24px rgba(249,115,22,0.1)' }}
            >
              <svg
                className="h-5 w-5 text-orange-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </div>
            <p className="mb-1 font-sans text-[10px] tracking-[0.2em] text-orange-500 uppercase">
              500+ Reviews
            </p>
            <p className="font-sans text-sm font-bold text-white">
              View All
              <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </p>
          </button>
        </div>
      </motion.section>
    </>
  );
};

export default Review;
