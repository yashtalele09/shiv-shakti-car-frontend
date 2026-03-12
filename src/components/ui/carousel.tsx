"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type Direction = "left" | "right";
type Speed = "slow" | "normal" | "fast";

interface InfiniteCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  speed?: Speed;
  direction?: Direction;
  pauseOnHover?: boolean;
  className?: string;
  gap?: number;
}

const speedMap: Record<Speed, string> = {
  slow: "25s",
  normal: "15s",
  fast: "8s",
};

export function InfiniteCarousel({
  children,
  speed = "normal",
  direction = "left",
  pauseOnHover = true,
  className,
  gap = 8,
  ...props
}: InfiniteCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const slides = React.Children.toArray(children);
  // Use triple duplication for seamless infinite loop
  const duplicatedSlides = [...slides, ...slides, ...slides];

  useEffect(() => {
    const initializeCarousel = () => {
      if (containerRef.current && trackRef.current) {
        // Calculate the width of one complete set of slides
        const fullTrackWidth = trackRef.current.scrollWidth;
        const singleSetWidth = fullTrackWidth / 3; // Since we have 3 copies

        // Set CSS custom properties for animation
        containerRef.current.style.setProperty(
          "--single-set-width",
          `${singleSetWidth}px`
        );

        setIsReady(true);
      }
    };

    // Initialize after a brief delay to ensure DOM is ready
    const timer = setTimeout(initializeCarousel, 100);

    // Use ResizeObserver for responsive updates
    const resizeObserver = new ResizeObserver(() => {
      setIsReady(false);
      setTimeout(initializeCarousel, 50);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [children]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  return (
    <>
      <style>{`
        .infinite-carousel {
          --single-set-width: 0px;
        }
        
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-1 * var(--single-set-width)));
          }
        }
        
        @keyframes scroll-right {
          0% {
            transform: translateX(calc(-1 * var(--single-set-width)));
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .carousel-track {
          animation: ${direction === "left" ? "scroll-left" : "scroll-right"} ${
        speedMap[speed]
      } linear infinite;
          animation-play-state: ${isPaused ? "paused" : "running"};
          visibility: ${isReady ? "visible" : "hidden"};
        }
        
        .carousel-track.ready {
          transition: none;
        }
      `}</style>
      <div
        ref={containerRef}
        className={cn(
          "infinite-carousel relative w-full overflow-hidden",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <div
          ref={trackRef}
          className={cn("carousel-track flex will-change-transform", {
            ready: isReady,
          })}
          style={{
            gap: `${gap}px`,
            width: "max-content",
          }}
        >
          {duplicatedSlides.map((slide, index) => (
            <div
              key={`slide-${index}-${Math.floor(index / slides.length)}`}
              className="flex-shrink-0"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
