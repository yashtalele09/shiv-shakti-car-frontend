import { useState, useEffect, useRef } from "react";
import { Slogans } from "../constants";

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const extendedImages = [...Slogans, Slogans[0]];
  const total = Slogans.length;

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 4000);
  };

  useEffect(() => {
    if (!isPaused) startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  useEffect(() => {
    if (current === total) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(0);
      }, 700);
      setTimeout(() => setTransition(true), 760);
    }
  }, [current]);

  const goTo = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTransition(true);
    setCurrent(index);
    if (!isPaused) startInterval();
  };

  const activeDot = current % total;

  return (
    <div
      className="relative w-[95%] overflow-hidden rounded-2xl shadow-2xl"
      style={{
        height: "260px",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>
      {/* Slide Track */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: transition
            ? "transform 700ms cubic-bezier(0.76, 0, 0.24, 1)"
            : "none",
        }}>
        {extendedImages.map((item, index) => (
          <div key={index} className="relative flex-shrink-0 w-full h-full">
            {/* Background Image */}
            <img
              src={item.url}
              alt="banner"
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay — rich dual-tone */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.45) 100%)",
              }}
            />

            {/* Subtle top vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.5) 100%)",
              }}
            />

            {/* Decorative vertical accent line */}
            <div
              className="absolute left-6 top-8 bottom-8"
              style={{
                width: "2px",
                background:
                  "linear-gradient(to bottom, transparent, #FFD700, transparent)",
                opacity: 0.85,
              }}
            />

            {/* Text Content */}
            <div className="absolute bottom-10 left-10 right-10">
              {/* Eyebrow label */}
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#FFD700",
                  fontFamily: "'Georgia', serif",
                  marginBottom: "6px",
                  opacity: 0.9,
                  fontWeight: 600,
                }}>
                ✦ Featured
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: "clamp(18px, 3.5vw, 26px)",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  lineHeight: 1.2,
                  letterSpacing: "-0.3px",
                  textShadow: "0 2px 20px rgba(0,0,0,0.6)",
                  maxWidth: "70%",
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                }}>
                {item.title}
              </h1>

              {/* Divider */}
              <div
                style={{
                  width: "32px",
                  height: "1.5px",
                  background: "#FFD700",
                  margin: "8px 0",
                  borderRadius: "2px",
                }}
              />

              {/* Subtitle */}
              <p
                style={{
                  fontSize: "12.5px",
                  color: "rgba(255,255,255,0.78)",
                  letterSpacing: "0.2px",
                  fontFamily: "'Georgia', serif",
                  lineHeight: 1.5,
                  textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                  maxWidth: "65%",
                }}>
                {item.subtitle}
              </p>
            </div>

            {/* Slide number — top right */}
            <div
              className="absolute top-5 right-6"
              style={{
                fontSize: "10px",
                letterSpacing: "2px",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'Georgia', serif",
              }}>
              {String(activeDot + 1).padStart(2, "0")}{" "}
              <span style={{ color: "#FFD700" }}>/</span>{" "}
              {String(total).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div
        className="absolute flex items-center gap-2"
        style={{ bottom: "14px", left: "50%", transform: "translateX(-50%)" }}>
        {Slogans.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            style={{
              height: "3px",
              width: activeDot === index ? "24px" : "8px",
              borderRadius: "999px",
              background:
                activeDot === index ? "#FFD700" : "rgba(255,255,255,0.35)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
              outline: "none",
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!isPaused && (
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "2px", background: "rgba(255,255,255,0.1)" }}>
          <div
            key={current}
            style={{
              height: "100%",
              background: "linear-gradient(to right, #FFD700, #FFA500)",
              animation: "progress 4000ms linear forwards",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </div>
  );
};

export default BannerCarousel;
