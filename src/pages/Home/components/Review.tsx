import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Review as ReviewApiType } from '../../../typs/reviews/get';

interface Props {
  reviews: ReviewApiType[];
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`h-3.5 w-3.5 ${star <= rating ? 'text-amber-400' : 'text-white/20'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const QuoteIcon = () => (
  <svg
    className="h-8 w-8 text-orange-400/60"
    fill="currentColor"
    viewBox="0 0 32 32"
  >
    <path d="M10 8C5.6 8 2 11.6 2 16v8h8v-8H6c0-2.2 1.8-4 4-4V8zm16 0c-4.4 0-8 3.6-8 8v8h8v-8h-4c0-2.2 1.8-4 4-4V8z" />
  </svg>
);

const Review = ({ reviews }: Props) => {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const showViewMore = index === reviews.length;
  const totalSlides = reviews.length + 1;
  const navigate = useNavigate();

  useEffect(() => {
    if (!autoplay || showViewMore) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay, showViewMore, totalSlides]);

  const prevSlide = () => {
    setAutoplay(false);
    setIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    setAutoplay(false);
    setIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const goToSlide = (i: number) => {
    setAutoplay(false);
    setIndex(i);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-2 w-full"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ height: '390px', background: '#0f0f0f' }}
      >
        {/* Slides */}
        <div
          className="flex h-full"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {/* Review Slides */}
          {reviews.slice(0, 5).map((item, i) => (
            <div key={i} className="relative h-full min-w-full flex-shrink-0">
              {/* Background Image */}
              {item.images && item.images.length > 0 && (
                <img
                  src={item.images[0]}
                  alt={item.userId.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              {/* Layered Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

              {/* Decorative accent line */}
              <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-400 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                {/* Top: Quote icon + date */}
                <div className="flex items-start justify-between">
                  <QuoteIcon />
                  <span className="font-sans text-[10px] tracking-widest text-white/40 uppercase">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Bottom: Review content */}
                <div>
                  <p
                    className="mb-4 max-w-xs text-sm leading-relaxed text-white/90"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    "{item.review}"
                  </p>

                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-white/20">
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
                      <div>
                        <p className="mb-1 font-sans text-sm leading-none font-semibold text-white">
                          {item.userId.name}
                        </p>
                        <p className="font-sans text-[10px] tracking-wide text-white/40 uppercase">
                          Verified Buyer
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col items-end gap-1">
                      <StarRating rating={item.rating} />
                      <span className="font-sans text-[10px] text-white/40">
                        {item.rating}.0 / 5.0
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* View More Slide */}
          <div
            className="relative flex h-full min-w-full flex-shrink-0 flex-col items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
            }}
          >
            {/* Decorative accent */}
            <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-400 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Circle decoration */}
            <div
              className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-orange-500/20"
              style={{ boxShadow: '0 0 40px rgba(249,115,22,0.08)' }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/30">
                <svg
                  className="h-6 w-6 text-orange-400"
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
            </div>

            <p className="mb-2 font-sans text-[10px] tracking-[0.25em] text-orange-500 uppercase">
              500+ Happy Customers
            </p>
            <h3 className="mb-1 font-sans text-xl font-bold text-white">
              See All Reviews
            </h3>
            <p className="mb-6 max-w-[180px] text-center font-sans text-xs text-white/40">
              Read more verified stories from our customers
            </p>

            <button
              onClick={() => navigate('/reviews')}
              className="group relative overflow-hidden rounded-full bg-orange-500 px-6 py-2.5 font-sans text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-400 active:scale-95"
              style={{ boxShadow: '0 0 20px rgba(249,115,22,0.3)' }}
            >
              View All Reviews
              <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        {index > 0 && (
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-3 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg
              className="h-3.5 w-3.5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {index < totalSlides - 1 && (
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-3 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg
              className="h-3.5 w-3.5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="transition-all duration-300"
              style={{
                width: i === index ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === index ? '#f97316' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>

        {/* Autoplay progress bar */}
        {autoplay && !showViewMore && (
          <div className="absolute top-0 right-0 left-0 z-20 h-[2px]">
            <div
              key={index}
              className="h-full bg-orange-400/50"
              style={{
                animation: 'progress 5s linear',
                transformOrigin: 'left',
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </motion.section>
  );
};

export default Review;
