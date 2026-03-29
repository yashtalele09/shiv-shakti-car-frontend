import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import review from "../../../assets/car-costomer.png";

const reviews = [
  {
    name: "Rahul Roy",
    role: "Verified Buyer",
    text: "I had an amazing experience purchasing my second-hand car from this service. The team was honest and helped me find the perfect car within my budget.",
    image: review,
    rating: 5,
    date: "March 2025",
  },
  {
    name: "Amit Sharma",
    role: "Verified Buyer",
    text: "Great service and smooth buying process. Highly recommended for anyone looking for a reliable used car without any hidden surprises.",
    image: review,
    rating: 5,
    date: "February 2025",
  },
  {
    name: "Rohit Verma",
    role: "Verified Buyer",
    text: "Very professional team and transparent pricing. I'm very satisfied with my purchase. Will definitely return for my next vehicle.",
    image: review,
    rating: 4,
    date: "January 2025",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-3.5 h-3.5 ${star <= rating ? "text-amber-400" : "text-white/20"}`}
        fill="currentColor"
        viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const QuoteIcon = () => (
  <svg
    className="w-8 h-8 text-orange-400/60"
    fill="currentColor"
    viewBox="0 0 32 32">
    <path d="M10 8C5.6 8 2 11.6 2 16v8h8v-8H6c0-2.2 1.8-4 4-4V8zm16 0c-4.4 0-8 3.6-8 8v8h8v-8h-4c0-2.2 1.8-4 4-4V8z" />
  </svg>
);

const Review = () => {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const showViewMore = index === reviews.length;
  const totalSlides = reviews.length + 1;

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
      className="w-full mt-2"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ height: "390px", background: "#0f0f0f" }}>
        {/* Slides */}
        <div
          className="flex h-full"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          }}>
          {/* Review Slides */}
          {reviews.map((item, i) => (
            <div key={i} className="relative min-w-full h-full flex-shrink-0">
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Layered Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

              {/* Decorative accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-400 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                {/* Top: Quote icon + date */}
                <div className="flex items-start justify-between">
                  <QuoteIcon />
                  <span className="text-[10px] font-sans text-white/40 tracking-widest uppercase">
                    {item.date}
                  </span>
                </div>

                {/* Bottom: Review content */}
                <div>
                  <p
                    className="text-white/90 text-sm leading-relaxed mb-4 max-w-xs"
                    style={{ fontFamily: "'Georgia', serif" }}>
                    "{item.text}"
                  </p>

                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm leading-none mb-1 font-sans">
                          {item.name}
                        </p>
                        <p className="text-white/40 text-[10px] font-sans tracking-wide uppercase">
                          {item.role}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col items-end gap-1">
                      <StarRating rating={item.rating} />
                      <span className="text-[10px] text-white/40 font-sans">
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
            className="min-w-full h-full flex-shrink-0 flex flex-col items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)",
            }}>
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-400 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Circle decoration */}
            <div
              className="w-20 h-20 rounded-full border border-orange-500/20 flex items-center justify-center mb-5"
              style={{ boxShadow: "0 0 40px rgba(249,115,22,0.08)" }}>
              <div className="w-14 h-14 rounded-full border border-orange-500/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                  />
                </svg>
              </div>
            </div>

            <p className="text-[10px] font-sans tracking-[0.25em] text-orange-500 uppercase mb-2">
              500+ Happy Customers
            </p>
            <h3 className="text-white text-xl font-bold mb-1 font-sans">
              See All Reviews
            </h3>
            <p className="text-white/40 text-xs font-sans mb-6 text-center max-w-[180px]">
              Read more verified stories from our customers
            </p>

            <button
              className="group relative px-6 py-2.5 rounded-full bg-orange-500 text-white text-sm font-sans font-semibold overflow-hidden transition-all duration-300 hover:bg-orange-400 active:scale-95"
              style={{ boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}>
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
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
            }}>
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24">
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
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
            }}>
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="transition-all duration-300"
              style={{
                width: i === index ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === index ? "#f97316" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>

        {/* Autoplay progress bar */}
        {autoplay && !showViewMore && (
          <div className="absolute top-0 left-0 right-0 h-[2px] z-20">
            <div
              key={index}
              className="h-full bg-orange-400/50"
              style={{
                animation: "progress 5s linear",
                transformOrigin: "left",
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
